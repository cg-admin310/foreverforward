"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Cohort, CohortInsert, CohortUpdate, ProgramType } from "@/types/database";

// =============================================================================
// TYPES
// =============================================================================

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CohortWithStats extends Cohort {
  enrolled_count: number;
  active_count: number;
  completed_count: number;
  case_worker_name: string | null;
}

export interface CohortStats {
  activeCohorts: number;
  upcomingCohorts: number;
  completedCohorts: number;
  totalEnrolled: number;
}

// =============================================================================
// GET COHORTS
// =============================================================================

export async function getCohorts(options?: {
  status?: "active" | "upcoming" | "completed" | "all";
  program?: ProgramType;
  limit?: number;
}): Promise<ActionResult<CohortWithStats[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    let query = supabase
      .from("cohorts")
      .select(`
        *,
        users!cohorts_case_worker_fkey (
          full_name
        ),
        participants (
          id,
          status
        )
      `)
      .order("start_date", { ascending: false });

    // Filter by program if specified
    if (options?.program) {
      query = query.eq("program", options.program);
    }

    // Apply limit if specified
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data: cohorts, error } = await query;

    if (error) {
      console.error("Error fetching cohorts:", error);
      return { success: false, error: error.message };
    }

    // Transform and calculate stats
    const cohortsWithStats: CohortWithStats[] = (cohorts || []).map((cohort) => {
      const participants = cohort.participants as { id: string; status: string }[] || [];

      // Calculate status based on dates
      let status: "active" | "upcoming" | "completed";
      const startDate = new Date(cohort.start_date);
      const endDate = cohort.end_date ? new Date(cohort.end_date) : null;
      const nowDate = new Date();

      if (startDate > nowDate) {
        status = "upcoming";
      } else if (endDate && endDate < nowDate) {
        status = "completed";
      } else {
        status = "active";
      }

      // Apply status filter if specified
      if (options?.status && options.status !== "all" && status !== options.status) {
        return null;
      }

      const caseWorker = cohort.users as { full_name: string } | null;

      return {
        ...cohort,
        enrolled_count: participants.length,
        active_count: participants.filter((p) => p.status === "active" || p.status === "enrolled").length,
        completed_count: participants.filter((p) => p.status === "completed").length,
        case_worker_name: caseWorker?.full_name || null,
        participants: undefined, // Remove raw participants array
        users: undefined, // Remove raw users join
      } as CohortWithStats;
    }).filter(Boolean) as CohortWithStats[];

    return { success: true, data: cohortsWithStats };
  } catch (error) {
    console.error("Error in getCohorts:", error);
    return { success: false, error: "Failed to fetch cohorts" };
  }
}

// =============================================================================
// GET COHORT BY ID
// =============================================================================

