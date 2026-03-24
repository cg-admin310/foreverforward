import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  generateTravisSystemPrompt,
  generateConversationContext,
  checkForEscalation,
  type TravisContext,
} from "@/lib/ai/prompts/travis-system";
import type { Participant, TravisConversationInsert } from "@/types/database";

// Initialize AI clients
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// AI response type
interface AIResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

// Call Claude API
async function callClaude(
  systemPrompt: string,
  message: string
): Promise<AIResponse> {
  if (!anthropic) {
    throw new Error("Anthropic API not configured");
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: message }],
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";

  return {
    content,
    model: "claude-sonnet-4-20250514",
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

// Call OpenAI API (fallback)
async function callOpenAI(
  systemPrompt: string,
  message: string
): Promise<AIResponse> {
  if (!openai) {
    throw new Error("OpenAI API not configured");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const content = response.choices[0]?.message?.content || "";

  return {
    content,
    model: "gpt-4o",
    inputTokens: response.usage?.prompt_tokens || 0,
    outputTokens: response.usage?.completion_tokens || 0,
  };
}

// Call AI with fallback
async function callAI(
  systemPrompt: string,
  message: string
): Promise<AIResponse> {
  // Try Claude first
  if (anthropic) {
    try {
      return await callClaude(systemPrompt, message);
    } catch (error) {
      console.warn("Claude API failed, falling back to OpenAI:", error);
    }
  }

  // Fallback to OpenAI
  if (openai) {
    try {
      return await callOpenAI(systemPrompt, message);
    } catch (error) {
      console.error("OpenAI API also failed:", error);
      throw error;
    }
  }

  throw new Error("No AI service configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
}

export async function POST(request: NextRequest) {
  try {
    // Validate at least one API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { participantId, message, conversationHistory } = body;

    // Validate input
    if (!participantId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: participantId and message" },
        { status: 400 }
      );
    }

    // Rate limiting check (simple implementation)
    const messageLength = message.length;
    if (messageLength > 5000) {
      return NextResponse.json(
        { error: "Message too long. Please keep messages under 5000 characters." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Get participant data
    const { data: participant, error: participantError } = await adminClient
      .from("participants")
      .select("*")
      .eq("id", participantId)
      .single();

    if (participantError || !participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Cast participant to proper type
    const typedParticipant = participant as Participant;

    // Get recent check-ins for context
    const { data: recentCheckins } = await adminClient
      .from("checkins")
      .select("checkin_type, notes, created_at, mood_rating")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Check for escalation triggers in the message
    const escalationCheck = checkForEscalation(message);

    // Build context for Travis
    const context: TravisContext = {
      participant: typedParticipant,
      recentCheckins: recentCheckins || undefined,
      programInfo: {
        currentWeek: typedParticipant.current_week || 1,
        totalWeeks: 8, // Default program length
        nextMilestone: undefined,
      },
    };

    // Generate system prompt
    const systemPrompt = generateTravisSystemPrompt(context);

    // Build conversation history for context
    const historyContext = conversationHistory
      ? generateConversationContext(conversationHistory)
      : "";

    // Call AI with fallback (Claude primary, OpenAI fallback)
    const fullSystemPrompt = historyContext
      ? `${systemPrompt}\n\n${historyContext}`
      : systemPrompt;

    const aiResponse = await callAI(fullSystemPrompt, message);
    const assistantMessage = aiResponse.content;

    // Store the conversation in the database
    const userConversation: TravisConversationInsert = {
      participant_id: participantId,
      role: "user",
      content: message,
      model_used: null,
      tokens_used: null,
      escalation_triggered: escalationCheck.shouldEscalate,
      escalation_reason: escalationCheck.reason || null,
    };

    const assistantConversation: TravisConversationInsert = {
      participant_id: participantId,
      role: "assistant",
      content: assistantMessage,
      model_used: aiResponse.model,
      tokens_used: aiResponse.outputTokens,
      escalation_triggered: false,
      escalation_reason: null,
    };

    // Insert both messages
    await adminClient
      .from("travis_conversations")
      .insert([userConversation, assistantConversation]);

    // Update participant's last Travis interaction
    await adminClient
      .from("participants")
      .update({
        travis_last_interaction: new Date().toISOString(),
        travis_escalation_flags: escalationCheck.shouldEscalate
          ? [...(typedParticipant.travis_escalation_flags || []), escalationCheck.reason]
          : typedParticipant.travis_escalation_flags,
      })
      .eq("id", participantId);

    // If escalation triggered, log activity for case worker
    if (escalationCheck.shouldEscalate) {
      await adminClient.from("activities").insert({
        activity_type: "travis_escalation",
        description: `Travis flagged conversation for review: ${escalationCheck.reason}`,
        participant_id: participantId,
        metadata: {
          reason: escalationCheck.reason,
          message_snippet: message.slice(0, 100),
        },
        performed_by: null,
      });
    }

    return NextResponse.json({
      success: true,
      response: assistantMessage,
      model: aiResponse.model,
      escalation: escalationCheck.shouldEscalate
        ? {
            triggered: true,
            reason: escalationCheck.reason,
            message:
              "A member of our team has been notified and will follow up with you.",
          }
        : null,
      usage: {
        inputTokens: aiResponse.inputTokens,
        outputTokens: aiResponse.outputTokens,
      },
    });
  } catch (error) {
    console.error("Travis AI Error:", error);

    // Handle specific API errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Service temporarily busy. Please try again in a moment." },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: "AI service authentication error" },
          { status: 503 }
        );
      }
    }

    // Handle OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Service temporarily busy. Please try again in a moment." },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: "AI service authentication error" },
          { status: 503 }
        );
      }
    }

    // Handle no AI service configured
    if (error instanceof Error && error.message.includes("No AI service configured")) {
      return NextResponse.json(
        { error: "AI service not configured. Please contact support." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get("participantId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!participantId) {
      return NextResponse.json(
        { error: "Missing participantId parameter" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { data: conversations, error } = await adminClient
      .from("travis_conversations")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversation history" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
    });
  } catch (error) {
    console.error("Error in GET /api/ai/travis:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
