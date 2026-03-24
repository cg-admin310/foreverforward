"use server";

import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getDocumentGeneratorSystemPrompt,
  getProposalGenerationPrompt,
  getContractGenerationPrompt,
  type ProposalInput,
  type ContractInput,
} from "@/lib/ai/prompts/document-generator";
import { analyzeClientWebsite } from "./website-scraper";
import type { MspClient } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Document {
  id: string;
  client_id: string;
  document_type: "proposal" | "contract" | "invoice" | "certificate" | "report";
  title: string;
  content: string;
  status: "draft" | "sent" | "signed" | "rejected";
  created_at: string;
  updated_at: string;
  sent_at?: string;
  signed_at?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// GENERATE PROPOSAL
// ============================================================================

export async function generateProposal(
  clientId: string,
  options?: {
    customServices?: string[];
    customPricing?: string;
    additionalContext?: string;
    includeWebsiteAnalysis?: boolean;
  }
): Promise<ActionResult<{ content: string; documentId?: string }>> {
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

    // Optionally analyze website first
    let websiteAnalysis;
    if (options?.includeWebsiteAnalysis && client.website) {
      const analysisResult = await analyzeClientWebsite(clientId);
      if (analysisResult.success && analysisResult.data) {
        websiteAnalysis = analysisResult.data;
      }
    }

    // Generate proposal with Claude
    const anthropic = new Anthropic();

    const proposalInput: ProposalInput = {
      client: client as MspClient,
      websiteAnalysis,
      customServices: options?.customServices,
      customPricing: options?.customPricing,
      additionalContext: options?.additionalContext,
    };

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: getDocumentGeneratorSystemPrompt(),
      messages: [
        {
          role: "user",
          content: getProposalGenerationPrompt(proposalInput),
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "No proposal generated" };
    }

    const proposalContent = textContent.text;

    // Save document to database
    const { data: document, error: docError } = await adminClient
      .from("documents")
      .insert({
        client_id: clientId,
        document_type: "proposal",
        title: `IT Services Proposal - ${client.organization_name}`,
        content: proposalContent,
        status: "draft",
        metadata: {
          generated_at: new Date().toISOString(),
          include_website_analysis: options?.includeWebsiteAnalysis,
        },
      })
      .select()
      .single();

    if (docError) {
      console.error("Error saving document:", docError);
      // Return content even if save fails
      return {
        success: true,
        data: { content: proposalContent },
      };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "proposal_generated",
      description: `Proposal generated for ${client.organization_name}`,
      client_id: clientId,
      metadata: { document_id: document.id },
      performed_by: null,
    });

    revalidatePath(`/clients/${clientId}`);

    return {
      success: true,
      data: { content: proposalContent, documentId: document.id },
    };
  } catch (error) {
    console.error("Error generating proposal:", error);
    return { success: false, error: "Failed to generate proposal" };
  }
}

// ============================================================================
// GENERATE CONTRACT
// ============================================================================

export async function generateContract(
  clientId: string,
  contractDetails: {
    servicePackage: string;
    monthlyValue: number;
    contractTermMonths: number;
    startDate: string;
    services: string[];
    additionalTerms?: string;
  }
): Promise<ActionResult<{ content: string; documentId?: string }>> {
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

    // Generate contract with Claude
    const anthropic = new Anthropic();

    const contractInput: ContractInput = {
      client: client as MspClient,
      ...contractDetails,
    };

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: getDocumentGeneratorSystemPrompt(),
      messages: [
        {
          role: "user",
          content: getContractGenerationPrompt(contractInput),
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "No contract generated" };
    }

    const contractContent = textContent.text;

    // Save document to database
    const { data: document, error: docError } = await adminClient
      .from("documents")
      .insert({
        client_id: clientId,
        document_type: "contract",
        title: `IT Services Agreement - ${client.organization_name}`,
        content: contractContent,
        status: "draft",
        metadata: {
          generated_at: new Date().toISOString(),
          contract_details: contractDetails,
        },
      })
      .select()
      .single();

    if (docError) {
      console.error("Error saving document:", docError);
      return {
        success: true,
        data: { content: contractContent },
      };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "contract_generated",
      description: `Contract generated for ${client.organization_name}`,
      client_id: clientId,
      metadata: { document_id: document.id },
      performed_by: null,
    });

    revalidatePath(`/clients/${clientId}`);

    return {
      success: true,
      data: { content: contractContent, documentId: document.id },
    };
  } catch (error) {
    console.error("Error generating contract:", error);
    return { success: false, error: "Failed to generate contract" };
  }
}

// ============================================================================
// GET CLIENT DOCUMENTS
// ============================================================================

export async function getClientDocuments(
  clientId: string
): Promise<ActionResult<Document[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document[] };
  } catch (error) {
    console.error("Error in getClientDocuments:", error);
    return { success: false, error: "Failed to fetch documents" };
  }
}

// ============================================================================
// GET DOCUMENT
// ============================================================================

export async function getDocument(
  documentId: string
): Promise<ActionResult<Document>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Error in getDocument:", error);
    return { success: false, error: "Failed to fetch document" };
  }
}

// ============================================================================
// UPDATE DOCUMENT
// ============================================================================

export async function updateDocument(
  documentId: string,
  updates: {
    content?: string;
    status?: Document["status"];
    title?: string;
  }
): Promise<ActionResult<Document>> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.status === "sent") {
      updateData.sent_at = new Date().toISOString();
    } else if (updates.status === "signed") {
      updateData.signed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("documents")
      .update(updateData)
      .eq("id", documentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating document:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/clients/${data.client_id}`);
    return { success: true, data: data as Document };
  } catch (error) {
    console.error("Error in updateDocument:", error);
    return { success: false, error: "Failed to update document" };
  }
}

// ============================================================================
// DELETE DOCUMENT
// ============================================================================

export async function deleteDocument(
  documentId: string
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get document first for revalidation
    const { data: doc } = await supabase
      .from("documents")
      .select("client_id")
      .eq("id", documentId)
      .single();

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      console.error("Error deleting document:", error);
      return { success: false, error: error.message };
    }

    if (doc?.client_id) {
      revalidatePath(`/clients/${doc.client_id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return { success: false, error: "Failed to delete document" };
  }
}
