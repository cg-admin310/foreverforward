"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Participant,
  ParticipantInsert,
  ParticipantUpdate,
  ParticipantStatus,
  ProgramType,
  Checkin,
  CheckinInsert,
} from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ParticipantFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  program: ProgramType;
  cohortId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  employmentStatus?: string;
  itExperienceLevel?: string;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  parentGuardianEmail?: string;
  schoolName?: string;
  gradeLevel?: string;
  goals?: string;
  barriers?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  howDidYouHear?: string;
}

// ============================================================================
// CREATE PARTICIPANT
// ============================================================================

export async function createParticipant(
  input: ParticipantFormInput
): Promise<ActionResult<Participant>> {
  try {
    const adminClient = createAdminClient();

    const participantData: ParticipantInsert = {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone || null,
      date_of_birth: input.dateOfBirth || null,
      program: input.program,
      cohort_id: input.cohortId || null,
      status: "applicant",
      address_line1: input.addressLine1 || null,
      address_line2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || "CA",
      zip_code: input.zipCode || null,
      employment_status: input.employmentStatus || null,
      it_experience_level: input.itExperienceLevel || null,
      parent_guardian_name: input.parentGuardianName || null,
      parent_guardian_phone: input.parentGuardianPhone || null,
      parent_guardian_email: input.parentGuardianEmail || null,
      school_name: input.schoolName || null,
      grade_level: input.gradeLevel || null,
      goals: input.goals || null,
      barriers: input.barriers || null,
      emergency_contact_name: input.emergencyContactName || null,
      emergency_contact_phone: input.emergencyContactPhone || null,
      how_did_you_hear: input.howDidYouHear || null,
      current_week: 1,
      progress_percentage: 0,
      lead_id: null,
      path_forward_plan: null,
      assigned_case_worker: null,
      google_it_cert_status: null,
      google_it_cert_date: null,
      travis_conversation_summary: null,
      travis_last_interaction: null,
      travis_escalation_flags: null,
      notes: null,
      tags: null,
      enrolled_at: null,
      completed_at: null,
    };

    const { data, error } = await adminClient
      .from("participants")
      .insert(participantData)
      .select()
      .single();

    if (error) {
      console.error("Error creating participant:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "participant_created",
      description: `New participant enrolled: ${input.firstName} ${input.lastName} (${input.program})`,
      participant_id: data.id,
      metadata: { program: input.program },
      performed_by: null,
    });

    revalidatePath("/dashboard/programs/participants");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createParticipant:", error);
    return { success: false, error: "Failed to create participant" };
  }
}

// ============================================================================
// GET PARTICIPANTS
// ============================================================================

export async function getParticipants(options?: {
  program?: ProgramType;
  status?: ParticipantStatus;
  cohortId?: string;
  caseWorkerId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ActionResult<{ participants: Participant[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("participants")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.program) {
      query = query.eq("program", options.program);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.cohortId) {
      query = query.eq("cohort_id", options.cohortId);
    }

    if (options?.caseWorkerId) {
      query = query.eq("assigned_case_worker", options.caseWorkerId);
    }

    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`
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
      console.error("Error fetching participants:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { participants: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getParticipants:", error);
    return { success: false, error: "Failed to fetch participants" };
  }
}

// ============================================================================
// GET SINGLE PARTICIPANT
// ============================================================================

export async function getParticipant(id: string): Promise<ActionResult<Participant>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching participant:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getParticipant:", error);
    return { success: false, error: "Failed to fetch participant" };
  }
}

// ============================================================================
// UPDATE PARTICIPANT
// ============================================================================

export async function updateParticipant(
  id: string,
  updates: ParticipantUpdate
): Promise<ActionResult<Participant>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating participant:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "participant_updated",
      description: `Participant updated: ${data.first_name} ${data.last_name}`,
      participant_id: id,
      metadata: { updates: Object.keys(updates) },
      performed_by: null,
    });

    revalidatePath("/dashboard/programs/participants");
    revalidatePath(`/dashboard/programs/participants/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateParticipant:", error);
    return { success: false, error: "Failed to update participant" };
  }
}

// ============================================================================
// UPDATE PARTICIPANT STATUS
// ============================================================================

export async function updateParticipantStatus(
  id: string,
  status: ParticipantStatus
): Promise<ActionResult<Participant>> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: ParticipantUpdate = { status };

    if (status === "enrolled") {
      updateData.enrolled_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.progress_percentage = 100;
    }

    const { data, error } = await supabase
      .from("participants")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating participant status:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "status_change",
      description: `Participant status changed to ${status}`,
      participant_id: id,
      metadata: { new_status: status },
      performed_by: null,
    });

    revalidatePath("/dashboard/programs/participants");
    revalidatePath(`/dashboard/programs/participants/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateParticipantStatus:", error);
    return { success: false, error: "Failed to update participant status" };
  }
}

// ============================================================================
// UPDATE PARTICIPANT PROGRESS
// ============================================================================

export async function updateParticipantProgress(
  id: string,
  week: number,
  percentage: number
): Promise<ActionResult<Participant>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .update({
        current_week: week,
        progress_percentage: percentage,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating participant progress:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "progress_update",
      description: `Progress updated: Week ${week}, ${percentage}% complete`,
      participant_id: id,
      metadata: { week, percentage },
      performed_by: null,
    });

    revalidatePath("/dashboard/programs/participants");
    revalidatePath(`/dashboard/programs/participants/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateParticipantProgress:", error);
    return { success: false, error: "Failed to update participant progress" };
  }
}

