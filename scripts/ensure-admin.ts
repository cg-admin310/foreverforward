// Ensures the founder admin account exists and can log in.
// Run: ADMIN_SEED_PASSWORD='...' npx tsx scripts/ensure-admin.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const email = "wilform.thomas@gmail.com";
const password = process.env.ADMIN_SEED_PASSWORD || "power123!!!";

async function run() {
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users.find((u) => u.email?.toLowerCase() === email);

  let id: string;
  if (existing) {
    id = existing.id;
    await db.auth.admin.updateUserById(id, { password, email_confirm: true });
    console.log("↻ Updated existing auth user + password");
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "TJ Wilform" },
    });
    if (error || !data.user) throw error;
    id = data.user.id;
    console.log("＋ Created auth user");
  }

  const { error: uErr } = await db
    .from("users")
    .upsert({ id, email, full_name: "TJ Wilform", role: "super_admin", is_active: true });
  if (uErr) throw uErr;
  console.log(`✅ ${email} is super_admin and can log in at /login`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
