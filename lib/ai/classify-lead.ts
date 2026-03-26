"use server";

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getProgramClassifierSystemPrompt,
  getProgramClassificationPrompt,
  getMspClassifierSystemPrompt,
  getMspClassificationPrompt,
  getIntentDetectorSystemPrompt,
  getIntentDetectionPrompt,
} from "@/lib/ai/prompts/lead-classifier";
import type {
  Lead,
  AILeadClassification,
  ProgramAssessmentData,
  EnhancedITAssessmentData,
  ProgramType,
  BarrierType,
  SupportNeedType,
  ReadinessLevel,
  ComplianceRequirement,
} from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AIResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

// ============================================================================
// AI CLIENTS
// ============================================================================

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ============================================================================
// AI CALL FUNCTIONS
// ============================================================================

async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse> {
  if (!anthropic) {
    throw new Error("Anthropic API not configured");
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
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

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse> {
  if (!openai) {
    throw new Error("OpenAI API not configured");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 2048,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt + "\n\nYou must respond with valid JSON." },
      { role: "user", content: userPrompt },
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

async function callAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse> {
  // Try Claude first
  if (anthropic) {
    try {
      return await callClaude(systemPrompt, userPrompt);
    } catch (error) {
      console.warn("Claude API failed, falling back to OpenAI:", error);
    }
  }

  // Fallback to OpenAI
  if (openai) {
    try {
      return await callOpenAI(systemPrompt, userPrompt);
    } catch (error) {
      console.error("OpenAI API also failed:", error);
      throw error;
    }
  }

  throw new Error("No AI service configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
}

// ============================================================================
// JSON PARSING HELPER
// ============================================================================

function extractJSON(content: string): Record<string, unknown> {
  // Try to parse directly first
  try {
    return JSON.parse(content);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Fall through
      }
    }

    // Try to find JSON object in the content
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // Fall through
      }
    }

    console.error("Failed to parse AI response as JSON:", content.slice(0, 500));
    throw new Error("Failed to parse AI response");
  }
}

// ============================================================================
// CLASSIFY LEAD (MAIN FUNCTION)
// ============================================================================

export async function classifyLead(
  leadId: string
): Promise<ActionResult<AILeadClassification>> {
  try {
    // Check if AI is configured
    if (!anthropic && !openai) {
      console.warn("No AI service configured for lead classification");
      return { success: false, error: "AI service not configured" };
    }

    const adminClient = createAdminClient();

    // Get the lead
    const { data: lead, error: leadError } = await adminClient
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return { success: false, error: "Lead not found" };
    }

    let classification: AILeadClassification;

    // Classify based on lead type
    switch (lead.lead_type) {
      case "program":
        classification = await classifyProgramLead(lead);
        break;
      case "msp":
        classification = await classifyMspLead(lead);
        break;
      default:
        classification = await classifyGeneralLead(lead);
    }

    // Update lead with classification
    await adminClient
      .from("leads")
      .update({
        ai_classification: classification,
        priority_score: classification.priority_score,
        fit_score: classification.fit_score || null,
        recommended_programs: classification.recommended_programs || null,
        barriers: classification.barriers_identified as BarrierType[] || null,
        support_needs: classification.support_needs as SupportNeedType[] || null,
        readiness_level: classification.readiness_level || null,
      })
      .eq("id", leadId);

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "ai_classification",
      description: `AI classified lead as ${classification.urgency_level} priority (score: ${classification.priority_score})`,
      lead_id: leadId,
      metadata: {
        model: classification.model_used,
        confidence: classification.confidence,
        urgency: classification.urgency_level,
      },
      performed_by: null,
    });

    return { success: true, data: classification };
  } catch (error) {
    console.error("Error in classifyLead:", error);
    return { success: false, error: "Failed to classify lead" };
  }
}

// ============================================================================
// PROGRAM LEAD CLASSIFICATION
// ============================================================================

async function classifyProgramLead(lead: Lead): Promise<AILeadClassification> {
  const assessment = lead.assessment_data as ProgramAssessmentData | null;

  if (!assessment) {
    // No assessment data - create basic classification
    return {
      lead_type: "program",
      program_interest: lead.program_interest || undefined,
      priority_score: 50,
      urgency_level: "medium",
      fit_score: 60,
      classified_at: new Date().toISOString(),
      model_used: "rule-based",
      confidence: 0.5,
      reasoning: "No assessment data available. Manual review recommended.",
    };
  }

  const systemPrompt = getProgramClassifierSystemPrompt();
  const userPrompt = getProgramClassificationPrompt({ assessment });

  const aiResponse = await callAI(systemPrompt, userPrompt);
  const parsed = extractJSON(aiResponse.content);

  // Extract recommended programs
  const recommendedPrograms = (parsed.recommended_programs as Array<{ program: string; fit_score: number; reasoning: string }>) || [];
  const topProgram = recommendedPrograms[0];

  return {
    lead_type: "program",
    program_interest: topProgram?.program as ProgramType || lead.program_interest || undefined,
    priority_score: (parsed.priority_score as number) || 50,
    urgency_level: (parsed.urgency_level as "low" | "medium" | "high" | "critical") || "medium",
    fit_score: topProgram?.fit_score || 50,
    recommended_programs: recommendedPrograms.map((r) => r.program as ProgramType),
    program_reasoning: topProgram?.reasoning,
    barriers_identified: (parsed.barriers_identified as BarrierType[]) || [],
    support_needs: (parsed.support_needs as SupportNeedType[]) || [],
    readiness_level: (parsed.readiness_level as ReadinessLevel) || "medium",
    classified_at: new Date().toISOString(),
    model_used: aiResponse.model,
    confidence: 0.85,
    reasoning: (parsed.readiness_reasoning as string) || topProgram?.reasoning || "AI classification complete",
  };
}

