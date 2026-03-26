"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  MspClient,
  MspClientInsert,
  MspClientUpdate,
  PipelineStage,
} from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ClientFormInput {
  organizationName: string;
  organizationType?: string;
  website?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  primaryContactTitle?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  servicePackage?: string;
  services?: string[];
  userCount?: number;
  monthlyValue?: number;
}

// ============================================================================
// CREATE CLIENT
// ============================================================================

export async function createClient(
  input: ClientFormInput
): Promise<ActionResult<MspClient>> {
  try {
    const adminClient = createAdminClient();

    const clientData: MspClientInsert = {
      organization_name: input.organizationName,
      organization_type: input.organizationType || null,
      website: input.website || null,
      primary_contact_name: input.primaryContactName,
      primary_contact_email: input.primaryContactEmail,
      primary_contact_phone: input.primaryContactPhone || null,
      primary_contact_title: input.primaryContactTitle || null,
      address_line1: input.addressLine1 || null,
      address_line2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || "CA",
      zip_code: input.zipCode || null,
      pipeline_stage: "new_lead",
      service_package: input.servicePackage || null,
      services: input.services || null,
      user_count: input.userCount || null,
      monthly_value: input.monthlyValue || null,
      days_in_stage: 0,
      stage_entered_at: new Date().toISOString(),
      lead_id: null,
      contract_start_date: null,
      contract_end_date: null,
      stripe_customer_id: null,
      payment_status: "pending",
      account_manager: null,
      assigned_technicians: null,
      notes: null,
      tags: null,
      // Assessment fields - null when not from assessment form
      assessment_completed_at: null,
      assessment_data: null,
      current_it_spend_monthly: null,
      current_it_provider: null,
      support_type: null,
      has_it_staff: false,
      it_staff_count: null,
      device_count: null,
      server_count: null,
      cloud_services: null,
      current_tools: null,
      pain_points: null,
      top_priorities: null,
      biggest_challenge: null,
      ideal_outcome: null,
      decision_timeline: null,
      budget_range: null,
      services_interested: null,
      // Enhanced assessment fields
      compliance_requirements: null,
      disaster_recovery_status: null,
      growth_projection_users: null,
      office_count: null,
      remote_worker_percent: null,
    };

    const { data, error } = await adminClient
      .from("msp_clients")
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "client_created",
      description: `New MSP client created: ${input.organizationName}`,
      client_id: data.id,
      metadata: { organization_type: input.organizationType },
      performed_by: null,
    });

    revalidatePath("/dashboard/clients");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createClient:", error);
    return { success: false, error: "Failed to create client" };
  }
}

// ============================================================================
// GET CLIENTS
// ============================================================================

export async function getClients(options?: {
  stage?: PipelineStage;
  accountManagerId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ActionResult<{ clients: MspClient[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("msp_clients")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.stage) {
      query = query.eq("pipeline_stage", options.stage);
    }

    if (options?.accountManagerId) {
      query = query.eq("account_manager", options.accountManagerId);
    }

    if (options?.search) {
      query = query.or(
        `organization_name.ilike.%${options.search}%,primary_contact_name.ilike.%${options.search}%,primary_contact_email.ilike.%${options.search}%`
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
      console.error("Error fetching clients:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { clients: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getClients:", error);
    return { success: false, error: "Failed to fetch clients" };
  }
}

// ============================================================================
// GET CLIENTS BY PIPELINE STAGE
// ============================================================================

export async function getClientsByPipeline(): Promise<
  ActionResult<Record<PipelineStage, MspClient[]>>
> {
  try {
    // Use admin client to bypass RLS for internal server actions
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("msp_clients")
      .select("*")
      .order("stage_entered_at", { ascending: true });

    if (error) {
      console.error("Error fetching clients by pipeline:", error);
      return { success: false, error: error.message };
    }

    const pipeline: Record<PipelineStage, MspClient[]> = {
      new_lead: [],
      discovery: [],
      assessment: [],
      proposal: [],
      negotiation: [],
      contract: [],
      onboarding: [],
      active: [],
      churned: [],
    };

    (data as MspClient[])?.forEach((client) => {
      pipeline[client.pipeline_stage].push(client);
    });

    return { success: true, data: pipeline };
  } catch (error) {
    console.error("Error in getClientsByPipeline:", error);
    return { success: false, error: "Failed to fetch pipeline" };
  }
}

// ============================================================================
// GET SINGLE CLIENT
// ============================================================================

export async function getClient(id: string): Promise<ActionResult<MspClient>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("msp_clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getClient:", error);
    return { success: false, error: "Failed to fetch client" };
  }
}

// ============================================================================
// UPDATE CLIENT
// ============================================================================

export async function updateClient(
  id: string,
  updates: MspClientUpdate
): Promise<ActionResult<MspClient>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("msp_clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "client_updated",
      description: `Client updated: ${data.organization_name}`,
      client_id: id,
      metadata: { updates: Object.keys(updates) },
      performed_by: null,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateClient:", error);
    return { success: false, error: "Failed to update client" };
  }
}

