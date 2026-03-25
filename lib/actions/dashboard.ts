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

const DEFAULT_METRICS: DashboardMetrics = {
  newLeads: 0,
  leadsChange: 0,
  activeParticipants: 0,
  participantsChange: 0,
  mspClients: 0,
  clientsChange: 0,
  monthlyRevenue: 0,
  revenueChange: 0,
};

export async function getDashboardMetrics(): Promise<ActionResult<DashboardMetrics>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Calculate date ranges
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    // Query 1: Leads this month
    let newLeadsCount = 0;
    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      if (!error && count !== null) {
        newLeadsCount = count;
      } else if (error) {
        console.error("getDashboardMetrics: leads query error:", error.message);
      }
    } catch (e) {
      console.error("getDashboardMetrics: leads query exception:", e);
    }

    // Query 2: Leads last month (for comparison)
    let lastMonthLeads = 0;
    try {
      const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfLastMonth.toISOString())
        .lt("created_at", startOfMonth.toISOString());

      if (!error && count !== null) {
        lastMonthLeads = count;
      } else if (error) {
        console.error("getDashboardMetrics: last month leads error:", error.message);
      }
    } catch (e) {
      console.error("getDashboardMetrics: last month leads exception:", e);
    }

    // Query 3: Active participants
    // Valid statuses: 'applicant', 'enrolled', 'active', 'on_hold', 'completed', 'withdrawn'
    let activeParticipants = 0;
    try {
      const { count, error } = await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .in("status", ["enrolled", "active"]);

      if (!error && count !== null) {
        activeParticipants = count;
      } else if (error) {
        console.error("getDashboardMetrics: participants error:", error.message);
      }
    } catch (e) {
      console.error("getDashboardMetrics: participants exception:", e);
    }

    // Query 4: MSP clients (non-churned)
    // Valid stages: 'new_lead', 'discovery', 'assessment', 'proposal', 'negotiation', 'contract', 'onboarding', 'active', 'churned'
    let mspClients = 0;
    try {
      const { count, error } = await supabase
        .from("msp_clients")
        .select("*", { count: "exact", head: true })
        .neq("pipeline_stage", "churned");

      if (!error && count !== null) {
        mspClients = count;
      } else if (error) {
        console.error("getDashboardMetrics: msp_clients count error:", error.message);
      }
    } catch (e) {
      console.error("getDashboardMetrics: msp_clients count exception:", e);
    }

    // Query 5: Monthly revenue from active clients
    let monthlyRevenue = 0;
    try {
      const { data, error } = await supabase
        .from("msp_clients")
        .select("monthly_value")
        .eq("pipeline_stage", "active");

      if (!error && data) {
        monthlyRevenue = data.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
      } else if (error) {
        console.error("getDashboardMetrics: revenue error:", error.message);
      }
    } catch (e) {
      console.error("getDashboardMetrics: revenue exception:", e);
    }

    // Calculate leads change percentage
    let leadsChange = 0;
    if (lastMonthLeads > 0) {
      leadsChange = Math.round(((newLeadsCount - lastMonthLeads) / lastMonthLeads) * 100);
    } else if (newLeadsCount > 0) {
      leadsChange = 100;
    }

    return {
      success: true,
      data: {
        newLeads: newLeadsCount,
        leadsChange,
        activeParticipants,
        participantsChange: 0, // Would need historical data
        mspClients,
        clientsChange: 0, // Would need historical data
        monthlyRevenue,
        revenueChange: 0, // Would need historical data
      },
    };
  } catch (error) {
    console.error("getDashboardMetrics: top-level exception:", error);
    return { success: true, data: DEFAULT_METRICS };
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
      console.error("getRecentActivity: query error:", error.message);
      return { success: true, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("getRecentActivity: exception:", error);
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
      console.error("getUpcomingEvents: query error:", error.message);
      return { success: true, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("getUpcomingEvents: exception:", error);
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

    // Query 1: Participants with Travis escalation flags (high severity)
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("id, first_name, last_name, travis_escalation_flags, updated_at")
        .in("status", ["enrolled", "active"])
        .not("travis_escalation_flags", "is", null);

      if (!error && data) {
        data.forEach((p) => {
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
      } else if (error) {
        console.error("getTravisAlerts: escalation query error:", error.message);
      }
    } catch (e) {
      console.error("getTravisAlerts: escalation query exception:", e);
    }

    // Query 2: Stuck participants (enrolled 14+ days with 0% progress)
    try {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const { data, error } = await supabase
        .from("participants")
        .select("id, first_name, last_name, created_at")
        .in("status", ["enrolled", "active"])
        .eq("progress_percentage", 0)
        .lt("created_at", twoWeeksAgo.toISOString());

      if (!error && data) {
        data.forEach((p) => {
          alerts.push({
            id: `stuck-${p.id}`,
            participant_name: `${p.first_name} ${p.last_name}`,
            issue: "No progress in 14+ days",
            severity: "medium",
            created_at: p.created_at,
            participant_id: p.id,
          });
        });
      } else if (error) {
        console.error("getTravisAlerts: stuck query error:", error.message);
      }
    } catch (e) {
      console.error("getTravisAlerts: stuck query exception:", e);
    }

    // Return up to 5 alerts, high severity first
    const sortedAlerts = alerts
      .sort((a, b) => (a.severity === "high" ? -1 : 1))
      .slice(0, 5);

    return { success: true, data: sortedAlerts };
  } catch (error) {
    console.error("getTravisAlerts: top-level exception:", error);
    return { success: true, data: [] };
  }
}
