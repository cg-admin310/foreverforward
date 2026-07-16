"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffUser } from "@/lib/auth";
import type { MembershipStatus, ProgramType } from "@/types/database";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

export interface ProgramRequestRow {
  id: string;
  member_id: string;
  program: ProgramType;
  status: MembershipStatus;
  message: string | null;
  admin_notes: string | null;
  created_at: string;
  decided_at: string | null;
  member_name: string | null;
  member_email: string;
  member_kind: string;
}

export async function listProgramRequests(): Promise<ActionResult<ProgramRequestRow[]>> {
  try {
    await getStaffUser();
    const db = createAdminClient();
    const { data, error } = await db
      .from("program_memberships")
      .select(
        "id, member_id, program, status, message, admin_notes, created_at, decided_at, members ( full_name, email, kind )"
      )
      .order("created_at", { ascending: false });
    if (error) return { success: false, error: error.message };

    const rows: ProgramRequestRow[] = (data ?? []).map((r) => {
      const rel = r.members as unknown;
      const m = (Array.isArray(rel) ? rel[0] : rel) as
        | { full_name: string | null; email: string; kind: string }
        | undefined;
      return {
        id: r.id as string,
        member_id: r.member_id as string,
        program: r.program as ProgramType,
        status: r.status as MembershipStatus,
        message: (r.message ?? null) as string | null,
        admin_notes: (r.admin_notes ?? null) as string | null,
        created_at: r.created_at as string,
        decided_at: (r.decided_at ?? null) as string | null,
        member_name: m?.full_name ?? null,
        member_email: m?.email ?? "",
        member_kind: m?.kind ?? "other",
      };
    });
    return { success: true, data: rows };
  } catch {
    return { success: false, error: "Failed to load requests" };
  }
}

export async function decideProgramRequest(
  id: string,
  decision: Extract<MembershipStatus, "approved" | "waitlisted" | "denied">,
  adminNotes?: string
): Promise<ActionResult> {
  try {
    const staff = await getStaffUser();
    const db = createAdminClient();
    const { error } = await db
      .from("program_memberships")
      .update({
        status: decision,
        decided_by: staff.id,
        decided_at: new Date().toISOString(),
        admin_notes: adminNotes ?? null,
      })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    await db.from("activities").insert({
      activity_type: "program_membership_decision",
      description: `Program request ${decision}`,
      metadata: { membership_id: id, decision },
    });

    revalidatePath("/program-requests");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update request" };
  }
}
