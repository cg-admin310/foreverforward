"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

/**
 * Creates (or updates) a program membership request keyed by email. This is the
 * single funnel: a website enrollment and a portal request land in the same
 * table. If a member account already exists for the email, it's linked so they
 * get access the moment the request is approved.
 */
export async function createEnrollmentRequest(input: {
  email: string;
  fullName?: string;
  program: string;
  source: "portal" | "website";
  message?: string;
}): Promise<ActionResult> {
  try {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.program) return { success: false, error: "Missing email or program" };
    const db = createAdminClient();

    const { data: member } = await db
      .from("members")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const { data: existing } = await db
      .from("program_memberships")
      .select("id, status, member_id")
      .eq("email", email)
      .eq("program", input.program)
      .maybeSingle();

    if (existing) {
      // Don't downgrade an existing decision; just keep identity/link current.
      await db
        .from("program_memberships")
        .update({
          full_name: input.fullName ?? undefined,
          member_id: existing.member_id ?? member?.id ?? null,
        })
        .eq("id", existing.id);
      revalidatePath("/program-requests");
      return { success: true };
    }

    const { error } = await db.from("program_memberships").insert({
      email,
      full_name: input.fullName ?? null,
      program: input.program,
      status: "pending",
      source: input.source,
      member_id: member?.id ?? null,
      message: input.message ?? null,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/program-requests");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create request" };
  }
}

/** Links any email-keyed membership rows to a member id (called at signup). */
export async function claimMembershipsForMember(
  memberId: string,
  email: string
): Promise<void> {
  const db = createAdminClient();
  await db
    .from("program_memberships")
    .update({ member_id: memberId })
    .eq("email", email.trim().toLowerCase())
    .is("member_id", null);
}
