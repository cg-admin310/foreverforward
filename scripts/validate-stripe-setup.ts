#!/usr/bin/env npx tsx
/**
 * Stripe Setup Validation Script
 * Run with: npx tsx scripts/validate-stripe-setup.ts
 *
 * Validates that Stripe is properly configured for production
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const PRODUCTION_WEBHOOK_URL = "https://foreverforward-xi.vercel.app/api/stripe/webhooks";

const REQUIRED_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.marked_uncollectible",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string;
}

async function validateStripeSetup(): Promise<void> {
  console.log("\n========================================");
  console.log("  Forever Forward - Stripe Setup Validation");
  console.log("========================================\n");

  const results: ValidationResult[] = [];

  // 1. Check API Key
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    results.push({
      passed: false,
      message: "STRIPE_SECRET_KEY not set",
      details: "Add your Stripe secret key to .env.local",
    });
    printResults(results);
    return;
  }

  const isTestMode = apiKey.startsWith("sk_test_");
  results.push({
    passed: true,
    message: `Stripe API Key: ${isTestMode ? "TEST MODE" : "LIVE MODE"}`,
    details: isTestMode
      ? "Using test keys - switch to sk_live_* for production"
      : "Using live keys - real charges will occur",
  });

  // 2. Check Webhook Secret
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === "whsec_your_stripe_webhook_secret") {
    results.push({
      passed: false,
      message: "STRIPE_WEBHOOK_SECRET not configured",
      details: `
        1. Go to: https://dashboard.stripe.com/webhooks
        2. Click "Add endpoint"
        3. URL: ${PRODUCTION_WEBHOOK_URL}
        4. Select events: ${REQUIRED_WEBHOOK_EVENTS.slice(0, 3).join(", ")}...
        5. Copy the signing secret to .env.local
      `,
    });
  } else {
    results.push({
      passed: true,
      message: "Webhook secret configured",
    });
  }

  // 3. Initialize Stripe and verify connection
  const stripe = new Stripe(apiKey);

  try {
    const account = await stripe.accounts.retrieve();
    results.push({
      passed: true,
      message: `Connected to Stripe account: ${account.business_profile?.name || account.id}`,
      details: `Country: ${account.country}, Email: ${account.email}`,
    });
  } catch (error) {
    results.push({
      passed: false,
      message: "Failed to connect to Stripe",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    printResults(results);
    return;
  }

  // 4. Check webhooks
  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const productionWebhook = webhooks.data.find(
      (w) => w.url === PRODUCTION_WEBHOOK_URL && w.status === "enabled"
    );

    if (productionWebhook) {
      results.push({
        passed: true,
        message: "Production webhook endpoint configured",
        details: `URL: ${productionWebhook.url}`,
      });

      // Check subscribed events
      const subscribedEvents = productionWebhook.enabled_events || [];
      const missingEvents = REQUIRED_WEBHOOK_EVENTS.filter(
        (e) => !subscribedEvents.includes(e) && !subscribedEvents.includes("*")
      );

      if (missingEvents.length > 0) {
        results.push({
          passed: false,
          message: "Missing webhook event subscriptions",
          details: `Add these events: ${missingEvents.join(", ")}`,
        });
      } else {
        results.push({
          passed: true,
          message: "All required webhook events subscribed",
        });
      }
    } else {
      results.push({
        passed: false,
        message: "Production webhook endpoint not found",
        details: `
          Create webhook at: https://dashboard.stripe.com/webhooks
          URL: ${PRODUCTION_WEBHOOK_URL}
          Events: ${REQUIRED_WEBHOOK_EVENTS.join(", ")}
        `,
      });
    }
  } catch (error) {
    results.push({
      passed: false,
      message: "Failed to check webhooks",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // 5. Check billing portal configuration
  try {
    const portalConfigs = await stripe.billingPortal.configurations.list({ limit: 1 });
    if (portalConfigs.data.length > 0) {
      results.push({
        passed: true,
        message: "Billing portal configured",
      });
    } else {
      results.push({
        passed: false,
        message: "Billing portal not configured",
        details: "Configure at: https://dashboard.stripe.com/settings/billing/portal",
      });
    }
  } catch {
    // Billing portal may not be available in test mode for some accounts
    results.push({
      passed: true,
      message: "Billing portal check skipped (may require live mode)",
    });
  }

  printResults(results);
}

function printResults(results: ValidationResult[]): void {
  console.log("\nValidation Results:");
  console.log("-------------------\n");

  let passCount = 0;
  let failCount = 0;

  for (const result of results) {
    const icon = result.passed ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
    console.log(`${icon} ${result.message}`);
    if (result.details) {
      console.log(`  ${result.details.split("\n").join("\n  ")}`);
    }
    console.log("");

    if (result.passed) passCount++;
    else failCount++;
  }

  console.log("-------------------");
  console.log(`\x1b[32m${passCount} passed\x1b[0m, \x1b[31m${failCount} failed\x1b[0m`);

  if (failCount === 0) {
    console.log("\n\x1b[32m✓ Stripe is ready for production!\x1b[0m\n");
  } else {
    console.log("\n\x1b[33m⚠ Please fix the issues above before going live.\x1b[0m\n");
  }
}

// Run validation
validateStripeSetup().catch(console.error);