// ============================================================================
// MSP LEAD CLASSIFICATION
// ============================================================================

async function classifyMspLead(lead: Lead): Promise<AILeadClassification> {
  const assessment = lead.assessment_data as EnhancedITAssessmentData | null;

  if (!assessment) {
    // No assessment data - create basic classification
    return {
      lead_type: "msp",
      service_interests: lead.service_interests || undefined,
      priority_score: 50,
      urgency_level: "medium",
      estimated_value: lead.estimated_value || undefined,
      classified_at: new Date().toISOString(),
      model_used: "rule-based",
      confidence: 0.5,
      reasoning: "No assessment data available. Manual review recommended.",
    };
  }

  const systemPrompt = getMspClassifierSystemPrompt();
  const userPrompt = getMspClassificationPrompt({ assessment });

  const aiResponse = await callAI(systemPrompt, userPrompt);
  const parsed = extractJSON(aiResponse.content);

  return {
    lead_type: "msp",
    service_interests: (parsed.service_recommendations as string[]) || lead.service_interests || undefined,
    priority_score: (parsed.priority_score as number) || 50,
    urgency_level: (parsed.urgency_level as "low" | "medium" | "high" | "critical") || "medium",
    fit_score: (parsed.fit_score as number) || 60,
    estimated_value: (parsed.estimated_monthly_value as number) || lead.estimated_value || undefined,
    recommended_package: (parsed.recommended_package as "foundation" | "growth" | "enterprise" | "custom") || undefined,
    pain_points: (parsed.pain_points as string[]) || [],
    infrastructure_summary: parsed.infrastructure_summary as {
      users?: number;
      devices?: number;
      servers?: number;
      locations?: number;
      compliance_needs?: ComplianceRequirement[];
    } || undefined,
    classified_at: new Date().toISOString(),
    model_used: aiResponse.model,
    confidence: 0.85,
    reasoning: (parsed.reasoning as string) || "AI classification complete",
  };
}

// ============================================================================
// GENERAL LEAD CLASSIFICATION (INTENT DETECTION)
// ============================================================================

async function classifyGeneralLead(lead: Lead): Promise<AILeadClassification> {
  // Try to detect intent from notes/message
  const message = lead.notes || "";

  if (!message) {
    return {
      lead_type: lead.lead_type,
      priority_score: 40,
      urgency_level: "low",
      classified_at: new Date().toISOString(),
      model_used: "rule-based",
      confidence: 0.3,
      reasoning: "No message content to analyze. Manual review recommended.",
    };
  }

  const systemPrompt = getIntentDetectorSystemPrompt();
  const userPrompt = getIntentDetectionPrompt({
    message,
    name: `${lead.first_name} ${lead.last_name}`,
    organization: lead.organization || undefined,
  });

  const aiResponse = await callAI(systemPrompt, userPrompt);
  const parsed = extractJSON(aiResponse.content);

  const detectedIntent = parsed.detected_intent as string;

  return {
    lead_type: (detectedIntent as Lead["lead_type"]) || lead.lead_type,
    program_interest: (parsed.suggested_program_interest as ProgramType) || undefined,
    service_interests: (parsed.suggested_services as string[]) || undefined,
    priority_score: (parsed.priority_score as number) || 40,
    urgency_level: (parsed.urgency_level as "low" | "medium" | "high" | "critical") || "low",
    classified_at: new Date().toISOString(),
    model_used: aiResponse.model,
    confidence: (parsed.confidence as number) || 0.7,
    reasoning: (parsed.reasoning as string) || "AI intent detection complete",
  };
}

// ============================================================================
// BATCH CLASSIFICATION
// ============================================================================

export async function classifyLeads(
  leadIds: string[]
): Promise<ActionResult<{ classified: number; failed: number }>> {
  let classified = 0;
  let failed = 0;

  for (const leadId of leadIds) {
    const result = await classifyLead(leadId);
    if (result.success) {
      classified++;
    } else {
      failed++;
    }
  }

  return {
    success: true,
    data: { classified, failed },
  };
}

// ============================================================================
// MANUAL TRIGGER (FOR ADMIN UI)
// ============================================================================

export async function triggerClassification(
  leadId: string
): Promise<ActionResult<AILeadClassification>> {
  return classifyLead(leadId);
}
