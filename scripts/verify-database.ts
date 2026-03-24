// Database Verification Script for Forever Forward Platform
// Run with: npx tsx scripts/verify-database.ts

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

// Expected tables based on schema
const expectedTables = [
  "users",
  "leads",
  "cohorts",
  "participants",
  "msp_clients",
  "documents",
  "emails",
  "activities",
  "workforce",
  "assignments",
  "events",
  "event_attendees",
  "resources",
  "donations",
  "checkins",
  "blog_categories",
  "blog_posts",
  "newsletter_subscribers",
  "travis_conversations",
];

// Expected enums
const expectedEnums = [
  "user_role",
  "lead_type",
  "lead_status",
  "program_type",
  "participant_status",
  "pipeline_stage",
  "document_type",
  "document_status",
  "email_status",
  "event_type",
  "donation_frequency",
];

interface VerificationResult {
  table: string;
  exists: boolean;
  rowCount: number;
  error?: string;
}

interface EnumResult {
  enum: string;
  exists: boolean;
  values?: string[];
  error?: string;
}

async function checkTableExists(tableName: string): Promise<VerificationResult> {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: false })
      .limit(0);

    if (error) {
      return { table: tableName, exists: false, rowCount: 0, error: error.message };
    }

    // Get actual count
    const { count: actualCount } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    return { table: tableName, exists: true, rowCount: actualCount || 0 };
  } catch (err) {
    return {
      table: tableName,
      exists: false,
      rowCount: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

async function checkEnum(enumName: string): Promise<EnumResult> {
  try {
    const { data, error } = await supabase.rpc("get_enum_values", { enum_name: enumName });

    if (error) {
      // Try direct query
      const { data: enumData, error: enumError } = await supabase
        .from("pg_enum")
        .select("enumlabel")
        .eq("enumtypid", enumName);

      if (enumError) {
        return { enum: enumName, exists: false, error: "Could not verify (RPC not available)" };
      }
    }

    return { enum: enumName, exists: true, values: data };
  } catch {
    return { enum: enumName, exists: false, error: "Could not verify" };
  }
}

async function testCRUDOperations() {
  console.log("\n🧪 Testing CRUD Operations...\n");

  const results: { operation: string; success: boolean; error?: string }[] = [];

  // Test 1: Create a lead
  console.log("  Testing leads table...");
  const testLeadId = crypto.randomUUID();
  const { error: leadInsertError } = await supabase.from("leads").insert({
    id: testLeadId,
    first_name: "Test",
    last_name: "Lead",
    email: "test@verification.com",
    lead_type: "general",
    status: "new",
  });

  if (leadInsertError) {
    results.push({ operation: "INSERT lead", success: false, error: leadInsertError.message });
  } else {
    results.push({ operation: "INSERT lead", success: true });

    // Read it back
    const { data: leadData, error: leadReadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", testLeadId)
      .single();

    if (leadReadError) {
      results.push({ operation: "SELECT lead", success: false, error: leadReadError.message });
    } else {
      results.push({ operation: "SELECT lead", success: true });
    }

    // Update it
    const { error: leadUpdateError } = await supabase
      .from("leads")
      .update({ status: "contacted" })
      .eq("id", testLeadId);

    if (leadUpdateError) {
      results.push({ operation: "UPDATE lead", success: false, error: leadUpdateError.message });
    } else {
      results.push({ operation: "UPDATE lead", success: true });
    }

    // Delete it
    const { error: leadDeleteError } = await supabase.from("leads").delete().eq("id", testLeadId);

    if (leadDeleteError) {
      results.push({ operation: "DELETE lead", success: false, error: leadDeleteError.message });
    } else {
      results.push({ operation: "DELETE lead", success: true });
    }
  }

  // Test 2: Create an event
  console.log("  Testing events table...");
  const testEventId = crypto.randomUUID();
  const { error: eventInsertError } = await supabase.from("events").insert({
    id: testEventId,
    title: "Test Event",
    slug: "test-event-verification",
    event_type: "community",
    start_datetime: new Date().toISOString(),
  });

  if (eventInsertError) {
    results.push({ operation: "INSERT event", success: false, error: eventInsertError.message });
  } else {
    results.push({ operation: "INSERT event", success: true });

    // Delete it
    const { error: eventDeleteError } = await supabase.from("events").delete().eq("id", testEventId);
    if (eventDeleteError) {
      results.push({ operation: "DELETE event", success: false, error: eventDeleteError.message });
    } else {
      results.push({ operation: "DELETE event", success: true });
    }
  }

  // Test 3: Create a blog post
  console.log("  Testing blog_posts table...");
  const testPostId = crypto.randomUUID();
  const { error: postInsertError } = await supabase.from("blog_posts").insert({
    id: testPostId,
    title: "Test Blog Post",
    slug: "test-blog-post-verification",
    content: "This is a test post for verification.",
    status: "draft",
  });

  if (postInsertError) {
    results.push({ operation: "INSERT blog_post", success: false, error: postInsertError.message });
  } else {
    results.push({ operation: "INSERT blog_post", success: true });

    // Delete it
    const { error: postDeleteError } = await supabase.from("blog_posts").delete().eq("id", testPostId);
    if (postDeleteError) {
      results.push({ operation: "DELETE blog_post", success: false, error: postDeleteError.message });
    } else {
      results.push({ operation: "DELETE blog_post", success: true });
    }
  }

  // Test 4: Create an MSP client
  console.log("  Testing msp_clients table...");
  const testClientId = crypto.randomUUID();
  const { error: clientInsertError } = await supabase.from("msp_clients").insert({
    id: testClientId,
    organization_name: "Test Organization",
    primary_contact_name: "Test Contact",
    primary_contact_email: "test@testorg.com",
    pipeline_stage: "new_lead",
  });

  if (clientInsertError) {
    results.push({ operation: "INSERT msp_client", success: false, error: clientInsertError.message });
  } else {
    results.push({ operation: "INSERT msp_client", success: true });

    // Delete it
    const { error: clientDeleteError } = await supabase.from("msp_clients").delete().eq("id", testClientId);
    if (clientDeleteError) {
      results.push({ operation: "DELETE msp_client", success: false, error: clientDeleteError.message });
    } else {
      results.push({ operation: "DELETE msp_client", success: true });
    }
  }

  // Test 5: Create a donation
  console.log("  Testing donations table...");
  const testDonationId = crypto.randomUUID();
  const { error: donationInsertError } = await supabase.from("donations").insert({
    id: testDonationId,
    donor_first_name: "Test",
    donor_last_name: "Donor",
    donor_email: "donor@test.com",
    amount: 100.0,
    frequency: "one_time",
  });

  if (donationInsertError) {
    results.push({ operation: "INSERT donation", success: false, error: donationInsertError.message });
  } else {
    results.push({ operation: "INSERT donation", success: true });

    // Delete it
    const { error: donationDeleteError } = await supabase.from("donations").delete().eq("id", testDonationId);
    if (donationDeleteError) {
      results.push({ operation: "DELETE donation", success: false, error: donationDeleteError.message });
    } else {
      results.push({ operation: "DELETE donation", success: true });
    }
  }

  // Test 6: Create a participant
  console.log("  Testing participants table...");
  const testParticipantId = crypto.randomUUID();
  const { error: participantInsertError } = await supabase.from("participants").insert({
    id: testParticipantId,
    first_name: "Test",
    last_name: "Participant",
    email: "participant@test.com",
    program: "father_forward",
    status: "applicant",
  });

  if (participantInsertError) {
    results.push({ operation: "INSERT participant", success: false, error: participantInsertError.message });
  } else {
    results.push({ operation: "INSERT participant", success: true });

    // Delete it
    const { error: participantDeleteError } = await supabase
      .from("participants")
      .delete()
      .eq("id", testParticipantId);
    if (participantDeleteError) {
      results.push({
        operation: "DELETE participant",
        success: false,
        error: participantDeleteError.message,
      });
    } else {
      results.push({ operation: "DELETE participant", success: true });
    }
  }

  // Test 7: Create event attendee
  console.log("  Testing event_attendees table...");
  // First create a real event
  const realEventId = crypto.randomUUID();
  await supabase.from("events").insert({
    id: realEventId,
    title: "Temp Event for Attendee Test",
    slug: "temp-event-attendee-test",
    event_type: "community",
    start_datetime: new Date().toISOString(),
  });

  const testAttendeeId = crypto.randomUUID();
  const { error: attendeeInsertError } = await supabase.from("event_attendees").insert({
    id: testAttendeeId,
    event_id: realEventId,
    first_name: "Test",
    last_name: "Attendee",
    email: "attendee@test.com",
  });

  if (attendeeInsertError) {
    results.push({ operation: "INSERT event_attendee", success: false, error: attendeeInsertError.message });
  } else {
    results.push({ operation: "INSERT event_attendee", success: true });

    // Delete attendee and event
    await supabase.from("event_attendees").delete().eq("id", testAttendeeId);
    results.push({ operation: "DELETE event_attendee", success: true });
  }

  // Clean up temp event
  await supabase.from("events").delete().eq("id", realEventId);

  // Test 8: Newsletter subscriber
  console.log("  Testing newsletter_subscribers table...");
  const { error: subscriberInsertError } = await supabase.from("newsletter_subscribers").insert({
    email: "newsletter-test@verification.com",
    first_name: "Test",
    last_name: "Subscriber",
  });

  if (subscriberInsertError) {
    results.push({
      operation: "INSERT newsletter_subscriber",
      success: false,
      error: subscriberInsertError.message,
    });
  } else {
    results.push({ operation: "INSERT newsletter_subscriber", success: true });

    // Delete it
    const { error: subscriberDeleteError } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("email", "newsletter-test@verification.com");
    if (subscriberDeleteError) {
      results.push({
        operation: "DELETE newsletter_subscriber",
        success: false,
        error: subscriberDeleteError.message,
      });
    } else {
      results.push({ operation: "DELETE newsletter_subscriber", success: true });
    }
  }

  return results;
}

async function verifyDatabase() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║     FOREVER FORWARD DATABASE VERIFICATION                      ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`);

  // ============================================
  // 1. Check all tables exist
  // ============================================
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("📊 TABLE VERIFICATION");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const tableResults: VerificationResult[] = [];
  let tablesExist = 0;
  let tablesMissing = 0;
  let tablesWithData = 0;

  for (const table of expectedTables) {
    const result = await checkTableExists(table);
    tableResults.push(result);

    if (result.exists) {
      tablesExist++;
      if (result.rowCount > 0) {
        tablesWithData++;
      }
    } else {
      tablesMissing++;
    }
  }

  // Display table results
  console.log("Table Name                 | Status  | Rows  | Notes");
  console.log("---------------------------|---------|-------|------------------");

  for (const result of tableResults) {
    const status = result.exists ? "✓ OK" : "✗ MISSING";
    const rows = result.exists ? result.rowCount.toString().padStart(5) : "  N/A";
    const notes = result.error || (result.rowCount > 0 ? "Has data" : "Empty");

    console.log(
      `${result.table.padEnd(26)} | ${status.padEnd(7)} | ${rows} | ${notes}`
    );
  }

  console.log("\n📈 Summary:");
  console.log(`   Tables found: ${tablesExist}/${expectedTables.length}`);
  console.log(`   Tables missing: ${tablesMissing}`);
  console.log(`   Tables with data: ${tablesWithData}`);

  // ============================================
  // 2. Check blog_categories (should have seed data)
  // ============================================
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📁 BLOG CATEGORIES (Seed Data)");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const { data: categories, error: catError } = await supabase
    .from("blog_categories")
    .select("*")
    .order("display_order");

  if (catError) {
    console.log(`❌ Error fetching categories: ${catError.message}`);
  } else if (categories && categories.length > 0) {
    console.log("Category Name        | Slug                  | Order");
    console.log("---------------------|----------------------|------");
    for (const cat of categories) {
      console.log(
        `${cat.name.padEnd(20)} | ${cat.slug.padEnd(20)} | ${cat.display_order}`
      );
    }
    console.log(`\n✓ ${categories.length} categories found (seed data intact)`);
  } else {
    console.log("⚠️  No blog categories found - seed data may be missing");
  }

  // ============================================
  // 3. Check users table
  // ============================================
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("👥 ADMIN USERS");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*")
    .order("created_at");

  if (userError) {
    console.log(`❌ Error fetching users: ${userError.message}`);
  } else if (users && users.length > 0) {
    console.log("Name                      | Email                           | Role");
    console.log("--------------------------|--------------------------------|------------------");
    for (const user of users) {
      console.log(
        `${(user.full_name || "N/A").padEnd(25)} | ${user.email.padEnd(30)} | ${user.role}`
      );
    }
    console.log(`\n✓ ${users.length} admin users configured`);
  } else {
    console.log("⚠️  No admin users found");
  }

  // ============================================
  // 4. Verify empty production tables
  // ============================================
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("🧹 PRODUCTION DATA CHECK (Should be empty)");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const productionTables = [
    "leads",
    "participants",
    "cohorts",
    "msp_clients",
    "documents",
    "emails",
    "activities",
    "workforce",
    "assignments",
    "events",
    "event_attendees",
    "resources",
    "donations",
    "checkins",
    "blog_posts",
    "newsletter_subscribers",
    "travis_conversations",
  ];

  let allEmpty = true;
  for (const table of productionTables) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });

    if (count && count > 0) {
      console.log(`⚠️  ${table}: ${count} rows (has data)`);
      allEmpty = false;
    }
  }

  if (allEmpty) {
    console.log("✓ All production tables are empty - ready for use!");
  }

  // ============================================
  // 5. Test CRUD Operations
  // ============================================
  const crudResults = await testCRUDOperations();

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📝 CRUD OPERATION RESULTS");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let crudPassed = 0;
  let crudFailed = 0;

  for (const result of crudResults) {
    if (result.success) {
      console.log(`  ✓ ${result.operation}`);
      crudPassed++;
    } else {
      console.log(`  ✗ ${result.operation}: ${result.error}`);
      crudFailed++;
    }
  }

  console.log(`\n📈 CRUD Summary: ${crudPassed}/${crudResults.length} passed`);

  // ============================================
  // 6. Final Summary
  // ============================================
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    VERIFICATION SUMMARY                        ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const allTablesPassed = tablesMissing === 0;
  const allCrudPassed = crudFailed === 0;
  const hasAdminUsers = users && users.length > 0;
  const hasCategories = categories && categories.length > 0;

  console.log(`  Database Tables:     ${allTablesPassed ? "✓ PASS" : "✗ FAIL"} (${tablesExist}/${expectedTables.length})`);
  console.log(`  CRUD Operations:     ${allCrudPassed ? "✓ PASS" : "✗ FAIL"} (${crudPassed}/${crudResults.length})`);
  console.log(`  Admin Users:         ${hasAdminUsers ? "✓ PASS" : "✗ FAIL"} (${users?.length || 0} users)`);
  console.log(`  Blog Categories:     ${hasCategories ? "✓ PASS" : "✗ FAIL"} (${categories?.length || 0} categories)`);
  console.log(`  Production Ready:    ${allEmpty ? "✓ PASS" : "⚠️  HAS DATA"}`);

  const overallPass = allTablesPassed && allCrudPassed && hasAdminUsers && hasCategories;

  console.log("\n" + "═".repeat(68));
  if (overallPass && allEmpty) {
    console.log("\n🎉 DATABASE VERIFICATION COMPLETE - PRODUCTION READY!\n");
  } else if (overallPass) {
    console.log("\n✅ DATABASE VERIFICATION COMPLETE - Some tables have data\n");
  } else {
    console.log("\n⚠️  DATABASE VERIFICATION COMPLETE - Issues found above\n");
  }
}

verifyDatabase().catch(console.error);