// ============================================================================
// ADD CHECK-IN
// ============================================================================

export async function addCheckin(
  participantId: string,
  checkinData: {
    checkinType: string;
    notes: string;
    moodRating?: number;
    engagementRating?: number;
    goalsDiscussed?: string[];
    barriersIdentified?: string[];
    actionItems?: string[];
    followUpNeeded?: boolean;
    followUpDate?: string;
  }
): Promise<ActionResult<Checkin>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const checkin: CheckinInsert = {
      participant_id: participantId,
      case_worker_id: user.id,
      checkin_type: checkinData.checkinType,
      notes: checkinData.notes,
      mood_rating: checkinData.moodRating || null,
      engagement_rating: checkinData.engagementRating || null,
      goals_discussed: checkinData.goalsDiscussed || null,
      barriers_identified: checkinData.barriersIdentified || null,
      action_items: checkinData.actionItems || null,
      follow_up_needed: checkinData.followUpNeeded || false,
      follow_up_date: checkinData.followUpDate || null,
    };

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("checkins")
      .insert(checkin)
      .select()
      .single();

    if (error) {
      console.error("Error creating check-in:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    await adminClient.from("activities").insert({
      activity_type: "check_in",
      description: `${checkinData.checkinType} check-in recorded`,
      participant_id: participantId,
      metadata: { checkin_id: data.id, type: checkinData.checkinType },
      performed_by: user.id,
    });

    revalidatePath(`/dashboard/programs/participants/${participantId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in addCheckin:", error);
    return { success: false, error: "Failed to add check-in" };
  }
}

// ============================================================================
// GET PARTICIPANT CHECK-INS
// ============================================================================

export async function getParticipantCheckins(
  participantId: string
): Promise<ActionResult<{ checkins: Checkin[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching check-ins:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { checkins: data || [] } };
  } catch (error) {
    console.error("Error in getParticipantCheckins:", error);
    return { success: false, error: "Failed to fetch check-ins" };
  }
}

// ============================================================================
// GET PARTICIPANT ACTIVITIES
// ============================================================================

export async function getParticipantActivities(
  participantId: string
): Promise<ActionResult<{ activities: unknown[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching participant activities:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { activities: data || [] } };
  } catch (error) {
    console.error("Error in getParticipantActivities:", error);
    return { success: false, error: "Failed to fetch participant activities" };
  }
}

// ============================================================================
// UPDATE CERTIFICATION STATUS
// ============================================================================

export async function updateCertificationStatus(
  id: string,
  status: string,
  certDate?: string
): Promise<ActionResult<Participant>> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: ParticipantUpdate = {
      google_it_cert_status: status,
    };

    if (status === "passed" && certDate) {
      updateData.google_it_cert_date = certDate;
    }

    const { data, error } = await supabase
      .from("participants")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating certification status:", error);
      return { success: false, error: error.message };
    }

    // Log activity
    const adminClient = createAdminClient();
    await adminClient.from("activities").insert({
      activity_type: "certification_update",
      description: `Google IT certification status: ${status}`,
      participant_id: id,
      metadata: { status, cert_date: certDate },
      performed_by: null,
    });

    revalidatePath(`/dashboard/programs/participants/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateCertificationStatus:", error);
    return { success: false, error: "Failed to update certification status" };
  }
}

// ============================================================================
// GET PARTICIPANT STATS
// ============================================================================

export async function getParticipantStats(): Promise<ActionResult<{
  total: number;
  active: number;
  completed: number;
  byProgram: Record<string, number>;
  byStatus: Record<string, number>;
  certificationRate: number;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .select("status, program, google_it_cert_status");

    if (error) {
      console.error("Error fetching participant stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter((p) => p.status === "active").length || 0,
      completed: data?.filter((p) => p.status === "completed").length || 0,
      byProgram: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      certificationRate: 0,
    };

    data?.forEach((participant) => {
      stats.byProgram[participant.program] = (stats.byProgram[participant.program] || 0) + 1;
      stats.byStatus[participant.status] = (stats.byStatus[participant.status] || 0) + 1;
    });

    // Calculate certification rate
    const fatherForwardParticipants = data?.filter((p) => p.program === "father_forward") || [];
    const certified = fatherForwardParticipants.filter((p) => p.google_it_cert_status === "passed").length;
    const completed = fatherForwardParticipants.filter((p) => p.status === "completed").length;
    stats.certificationRate = completed > 0 ? (certified / completed) * 100 : 0;

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getParticipantStats:", error);
    return { success: false, error: "Failed to fetch participant stats" };
  }
}
