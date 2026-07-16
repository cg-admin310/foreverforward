"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { MemberKind } from "@/types/database";

type ActionResult<T = void> = { success: boolean; data?: T; error?: string };

/**
 * Creates a member auth account (confirmed) + members profile row using the
 * service-role client. The client then signs in with the same credentials.
 */
export async function signUpMember(input: {
  email: string;
  password: string;
  fullName: string;
  kind: MemberKind;
  phone?: string;
  guardianName?: string;
  guardianEmail?: string;
}): Promise<ActionResult<{ userId: string }>> {
  try {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password || input.password.length < 8) {
      return { success: false, error: "Enter an email and a password of at least 8 characters." };
    }
    const db = createAdminClient();

    const { data: created, error } = await db.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName, is_member: true },
    });
    if (error || !created.user) {
      return { success: false, error: error?.message ?? "Could not create account" };
    }

    const { error: memberError } = await db.from("members").insert({
      id: created.user.id,
      email,
      full_name: input.fullName || null,
      kind: input.kind,
      phone: input.phone || null,
      guardian_name: input.guardianName || null,
      guardian_email: input.guardianEmail || null,
    });
    if (memberError) {
      // Roll back the auth user so the email can be retried cleanly.
      await db.auth.admin.deleteUser(created.user.id);
      return { success: false, error: memberError.message };
    }

    return { success: true, data: { userId: created.user.id } };
  } catch {
    return { success: false, error: "Something went wrong creating your account." };
  }
}
