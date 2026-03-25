"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "./leads";

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface DashboardMetrics {
  newLeads: number;
  leadsChange: number;
  activeParticipants: number;
  participantsChange: number;
  mspClients: number;
  clientsChange: number;
  monthlyRevenue: number;
  revenueChange: number;
}

export async function getDashboardMetrics(): Promise<ActionResult<DashboardMetrics>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get leads from this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    // New leads this month (with error handling for missing table)
    const leadsResult = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());
    const newLeadsCount = leadsResult.error ? 0 : leadsResult.count;

    // Leads last month (for comparison)
    const lastMonthResult = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString());
    const lastMonthLeads = lastMonthResult.error ? 0 : lastMonthResult.count;

    // Active participants (valid statuses: applicant, enrolled, active, on_hold, completed, withdrawn)
    const participantsResult = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .in("status", ["enrolled", "active"]);
    const activeParticipants = participantsResult.error ? 0 : participantsResult.count;

    // MSP Clients (valid stages: new_lead, discovery, assessment, proposal, negotiation, contract, onboarding, active, churned)
    const clientsCountResult = await supabase
      .from("msp_clients")
      .select("*", { count: "exact", head: true })
      .neq("pipeline_stage", "churned");
    const mspClients = clientsCountResult.error ? 0 : clientsCountResult.count;

    // Calculate monthly revenue from MSP clients
    const clientsRevenueResult = await supabase
      .from("msp_clients")
      .select("monthly_value")
      .eq("pipeline_stage", "active_client");
    const clients = clientsRevenueResult.error ? [] : clientsRevenueResult.data;

    const monthlyRevenue = clients?.reduce((sum, c) => sum + (c.monthly_value || 0), 0) || 0;

    // Calculate changes (percentage)
    const leadsChange = lastMonthLeads && lastMonthLeads > 0
      ? Math.round(((newLeadsCount || 0) - lastMonthLeads) / lastMonthLeads * 100)
      : (newLeadsCount || 0) > 0 ? 100 : 0;

    return {
      success: true,
      data: {
        newLeads: newLeadsCount || 0,
        leadsChange,
        activeParticipants: activeParticipants || 0,
        participantsChange: 0, // Would need historical data
        mspClients: mspClients || 0,
        clientsChange: 0,
        monthlyRevenue,
        revenueChange: 0,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardMetrics:", error);
    // Return default values instead of error to prevent page crash
    return {
      success: true,
      data: {
        newLeads: 0,
        leadsChange: 0,
        activeParticipants: 0,
        participantsChange: 0,
        mspClients: 0,
        clientsChange: 0,
        monthlyRevenue: 0,
        revenueChange: 0,
      },
    };
  }
}

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

export interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  lead_id?: string;
  participant_id?: string;
  client_id?: string;
  metadata?: Record<string, unknown>;
}

export async function getRecentActivity(limit = 10): Promise<ActionResult<Activity[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching activities:", error);
      // Return empty array instead of error to prevent page crash
      return { success: true, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getRecentActivity:", error);
    return { success: true, data: [] };
  }
}

// ============================================================================
// UPCOMING EVENTS
// ============================================================================

export interface UpcomingEvent {
  id: string;
  title: string;
  start_datetime: string;
  tickets_sold: number;
  capacity: number;
  event_type: string;
}

export async function getUpcomingEvents(limit = 5): Promise<ActionResult<UpcomingEvent[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("events")
      .select("id, title, start_datetime, tickets_sold, capacity, event_type")
      .gte("start_datetime", new Date().toISOString())
      .eq("is_cancelled", false)
      .order("start_datetime", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching events:", error);
      // Return empty array instead of error to prevent page crash
      return { success: true, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getUpcomingEvents:", error);
    return { success: true, data: [] };
  }
}

// ============================================================================
// TRAVIS ALERTS (Participants needing attention)
// ============================================================================

export interface TravisAlert {
  id: string;
  participant_name: string;
  issue: string;
  severity: "low" | "medium" | "high";
  created_at: string;
  participant_id: string;
}

export async function getTravisAlerts(): Promise<ActionResult<TravisAlert[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const alerts: TravisAlert[] = [];

    // Get participants with Travis escalation flags
    try {
      const { data: escalatedParticipants, error: escError } = await supabase
        .from("participants")
        .select("id, first_name, last_name, travis_escalation_flags, updated_at")
        .in("status", ["enrolled", "active"])
        .not("travis_escalation_flags", "is", null);

      if (!escError && escalatedParticipants) {
        escalatedParticipants.forEach((p) => {
          const flags = p.travis_escalation_flags as string[] | null;
          if (flags && flags.length > 0) {
            alerts.push({
              id: `escalation-${p.id}`,
              participant_name: `${p.first_name} ${p.last_name}`,
              issue: flags[0] || "Escalation flagged",
              severity: "high",
              created_at: p.updated_at,
              participant_id: p.id,
            });
          }
        });
      }
    } catch {
      // Column might not exist, continue without escalations
    }

    // Get participants with low progress (enrolled but stuck at 0%)
    try {
      const { data: stuckParticipants, error: stuckError } = await supabase
        .from("participants")
        .select("id, first_name, last_name, created_at")
        .in("status", ["enrolled", "active"])
        .eq("progress_percentage", 0);

      if (!stuckError && stuckParticipants) {
        // Only flag if enrolled more than 14 days ago
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        stuckParticipants.forEach((p) => {
          if (new Date(p.created_at) < twoWeeksAgo) {
            alerts.push({
              id: `stuck-${p.id}`,
              participant_name: `${p.first_name} ${p.last_name}`,
              issue: "No progress in 14+ days",
              severity: "medium",
              created_at: p.created_at,
              participant_id: p.id,
            });
          }
        });
      }
    } catch {
      // Continue without stuck participants check
    }

    return { success: true, data: alerts.slice(0, 5) };
  } catch (error) {
    console.error("Error in getTravisAlerts:", error);
    return { success: true, data: [] };
  }
}
