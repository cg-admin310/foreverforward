"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead, LeadInsert, LeadUpdate, LeadType, LeadStatus, ProgramType } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LeadFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  title?: string;
  leadType: LeadType;
  programInterest?: ProgramType;
  serviceInterests?: string[];
  source?: string;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// ============================================================================
// CREATE LEAD
// ============================================================================

export async function createLead(input: LeadFormInput): Promise<ActionResult<Lead>> {
  try {
    const adminClient = createAdminClient();

    const leadData: LeadInsert = {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone || null,
      organization: input.organization || null,
      title: input.title || null,
      lead_type: input.leadType,
      status: "new",
      program_interest: input.programInterest || null,
      service_interests: input.serviceInterests || null,
      source: input.source || "website",
      notes: input.notes || null,
      utm_source: input.utmSource || null,
      utm_medium: input.utmMedium || null,
      utm_campaign: input.utmCampaign || null,
      priority_score: null,
      estimated_value: null,
      referral_source: null,
      ai_classification: null,
      assigned_to: null,
      tags: null,
      contacted_at: null,
      converted_at: null,
    };

    const { data, error } = await adminClient
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "lead_created",
      description: `New ${input.leadType} lead created: ${input.firstName} ${input.lastName}`,
      lead_id: data.id,
      metadata: { source: input.source },
      performed_by: null, // System action
    });

    revalidatePath("/dashboard/leads");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createLead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

// ============================================================================
// GET LEADS
// ============================================================================

export async function getLeads(options?: {
  type?: LeadType;
  status?: LeadStatus;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ActionResult<{ leads: Lead[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.type) {
      query = query.eq("lead_type", options.type);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,organization.ilike.%${options.search}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching leads:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { leads: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getLeads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}

// ============================================================================
// GET SINGLE LEAD
// ============================================================================

export async function getLead(id: string): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getLead:", error);
    return { success: false, error: "Failed to fetch lead" };
  }
}

// ============================================================================
// UPDATE LEAD
// ============================================================================

export async function updateLead(
  id: string,
  updates: LeadUpdate
): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "lead_updated",
      description: `Lead updated: ${data.first_name} ${data.last_name}`,
      lead_id: id,
      metadata: { updates: Object.keys(updates) },
      performed_by: null,
    });

    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateLead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

// ============================================================================
// UPDATE LEAD STATUS
// ============================================================================

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: LeadUpdate = { status };

    if (status === "contacted") {
      updateData.contacted_at = new Date().toISOString();
    } else if (status === "converted") {
      updateData.converted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead status:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "status_change",
      description: `Lead status changed to ${status}`,
      lead_id: id,
      metadata: { new_status: status },
      performed_by: null,
    });

    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateLeadStatus:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

// ============================================================================
// DELETE LEAD
// ============================================================================

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting lead:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteLead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}

// ============================================================================
// CONVERT LEAD TO PARTICIPANT
// ============================================================================

export async function convertLeadToParticipant(
  leadId: string,
  additionalData?: {
    cohort_id?: string;
    goals?: string;
    barriers?: string;
  }
): Promise<ActionResult<{ participantId: string }>> {
  try {
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

    if (lead.lead_type !== "program") {
      return { success: false, error: "Only program leads can be converted to participants" };
    }

    // Create participant
    const { data: participant, error: participantError } = await adminClient
      .from("participants")
      .insert({
        lead_id: leadId,
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        program: lead.program_interest || "father_forward",
        status: "enrolled",
        cohort_id: additionalData?.cohort_id || null,
        goals: additionalData?.goals || null,
        barriers: additionalData?.barriers || null,
        how_did_you_hear: lead.source,
        enrolled_at: new Date().toISOString(),
        current_week: 1,
        progress_percentage: 0,
        state: "CA",
      })
      .select()
      .single();

    if (participantError) {
      console.error("Error creating participant:", participantError);
      return { success: false, error: participantError.message };
    }

    // Update lead status
    await adminClient
      .from("leads")
      .update({ status: "converted", converted_at: new Date().toISOString() })
      .eq("id", leadId);

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "lead_converted",
      description: `Lead converted to participant: ${lead.first_name} ${lead.last_name}`,
      lead_id: leadId,
      participant_id: participant.id,
      metadata: { program: lead.program_interest },
      performed_by: null,
    });

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/programs/participants");
    return { success: true, data: { participantId: participant.id } };
  } catch (error) {
    console.error("Error in convertLeadToParticipant:", error);
    return { success: false, error: "Failed to convert lead to participant" };
  }
}

