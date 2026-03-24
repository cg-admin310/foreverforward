// Script to seed admin users for Forever Forward platform
// Run with: npx tsx scripts/seed-admin-users.ts

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface AdminUser {
  email: string;
  password: string;
  full_name: string;
  role: "super_admin" | "case_worker" | "sales_lead" | "technician" | "event_coordinator";
}

const adminUsers: AdminUser[] = [
  {
    email: "wilform.thomas@gmail.com",
    password: "power123",
    full_name: "TJ Wilform",
    role: "super_admin",
  },
  {
    email: "caseworker@forever4ward.org",
    password: "case2024!",
    full_name: "Maria Santos",
    role: "case_worker",
  },
  {
    email: "tech@forever4ward.org",
    password: "tech2024!",
    full_name: "Devon Jackson",
    role: "technician",
  },
  {
    email: "events@forever4ward.org",
    password: "events2024!",
    full_name: "Aaliyah Thompson",
    role: "event_coordinator",
  },
];

async function seedAdminUsers() {
  console.log("🚀 Starting admin user seeding...\n");

  for (const user of adminUsers) {
    console.log(`Creating ${user.role}: ${user.email}...`);

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
      });

      if (authError) {
        // Check if user already exists
        if (authError.message.includes("already been registered")) {
          console.log(`  ⚠️  User ${user.email} already exists in auth, checking users table...`);

          // Get the existing user
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find((u) => u.email === user.email);

          if (existingUser) {
            // Update their password
            await supabase.auth.admin.updateUserById(existingUser.id, {
              password: user.password,
            });
            console.log(`  ✓ Updated password for ${user.email}`);

            // Check/update users table
            const { data: profileData } = await supabase
              .from("users")
              .select("*")
              .eq("id", existingUser.id)
              .single();

            if (!profileData) {
              // Insert into users table
              const { error: insertError } = await supabase.from("users").insert({
                id: existingUser.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                is_active: true,
              });

              if (insertError) {
                console.log(`  ❌ Error inserting user profile: ${insertError.message}`);
              } else {
                console.log(`  ✓ Created user profile in database`);
              }
            } else {
              // Update role if needed
              const { error: updateError } = await supabase
                .from("users")
                .update({ role: user.role, full_name: user.full_name })
                .eq("id", existingUser.id);

              if (updateError) {
                console.log(`  ❌ Error updating user profile: ${updateError.message}`);
              } else {
                console.log(`  ✓ Updated user profile in database`);
              }
            }
          }
          continue;
        }
        throw authError;
      }

      if (authData?.user) {
        // Step 2: Insert into users table
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: true,
        });

        if (profileError) {
          console.log(`  ❌ Error creating user profile: ${profileError.message}`);
        } else {
          console.log(`  ✓ Created successfully!`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    console.log("");
  }

  console.log("=" .repeat(60));
  console.log("\n📋 ADMIN LOGIN CREDENTIALS\n");
  console.log("=" .repeat(60));

  for (const user of adminUsers) {
    console.log(`\n${user.role.toUpperCase().replace("_", " ")}`);
    console.log(`  Name:     ${user.full_name}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${user.password}`);
  }

  console.log("\n" + "=" .repeat(60));
  console.log("\n✅ Admin user seeding complete!");
  console.log("🔗 Login at: http://localhost:3000/login\n");
}

seedAdminUsers().catch(console.error);
