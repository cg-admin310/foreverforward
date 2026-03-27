/**
 * Clear Stripe Test Data
 * Run with: npx tsx scripts/clear-stripe-test-data.ts
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ Missing STRIPE_SECRET_KEY in .env.local');
  process.exit(1);
}

if (!stripeSecretKey.startsWith('sk_test_')) {
  console.error('❌ This script only works with Stripe TEST keys (sk_test_*)');
  console.error('   Current key starts with:', stripeSecretKey.substring(0, 10));
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

async function clearStripeTestData() {
  console.log('🧹 Starting Stripe test data cleanup...\n');

  // Delete all subscriptions first
  console.log('📋 Deleting subscriptions...');
  let subscriptionCount = 0;
  let hasMoreSubs = true;

  while (hasMoreSubs) {
    const subscriptions = await stripe.subscriptions.list({ limit: 100 });
    for (const sub of subscriptions.data) {
      try {
        await stripe.subscriptions.cancel(sub.id);
        subscriptionCount++;
      } catch (err) {
        console.log(`   ⚠️ Could not cancel subscription ${sub.id}`);
      }
    }
    hasMoreSubs = subscriptions.has_more;
  }
  console.log(`   ✅ Cancelled ${subscriptionCount} subscriptions`);

  // Delete all customers
  console.log('\n👥 Deleting customers...');
  let customerCount = 0;
  let hasMoreCustomers = true;

  while (hasMoreCustomers) {
    const customers = await stripe.customers.list({ limit: 100 });
    for (const customer of customers.data) {
      try {
        await stripe.customers.del(customer.id);
        customerCount++;
      } catch (err) {
        console.log(`   ⚠️ Could not delete customer ${customer.id}`);
      }
    }
    hasMoreCustomers = customers.has_more;
  }
  console.log(`   ✅ Deleted ${customerCount} customers`);

  // List products (for reference, don't delete as they may be reused)
  console.log('\n📦 Listing products (not deleting)...');
  const products = await stripe.products.list({ limit: 100 });
  console.log(`   ℹ️  Found ${products.data.length} products (kept for reuse)`);

  // Final summary
  console.log('\n✨ Stripe test data cleanup complete!');
  console.log(`   - Subscriptions cancelled: ${subscriptionCount}`);
  console.log(`   - Customers deleted: ${customerCount}`);
  console.log('\n📊 Ready for E2E testing!\n');
}

clearStripeTestData().catch(console.error);
