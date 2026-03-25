/**
 * Dashboard Verification Script
 *
 * Run with: npx tsx scripts/verify-dashboard.ts
 *
 * Tests all dashboard queries against the production database to verify
 * they work correctly before deployment.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.log("Make sure you have these in your .env.local file");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  data: unknown;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    const data = await fn();
    results.push({ name, passed: true, data });
    console.log(`✅ ${name}`);
    console.log(`   Result:`, JSON.stringify(data, null, 2).substring(0, 200));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, data: null, error: errorMsg });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${errorMsg}`);
  }
}

async function runTests() {
  console.log("\n🔍 Dashboard Query Verification\n");
  console.log("=".repeat(50));

  // Test 1: Leads this month
  await test("1. Leads this month", async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count };
  });

  // Test 2: Leads last month
  await test("2. Leads last month", async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString());

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count };
  });

  // Test 3: Active participants
  await test("3. Active participants (enrolled + active)", async () => {
    const { count, error } = await supabase
      .from("participants")
      .select("*", { count: "exact", head: true })
      .in("status", ["enrolled", "active"]);

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count };
  });

  // Test 4: MSP clients (non-churned)
  await test("4. MSP clients (non-churned)", async () => {
    const { count, error } = await supabase
      .from("msp_clients")
      .select("*", { count: "exact", head: true })
      .neq("pipeline_stage", "churned");

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count };
  });

  // Test 5: Monthly revenue (active clients)
  await test("5. Monthly revenue from active clients", async () => {
    const { data, error } = await supabase
      .from("msp_clients")
      .select("monthly_value")
      .eq("pipeline_stage", "active");

    if (error) throw new Error(`${error.code}: ${error.message}`);

    const total = data?.reduce((sum, c) => sum + (c.monthly_value || 0), 0) || 0;
    return { total, clientCount: data?.length };
  });

  // Test 6: Recent activities
  await test("6. Recent activities", async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count: data?.length, firstActivity: data?.[0]?.description };
  });

  // Test 7: Upcoming events
  await test("7. Upcoming events", async () => {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, start_datetime, tickets_sold, capacity, event_type")
      .gte("start_datetime", new Date().toISOString())
      .eq("is_cancelled", false)
      .order("start_datetime", { ascending: true })
      .limit(3);

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count: data?.length, events: data?.map(e => e.title) };
  });

  // Test 8: Travis escalations (participants with flags)
  await test("8. Travis escalations (high severity)", async () => {
    const { data, error } = await supabase
      .from("participants")
      .select("id, first_name, last_name, travis_escalation_flags, updated_at")
      .in("status", ["enrolled", "active"])
      .not("travis_escalation_flags", "is", null);

    if (error) throw new Error(`${error.code}: ${error.message}`);

    // Filter to those with actual flags
    const withFlags = data?.filter(p => {
      const flags = p.travis_escalation_flags as string[] | null;
      return flags && flags.length > 0;
    });

    return { count: withFlags?.length };
  });

  // Test 9: Stuck participants (no progress in 14+ days)
  await test("9. Stuck participants (medium severity)", async () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { data, error } = await supabase
      .from("participants")
      .select("id, first_name, last_name, created_at")
      .in("status", ["enrolled", "active"])
      .eq("progress_percentage", 0)
      .lt("created_at", twoWeeksAgo.toISOString());

    if (error) throw new Error(`${error.code}: ${error.message}`);
    return { count: data?.length };
  });

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("\n📊 Summary\n");

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("\n❌ Failed tests:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log("\n✅ All tests passed! Dashboard queries are working.");
    process.exit(0);
  }
}

runTests();
