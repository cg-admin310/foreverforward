/**
 * Clear All Database Data
 * Run with: npx tsx scripts/clear-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Make sure .env.local exists.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables in order (children before parents to handle foreign keys)
const tablesToClear = [
  // Event related
  'event_checkin_log',
  'event_feedback',
  'event_order_items',
  'event_analytics',
  'event_tables',
  'event_attendees',
  'event_addons',
  'event_ticket_types',
  'events',

  // Donation related
  'donor_communications',
  'donation_allocations',
  'impact_metrics',
  'donor_profiles',
  'donations',

  // Program related
  'checkins',
  'travis_conversations',
  'participants',
  'cohorts',

  // MSP/Client related
  'assignments',
  'billing_events',
  'revenue_history',
  'invoices',
  'documents',
  'msp_clients',

  // CRM tables
  'activities',
  'emails',
  'leads',

  // Content tables
  'blog_posts',
  'blog_categories',
  'newsletter_subscribers',

  // Resource tables
  'workforce',
  'resources',

  // System tables
  'webhook_events',
];

async function clearAllData() {
  console.log('🗑️  Starting database clear...\n');

  for (const table of tablesToClear) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        // Table might not exist or have different structure
        console.log(`⚠️  ${table}: ${error.message}`);
      } else {
        console.log(`✅ Cleared: ${table}`);
      }
    } catch (err) {
      console.log(`❌ Error clearing ${table}:`, err);
    }
  }

  console.log('\n✨ Database clear complete!\n');

  // Verify counts
  console.log('📊 Verification:');
  const verifyTables = ['leads', 'participants', 'msp_clients', 'events', 'donations', 'blog_posts'];

  for (const table of verifyTables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`   ${table}: ${count || 0} rows`);
  }
}

clearAllData().catch(console.error);
