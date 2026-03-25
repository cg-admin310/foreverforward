#!/usr/bin/env npx tsx
/**
 * Seed a test MSP client for invoice testing
 * Run with: npx tsx scripts/seed-test-client.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTestClient() {
  console.log("Creating test MSP client...\n");

  const testClient = {
    organization_name: "Test Company Inc",
    organization_type: "nonprofit",
    primary_contact_name: "Test Client",
    primary_contact_email: "test@testcompany.com",
    primary_contact_phone: "(555) 123-4567",
    primary_contact_title: "IT Manager",
    city: "Los Angeles",
    state: "CA",
    pipeline_stage: "active", // Must be active, proposal, or negotiation for billing
    service_package: "growth",
    services: ["managed_it", "help_desk"],
    user_count: 25,
    monthly_value: 2500,
    days_in_stage: 0,
    stage_entered_at: new Date().toISOString(),
    billing_enabled: true,
  };

  const { data, error } = await supabase
    .from("msp_clients")
    .insert(testClient)
    .select()
    .single();

  if (error) {
    console.error("Error creating client:", error.message);
    return;
  }

  console.log("✓ Test client created successfully!");
  console.log("\nClient Details:");
  console.log(`  ID: ${data.id}`);
  console.log(`  Name: ${data.organization_name}`);
  console.log(`  Email: ${data.primary_contact_email}`);
  console.log(`  Pipeline Stage: ${data.pipeline_stage}`);
  console.log(`  Monthly Value: $${data.monthly_value}`);
  console.log("\nYou can now create invoices for this client in the billing page!");
}

seedTestClient().catch(console.error);