export async function getCohortById(
  id: string
): Promise<ActionResult<CohortWithStats>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: cohort, error } = await supabase
      .from("cohorts")
      .select(`
        *,
        users!cohorts_case_worker_fkey (
          full_name
        ),
        participants (
          id,
          status,
          first_name,
          last_name,
          email,
          progress_percentage
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching cohort:", error);
      return { success: false, error: error.message };
    }

    const participants = cohort.participants as { id: string; status: string }[] || [];
    const caseWorker = cohort.users as { full_name: string } | null;

    const cohortWithStats: CohortWithStats = {
      ...cohort,
      enrolled_count: participants.length,
      active_count: participants.filter((p) => p.status === "active" || p.status === "enrolled").length,
      completed_count: participants.filter((p) => p.status === "completed").length,
      case_worker_name: caseWorker?.full_name || null,
      participants: undefined,
      users: undefined,
    } as CohortWithStats;

    return { success: true, data: cohortWithStats };
  } catch (error) {
    console.error("Error in getCohortById:", error);
    return { success: false, error: "Failed to fetch cohort" };
  }
}

// =============================================================================
// GET COHORT STATS
// =============================================================================

export async function getCohortStats(): Promise<ActionResult<CohortStats>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    // Get all cohorts with participant counts
    const { data: cohorts, error } = await supabase
      .from("cohorts")
      .select(`
        id,
        start_date,
        end_date,
        participants (id)
      `);

    if (error) {
      console.error("Error fetching cohort stats:", error);
      return { success: false, error: error.message };
    }

    let activeCohorts = 0;
    let upcomingCohorts = 0;
    let completedCohorts = 0;
    let totalEnrolled = 0;

    const nowDate = new Date();

    for (const cohort of cohorts || []) {
      const startDate = new Date(cohort.start_date);
      const endDate = cohort.end_date ? new Date(cohort.end_date) : null;
      const participantCount = (cohort.participants as { id: string }[] || []).length;

      if (startDate > nowDate) {
        upcomingCohorts++;
        totalEnrolled += participantCount;
      } else if (endDate && endDate < nowDate) {
        completedCohorts++;
      } else {
        activeCohorts++;
        totalEnrolled += participantCount;
      }
    }

    return {
      success: true,
      data: {
        activeCohorts,
        upcomingCohorts,
        completedCohorts,
        totalEnrolled,
      },
    };
  } catch (error) {
    console.error("Error in getCohortStats:", error);
    return { success: false, error: "Failed to fetch cohort stats" };
  }
}

// =============================================================================
// CREATE COHORT
// =============================================================================

export interface CreateCohortInput {
  name: string;
  program: ProgramType;
  start_date: string;
  end_date?: string | null;
  max_participants?: number;
  total_weeks?: number;
  case_worker?: string | null;
  primary_instructor?: string | null;
  description?: string | null;
  is_accepting_applications?: boolean;
}

export async function createCohort(
  data: CreateCohortInput
): Promise<ActionResult<Cohort>> {
  try {
    const adminClient = createAdminClient();

    const { data: cohort, error } = await adminClient
      .from("cohorts")
      .insert({
        name: data.name,
        program: data.program,
        start_date: data.start_date,
        end_date: data.end_date || null,
        max_participants: data.max_participants || 20,
        total_weeks: data.total_weeks || 8,
        case_worker: data.case_worker || null,
        primary_instructor: data.primary_instructor || null,
        description: data.description || null,
        notes: null,
        is_active: true,
        is_accepting_applications: data.is_accepting_applications ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating cohort:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/program-management/cohorts");
    return { success: true, data: cohort };
  } catch (error) {
    console.error("Error in createCohort:", error);
    return { success: false, error: "Failed to create cohort" };
  }
}

// =============================================================================
// UPDATE COHORT
// =============================================================================

export async function updateCohort(
  id: string,
  data: CohortUpdate
): Promise<ActionResult<Cohort>> {
  try {
    const adminClient = createAdminClient();

    const { data: cohort, error } = await adminClient
      .from("cohorts")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cohort:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/program-management/cohorts");
    revalidatePath(`/program-management/cohorts/${id}`);
    return { success: true, data: cohort };
  } catch (error) {
    console.error("Error in updateCohort:", error);
    return { success: false, error: "Failed to update cohort" };
  }
}

// =============================================================================
// DELETE COHORT
// =============================================================================

export async function deleteCohort(id: string): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // First check if there are participants
    const { count } = await adminClient
      .from("participants")
      .select("*", { count: "exact", head: true })
      .eq("cohort_id", id);

    if (count && count > 0) {
      return {
        success: false,
        error: "Cannot delete cohort with enrolled participants. Remove participants first.",
      };
    }

    const { error } = await adminClient
      .from("cohorts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting cohort:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/program-management/cohorts");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCohort:", error);
    return { success: false, error: "Failed to delete cohort" };
  }
}

// =============================================================================
// GET COHORT PARTICIPANTS
// =============================================================================

export async function getCohortParticipants(cohortId: string): Promise<
  ActionResult<
    {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      status: string;
      progress_percentage: number | null;
      current_week: number | null;
    }[]
  >
> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: participants, error } = await supabase
      .from("participants")
      .select("id, first_name, last_name, email, status, progress_percentage, current_week")
      .eq("cohort_id", cohortId)
      .order("last_name", { ascending: true });

    if (error) {
      console.error("Error fetching cohort participants:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: participants || [] };
  } catch (error) {
    console.error("Error in getCohortParticipants:", error);
    return { success: false, error: "Failed to fetch participants" };
  }
}

