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
// GET PROGRAMS OVERVIEW
// ============================================================================

export interface ProgramOverview {
  slug: ProgramType;
  name: string;
  audience: string;
  enrolled: number;
  active_cohort: string | null;
  cohort_week: number | null;
  completion_rate: number | null;
  color: string;
}

const programMeta: Record<ProgramType, { name: string; audience: string; color: string }> = {
  father_forward: { name: "Father Forward", audience: "Fathers", color: "bg-[#C9A84C]" },
  tech_ready_youth: { name: "Tech-Ready Youth", audience: "Youth 16+", color: "bg-[#5A7247]" },
  making_moments: { name: "Making Moments", audience: "Families", color: "bg-blue-500" },
  from_script_to_screen: { name: "From Script to Screen", audience: "Students", color: "bg-purple-500" },
  stories_from_my_future: { name: "Stories from My Future", audience: "Kids", color: "bg-pink-500" },
  lula: { name: "LULA", audience: "Youth", color: "bg-orange-500" },
};

export async function getProgramsOverview(): Promise<ActionResult<ProgramOverview[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get participant counts by program
    const { data: participants, error: pError } = await supabase
      .from("participants")
      .select("program, status");

    if (pError) {
      console.error("Error fetching participants:", pError);
      return { success: false, error: pError.message };
    }

    // Get active cohorts
    const { data: cohorts, error: cError } = await supabase
      .from("cohorts")
      .select("*")
      .eq("is_active", true);

    if (cError) {
      console.error("Error fetching cohorts:", cError);
    }

    const programs: ProgramOverview[] = (Object.keys(programMeta) as ProgramType[]).map((slug) => {
      const meta = programMeta[slug];
      const programParticipants = participants?.filter((p) => p.program === slug) || [];
      const completed = programParticipants.filter((p) => p.status === "completed").length;
      const total = programParticipants.length;

      const activeCohort = cohorts?.find((c) => c.program === slug);

      // Calculate weeks into cohort
      let cohortWeek = null;
      if (activeCohort) {
        const startDate = new Date(activeCohort.start_date);
        const now = new Date();
        const weeksDiff = Math.floor((now.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        cohortWeek = Math.min(weeksDiff, 8);
      }

      return {
        slug,
        name: meta.name,
        audience: meta.audience,
        enrolled: programParticipants.filter((p) =>
          ["enrolled", "active", "in_progress"].includes(p.status)
        ).length,
        active_cohort: activeCohort?.name || null,
        cohort_week: cohortWeek,
        completion_rate: total > 0 ? Math.round((completed / total) * 100) : null,
        color: meta.color,
      };
    });

    return { success: true, data: programs };
  } catch (error) {
    console.error("Error in getProgramsOverview:", error);
    return { success: false, error: "Failed to fetch programs overview" };
  }
}

// ============================================================================
// GET UPCOMING COHORTS
// ============================================================================

export interface UpcomingCohort {
  id: string;
  program: ProgramType;
  program_name: string;
  name: string;
  start_date: string;
  enrolled: number;
  capacity: number;
}

export async function getUpcomingCohorts(): Promise<ActionResult<UpcomingCohort[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("cohorts")
      .select("*")
      .gte("start_date", new Date().toISOString())
      .eq("is_accepting_applications", true)
      .order("start_date", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error fetching upcoming cohorts:", error);
      return { success: false, error: error.message };
    }

    // Get enrollment counts for each cohort
    const cohortIds = data?.map((c) => c.id) || [];
    const { data: participants } = await supabase
      .from("participants")
      .select("cohort_id")
      .in("cohort_id", cohortIds);

    const enrollmentCounts: Record<string, number> = {};
    participants?.forEach((p) => {
      if (p.cohort_id) {
        enrollmentCounts[p.cohort_id] = (enrollmentCounts[p.cohort_id] || 0) + 1;
      }
    });

    const cohorts: UpcomingCohort[] = (data || []).map((c) => ({
      id: c.id,
      program: c.program,
      program_name: programMeta[c.program as ProgramType]?.name || c.program,
      name: c.name,
      start_date: c.start_date,
      enrolled: enrollmentCounts[c.id] || 0,
      capacity: c.max_participants || 15,
    }));

    return { success: true, data: cohorts };
  } catch (error) {
    console.error("Error in getUpcomingCohorts:", error);
    return { success: false, error: "Failed to fetch upcoming cohorts" };
  }
}

// ============================================================================
// GET RECENT APPLICATIONS
// ============================================================================

export interface RecentApplication {
  id: string;
  name: string;
  program: string;
  applied: string;
  status: "pending" | "approved" | "rejected";
}

