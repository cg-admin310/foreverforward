import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole, Member } from "@/types/database";

/** The authenticated Supabase auth user, or null. */
export async function getAuthUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export interface StaffUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

/**
 * Requires an authenticated staff member (a row in `users`). Redirects to
 * /login otherwise. Reads the role with the service-role client (server-only).
 */
export async function getStaffUser(): Promise<StaffUser> {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!data || data.is_active === false) redirect("/login");

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role as UserRole,
  };
}

/** Staff user or null (no redirect) — for pages shared by staff + others. */
export async function getOptionalStaffUser(): Promise<StaffUser | null> {
  const user = await getAuthUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();
  if (!data || data.is_active === false) return null;
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role as UserRole,
  };
}

/**
 * Requires an authenticated member (a row in `members`). Redirects to
 * /portal/login if not signed in, or home if signed in but not a member.
 */
export async function getMemberUser(): Promise<Member> {
  const user = await getAuthUser();
  if (!user) redirect("/portal/login");

  const admin = createAdminClient();
  const { data } = await admin.from("members").select("*").eq("id", user.id).single();

  if (!data) redirect("/");
  return data as Member;
}

/** Member row or null (no redirect). */
export async function getOptionalMember(): Promise<Member | null> {
  const user = await getAuthUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("members").select("*").eq("id", user.id).single();
  return (data as Member) ?? null;
}