// ============================================================================
// DELETE CLIENT
// ============================================================================

export async function deleteClient(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // First get client info for activity log
    const { data: client } = await supabase
      .from("msp_clients")
      .select("organization_name")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("msp_clients").delete().eq("id", id);

    if (error) {
      console.error("Error deleting client:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "client_deleted",
      description: `Client deleted: ${client?.organization_name}`,
      client_id: null,
      metadata: { deleted_client_id: id },
      performed_by: null,
    });

    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteClient:", error);
    return { success: false, error: "Failed to delete client" };
  }
}

// ============================================================================
// UPDATE PIPELINE STAGE
// ============================================================================

export async function updatePipelineStage(
  id: string,
  stage: PipelineStage
): Promise<ActionResult<MspClient>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current client to calculate days in previous stage
    const { data: currentClient } = await supabase
      .from("msp_clients")
      .select("pipeline_stage, stage_entered_at")
      .eq("id", id)
      .single();

    const now = new Date();
    const stageEnteredAt = currentClient?.stage_entered_at
      ? new Date(currentClient.stage_entered_at)
      : now;
    const daysInPreviousStage = Math.floor(
      (now.getTime() - stageEnteredAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const { data, error } = await supabase
      .from("msp_clients")
      .update({
        pipeline_stage: stage,
        stage_entered_at: now.toISOString(),
        days_in_stage: 0,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating pipeline stage:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "pipeline_stage_change",
      description: `Pipeline stage changed: ${currentClient?.pipeline_stage} → ${stage}`,
      client_id: id,
      metadata: {
        previous_stage: currentClient?.pipeline_stage,
        new_stage: stage,
        days_in_previous_stage: daysInPreviousStage,
      },
      performed_by: null,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updatePipelineStage:", error);
    return { success: false, error: "Failed to update pipeline stage" };
  }
}

// ============================================================================
// ASSIGN TECHNICIAN
// ============================================================================

export async function assignTechnician(
  clientId: string,
  technicianId: string
): Promise<ActionResult<MspClient>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current technicians
    const { data: client } = await supabase
      .from("msp_clients")
      .select("assigned_technicians")
      .eq("id", clientId)
      .single();

    const currentTechnicians = client?.assigned_technicians || [];
    if (currentTechnicians.includes(technicianId)) {
      return { success: false, error: "Technician already assigned" };
    }

    const { data, error } = await supabase
      .from("msp_clients")
      .update({
        assigned_technicians: [...currentTechnicians, technicianId],
      })
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      console.error("Error assigning technician:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "technician_assigned",
      description: `Technician assigned to client`,
      client_id: clientId,
      metadata: { technician_id: technicianId },
      performed_by: null,
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in assignTechnician:", error);
    return { success: false, error: "Failed to assign technician" };
  }
}

// ============================================================================
// REMOVE TECHNICIAN
// ============================================================================

export async function removeTechnician(
  clientId: string,
  technicianId: string
): Promise<ActionResult<MspClient>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current technicians
    const { data: client } = await supabase
      .from("msp_clients")
      .select("assigned_technicians")
      .eq("id", clientId)
      .single();

    const currentTechnicians = client?.assigned_technicians || [];
    const updatedTechnicians = currentTechnicians.filter((id: string) => id !== technicianId);

    const { data, error } = await supabase
      .from("msp_clients")
      .update({
        assigned_technicians: updatedTechnicians,
      })
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      console.error("Error removing technician:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in removeTechnician:", error);
    return { success: false, error: "Failed to remove technician" };
  }
}