export async function getRecentApplications(limit = 5): Promise<ActionResult<RecentApplication[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .select("id, first_name, last_name, program, status, created_at")
      .eq("status", "applicant")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent applications:", error);
      return { success: false, error: error.message };
    }

    const now = new Date();
    const applications: RecentApplication[] = (data || []).map((p) => {
      const created = new Date(p.created_at);
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let applied: string;
      if (diffHours < 1) {
        applied = "Just now";
      } else if (diffHours < 24) {
        applied = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else {
        applied = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      }

      return {
        id: p.id,
        name: `${p.first_name} ${p.last_name}`,
        program: programMeta[p.program as ProgramType]?.name || p.program,
        applied,
        status: "pending" as const,
      };
    });

    return { success: true, data: applications };
  } catch (error) {
    console.error("Error in getRecentApplications:", error);
    return { success: false, error: "Failed to fetch recent applications" };
  }
}

// ============================================================================
// GET PROGRAMS STATS (for programs page header)
// ============================================================================

export async function getProgramStats(): Promise<ActionResult<{
  totalEnrolled: number;
  activePrograms: number;
  pendingApplications: number;
  thisMonthGraduates: number;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all participants
    const { data: participants } = await supabase
      .from("participants")
      .select("status, program, completed_at");

    // Get active cohorts count
    const { data: cohorts } = await supabase
      .from("cohorts")
      .select("id, program")
      .eq("is_active", true);

    const enrolled = participants?.filter((p) =>
      ["enrolled", "active", "in_progress"].includes(p.status)
    ).length || 0;

    const pending = participants?.filter((p) => p.status === "applicant").length || 0;

    // Count unique programs with active cohorts
    const uniquePrograms = new Set(cohorts?.map((c) => c.program) || []);

    // Count graduates this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthGraduates = participants?.filter((p) => {
      if (p.status !== "completed" || !p.completed_at) return false;
      return new Date(p.completed_at) >= startOfMonth;
    }).length || 0;

    return {
      success: true,
      data: {
        totalEnrolled: enrolled,
        activePrograms: uniquePrograms.size,
        pendingApplications: pending,
        thisMonthGraduates,
      },
    };
  } catch (error) {
    console.error("Error in getProgramStats:", error);
    return { success: false, error: "Failed to fetch program stats" };
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

// ============================================================================
// GET PARTICIPANT DOCUMENTS
// ============================================================================

export async function getParticipantDocuments(
  participantId: string
): Promise<ActionResult<{ documents: import("@/types/database").Document[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching participant documents:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { documents: data || [] } };
  } catch (error) {
    console.error("Error in getParticipantDocuments:", error);
    return { success: false, error: "Failed to fetch participant documents" };
  }
}

// ============================================================================
// GET TRAVIS CONVERSATIONS
// ============================================================================

export async function getTravisConversations(
  participantId: string
): Promise<ActionResult<{ conversations: import("@/types/database").TravisConversation[] }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("travis_conversations")
      .select("*")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching Travis conversations:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { conversations: data || [] } };
  } catch (error) {
    console.error("Error in getTravisConversations:", error);
    return { success: false, error: "Failed to fetch Travis conversations" };
  }
}

// ============================================================================
// GET PARTICIPANT WITH ALL RELATED DATA
// ============================================================================

export async function getParticipantWithAllData(id: string): Promise<ActionResult<{
  participant: Participant;
  checkins: Checkin[];
  activities: import("@/types/database").Activity[];
  documents: import("@/types/database").Document[];
  travisConversations: import("@/types/database").TravisConversation[];
  cohort: import("@/types/database").Cohort | null;
  caseWorker: import("@/types/database").User | null;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch participant
    const { data: participant, error: pError } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single();

    if (pError || !participant) {
      console.error("Error fetching participant:", pError);
      return { success: false, error: pError?.message || "Participant not found" };
    }

    // Fetch check-ins
    const { data: checkins } = await supabase
      .from("checkins")
      .select("*")
      .eq("participant_id", id)
      .order("created_at", { ascending: false });

    // Fetch activities
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("participant_id", id)
      .order("created_at", { ascending: false });

    // Fetch documents
    const { data: documents } = await supabase
      .from("documents")
      .select("*")
      .eq("participant_id", id)
      .order("created_at", { ascending: false });

    // Fetch Travis conversations
    const { data: travisConversations } = await supabase
      .from("travis_conversations")
      .select("*")
      .eq("participant_id", id)
      .order("created_at", { ascending: true });

    // Fetch cohort if exists
    let cohort = null;
    if (participant.cohort_id) {
      const { data: cohortData } = await supabase
        .from("cohorts")
        .select("*")
        .eq("id", participant.cohort_id)
        .single();
      cohort = cohortData;
    }

    // Fetch case worker if assigned
    let caseWorker = null;
    if (participant.assigned_case_worker) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", participant.assigned_case_worker)
        .single();
      caseWorker = userData;
    }

    return {
      success: true,
      data: {
        participant,
        checkins: checkins || [],
        activities: activities || [],
        documents: documents || [],
        travisConversations: travisConversations || [],
        cohort,
        caseWorker,
      },
    };
  } catch (error) {
    console.error("Error in getParticipantWithAllData:", error);
    return { success: false, error: "Failed to fetch participant data" };
  }
}
