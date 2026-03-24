"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getClientAnalysisSystemPrompt,
  getClientAnalysisPrompt,
  type ClientAnalysisResult,
  type ClientWebsiteData,
} from "@/lib/ai/prompts/client-analysis";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// SCRAPE WEBSITE
// ============================================================================

async function fetchWebsiteContent(url: string): Promise<{
  content: string;
  title?: string;
}> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ForeverForwardBot/1.0; +https://forever4ward.org)",
        Accept: "text/html,application/xhtml+xml",
      },
      // 10 second timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    // Strip HTML tags and normalize whitespace for content
    const textContent = html
      // Remove script and style tags with content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove all HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode common HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim();

    return { content: textContent, title };
  } catch (error) {
    console.error("Error fetching website:", error);
    throw new Error("Failed to fetch website content");
  }
}

// ============================================================================
// ANALYZE CLIENT WEBSITE
// ============================================================================

export async function analyzeClientWebsite(
  clientId: string
): Promise<ActionResult<ClientAnalysisResult>> {
  try {
    const adminClient = createAdminClient();

    // Get client data
    const { data: client, error: clientError } = await adminClient
      .from("msp_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    if (!client.website) {
      return { success: false, error: "Client has no website URL" };
    }

    // Fetch website content
    const websiteData = await fetchWebsiteContent(client.website);

    // Analyze with Claude
    const anthropic = new Anthropic();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: getClientAnalysisSystemPrompt(),
      messages: [
        {
          role: "user",
          content: getClientAnalysisPrompt({
            url: client.website,
            content: websiteData.content,
            title: websiteData.title,
          }),
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "No analysis generated" };
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Failed to parse analysis result" };
    }

    const analysis: ClientAnalysisResult = JSON.parse(jsonMatch[0]);

    // Save analysis to client notes or a separate field
    const existingNotes = client.notes || "";
    const timestamp = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const analysisNote = `[${timestamp}] Website Analysis:\n${analysis.organization_summary}\n\nRecommended Services: ${analysis.recommended_services?.join(", ")}\n\nKey Points: ${analysis.proposal_talking_points?.join("; ")}`;

    const updatedNotes = existingNotes
      ? `${existingNotes}\n\n${analysisNote}`
      : analysisNote;

    await adminClient
      .from("msp_clients")
      .update({ notes: updatedNotes })
      .eq("id", clientId);

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "website_analyzed",
      description: `Website analyzed for ${client.organization_name}`,
      client_id: clientId,
      metadata: { analysis },
      performed_by: null,
    });

    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error analyzing website:", error);
    return { success: false, error: "Failed to analyze website" };
  }
}

// ============================================================================
// SCRAPE WEBSITE ONLY (without full analysis)
// ============================================================================

export async function scrapeWebsite(
  url: string
): Promise<ActionResult<ClientWebsiteData>> {
  try {
    const websiteData = await fetchWebsiteContent(url);
    return {
      success: true,
      data: {
        url,
        content: websiteData.content,
        title: websiteData.title,
      },
    };
  } catch (error) {
    console.error("Error scraping website:", error);
    return { success: false, error: "Failed to scrape website" };
  }
}