// ============================================================================
// CONVERT LEAD TO MSP CLIENT
// ============================================================================

export async function convertLeadToClient(
  leadId: string,
  additionalData?: {
    organization_type?: string;
    website?: string;
    service_package?: string;
    services?: string[];
    user_count?: number;
    monthly_value?: number;
  }
): Promise<ActionResult<{ clientId: string }>> {
  try {
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

    if (lead.lead_type !== "msp") {
      return { success: false, error: "Only MSP leads can be converted to clients" };
    }

    // Create MSP client
    const { data: client, error: clientError } = await adminClient
      .from("msp_clients")
      .insert({
        lead_id: leadId,
        organization_name: lead.organization || `${lead.first_name} ${lead.last_name}`,
        organization_type: additionalData?.organization_type || "nonprofit",
        website: additionalData?.website || null,
        primary_contact_name: `${lead.first_name} ${lead.last_name}`,
        primary_contact_email: lead.email,
        primary_contact_phone: lead.phone,
        primary_contact_title: lead.title,
        pipeline_stage: "discovery",
        service_package: additionalData?.service_package || null,
        services: additionalData?.services || lead.service_interests,
        user_count: additionalData?.user_count || null,
        monthly_value: additionalData?.monthly_value || lead.estimated_value,
        state: "CA",
        days_in_stage: 0,
        stage_entered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (clientError) {
      console.error("Error creating client:", clientError);
      return { success: false, error: clientError.message };
    }

    // Update lead status
    await adminClient
      .from("leads")
      .update({ status: "converted", converted_at: new Date().toISOString() })
      .eq("id", leadId);

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "lead_converted",
      description: `Lead converted to MSP client: ${lead.organization || `${lead.first_name} ${lead.last_name}`}`,
      lead_id: leadId,
      client_id: client.id,
      metadata: { services: lead.service_interests },
      performed_by: null,
    });

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/clients");
    return { success: true, data: { clientId: client.id } };
  } catch (error) {
    console.error("Error in convertLeadToClient:", error);
    return { success: false, error: "Failed to convert lead to client" };
  }
}

// ============================================================================
// GET LEAD ACTIVITIES
// ============================================================================

export async function getLeadActivities(leadId: string): Promise<ActionResult<{ activities: unknown[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching lead activities:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { activities: data || [] } };
  } catch (error) {
    console.error("Error in getLeadActivities:", error);
    return { success: false, error: "Failed to fetch lead activities" };
  }
}

// ============================================================================
// GET LEAD STATS
// ============================================================================

export async function getLeadStats(): Promise<ActionResult<{
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  byType: Record<string, number>;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leads")
      .select("status, lead_type");

    if (error) {
      console.error("Error fetching lead stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      total: data?.length || 0,
      new: data?.filter((l) => l.status === "new").length || 0,
      contacted: data?.filter((l) => l.status === "contacted").length || 0,
      qualified: data?.filter((l) => l.status === "qualified").length || 0,
      converted: data?.filter((l) => l.status === "converted").length || 0,
      byType: {} as Record<string, number>,
    };

    data?.forEach((lead) => {
      stats.byType[lead.lead_type] = (stats.byType[lead.lead_type] || 0) + 1;
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getLeadStats:", error);
    return { success: false, error: "Failed to fetch lead stats" };
  }
}
