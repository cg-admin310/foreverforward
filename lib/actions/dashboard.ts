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

    // New leads this month
    const { count: newLeadsCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    // Leads last month (for comparison)
    const { count: lastMonthLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString());

    // Active participants
    const { count: activeParticipants } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .in("status", ["enrolled", "active", "in_progress"]);

    // MSP Clients
    const { count: mspClients } = await supabase
      .from("msp_clients")
      .select("*", { count: "exact", head: true })
      .neq("pipeline_stage", "lost");

    // Calculate monthly revenue from MSP clients
    const { data: clients } = await supabase
      .from("msp_clients")
      .select("monthly_value")
      .eq("pipeline_stage", "active_client");

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
    return { success: false, error: "Failed to fetch dashboard metrics" };
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
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getRecentActivity:", error);
    return { success: false, error: "Failed to fetch recent activity" };
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
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getUpcomingEvents:", error);
    return { success: false, error: "Failed to fetch upcoming events" };
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

    // Get participants with check-ins flagged for escalation
    const { data: escalations, error: escError } = await supabase
      .from("checkins")
      .select(`
        id,
        created_at,
        escalation_flag,
        escalation_reason,
        participant_id,
        participants (
          first_name,
          last_name
        )
      `)
      .eq("escalation_flag", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (escError) {
      console.error("Error fetching escalations:", escError);
    }

    // Get participants who missed check-ins (no check-in in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: activeParticipants } = await supabase
      .from("participants")
      .select("id, first_name, last_name, last_checkin_at")
      .in("status", ["enrolled", "active"])
      .or(`last_checkin_at.is.null,last_checkin_at.lt.${weekAgo.toISOString()}`);

    const alerts: TravisAlert[] = [];

    // Add escalations
    escalations?.forEach((esc) => {
      const participants = esc.participants as unknown as { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
      const participant = Array.isArray(participants) ? participants[0] : participants;
      if (participant) {
        alerts.push({
          id: esc.id,
          participant_name: `${participant.first_name} ${participant.last_name}`,
          issue: esc.escalation_reason || "Escalation flagged",
          severity: "high",
          created_at: esc.created_at,
          participant_id: esc.participant_id,
        });
      }
    });

    // Add missed check-ins
    activeParticipants?.forEach((p) => {
      alerts.push({
        id: `missed-${p.id}`,
        participant_name: `${p.first_name} ${p.last_name}`,
        issue: "Missed check-in (7+ days)",
        severity: "medium",
        created_at: new Date().toISOString(),
        participant_id: p.id,
      });
    });

    return { success: true, data: alerts.slice(0, 5) };
  } catch (error) {
    console.error("Error in getTravisAlerts:", error);
    return { success: false, error: "Failed to fetch Travis alerts" };
  }
}