// ============================================================================
// GET CLIENT ACTIVITIES
// ============================================================================

export async function getClientActivities(
  clientId: string
): Promise<ActionResult<{ activities: unknown[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client activities:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { activities: data || [] } };
  } catch (error) {
    console.error("Error in getClientActivities:", error);
    return { success: false, error: "Failed to fetch client activities" };
  }
}

// ============================================================================
// GET CLIENT STATS
// ============================================================================

export async function getClientStats(): Promise<ActionResult<{
  total: number;
  active: number;
  totalMRR: number;
  byStage: Record<string, number>;
  byPackage: Record<string, number>;
}>> {
  try {
    // Use admin client to bypass RLS for internal server actions
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("msp_clients")
      .select("pipeline_stage, service_package, monthly_value");

    if (error) {
      console.error("Error fetching client stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter((c) => c.pipeline_stage === "active").length || 0,
      totalMRR: data
        ?.filter((c) => c.pipeline_stage === "active")
        .reduce((sum, c) => sum + (c.monthly_value || 0), 0) || 0,
      byStage: {} as Record<string, number>,
      byPackage: {} as Record<string, number>,
    };

    data?.forEach((client) => {
      stats.byStage[client.pipeline_stage] = (stats.byStage[client.pipeline_stage] || 0) + 1;
      if (client.service_package) {
        stats.byPackage[client.service_package] =
          (stats.byPackage[client.service_package] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getClientStats:", error);
    return { success: false, error: "Failed to fetch client stats" };
  }
}

// ============================================================================
// GET PIPELINE METRICS
// ============================================================================

export async function getPipelineMetrics(): Promise<ActionResult<{
  totalValue: number;
  valueByStage: Record<PipelineStage, number>;
  conversionRates: {
    leadToDiscovery: number;
    discoveryToProposal: number;
    proposalToContract: number;
    overallWinRate: number;
  };
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("msp_clients")
      .select("pipeline_stage, monthly_value");

    if (error) {
      console.error("Error fetching pipeline metrics:", error);
      return { success: false, error: error.message };
    }

    const valueByStage: Record<PipelineStage, number> = {
      new_lead: 0,
      discovery: 0,
      assessment: 0,
      proposal: 0,
      negotiation: 0,
      contract: 0,
      onboarding: 0,
      active: 0,
      churned: 0,
    };

    let totalValue = 0;
    const stageCounts: Record<string, number> = {};

    (data as MspClient[])?.forEach((client) => {
      const value = client.monthly_value || 0;
      valueByStage[client.pipeline_stage] += value;
      totalValue += value;
      stageCounts[client.pipeline_stage] = (stageCounts[client.pipeline_stage] || 0) + 1;
    });

    // Calculate conversion rates (simplified - would need historical data for accuracy)
    const activeCount = stageCounts["active"] || 0;
    const contractCount = stageCounts["contract"] || 0;
    const proposalCount = stageCounts["proposal"] || 0;
    const discoveryCount = stageCounts["discovery"] || 0;
    const newLeadCount = stageCounts["new_lead"] || 0;

    const totalOpportunities = newLeadCount + discoveryCount + proposalCount + contractCount + activeCount;

    return {
      success: true,
      data: {
        totalValue,
        valueByStage,
        conversionRates: {
          leadToDiscovery: newLeadCount > 0 ? ((discoveryCount + proposalCount + contractCount + activeCount) / (newLeadCount + discoveryCount + proposalCount + contractCount + activeCount)) * 100 : 0,
          discoveryToProposal: discoveryCount > 0 ? ((proposalCount + contractCount + activeCount) / (discoveryCount + proposalCount + contractCount + activeCount)) * 100 : 0,
          proposalToContract: proposalCount > 0 ? ((contractCount + activeCount) / (proposalCount + contractCount + activeCount)) * 100 : 0,
          overallWinRate: totalOpportunities > 0 ? (activeCount / totalOpportunities) * 100 : 0,
        },
      },
    };
  } catch (error) {
    console.error("Error in getPipelineMetrics:", error);
    return { success: false, error: "Failed to fetch pipeline metrics" };
  }
}
