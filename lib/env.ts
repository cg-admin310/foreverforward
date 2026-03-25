/**
 * Environment Variable Validation
 * Ensures all required environment variables are set for production deployment
 */

// =============================================================================
// REQUIRED ENVIRONMENT VARIABLES
// =============================================================================

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

  // Site
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
} as const;

const optionalEnvVars = {
  // AI Services
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates that all required environment variables are set
 * Throws an error with details about missing variables
 */
export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }

  // Check for placeholder values
  if (requiredEnvVars.STRIPE_WEBHOOK_SECRET === "whsec_your_stripe_webhook_secret") {
    warnings.push("STRIPE_WEBHOOK_SECRET is still set to placeholder value");
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn("\n[ENV WARNING] Configuration issues detected:");
    warnings.forEach((w) => console.warn(`  - ${w}`));
    console.warn("");
  }

  // Throw on missing required variables
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((m) => `  - ${m}`).join("\n")}\n\n` +
        "Please check your .env.local file and ensure all required variables are set."
    );
  }
}

/**
 * Check if we're in production mode based on Stripe keys
 */
export function isStripeProduction(): boolean {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return key.startsWith("sk_live_");
}

/**
 * Check if webhook secret is configured (not placeholder)
 */
export function isWebhookConfigured(): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  return secret.startsWith("whsec_") && secret !== "whsec_your_stripe_webhook_secret";
}

/**
 * Get environment status for debugging
 */
export function getEnvStatus(): {
  mode: "test" | "production";
  webhookConfigured: boolean;
  missingOptional: string[];
} {
  const missingOptional: string[] = [];

  for (const [key, value] of Object.entries(optionalEnvVars)) {
    if (!value) {
      missingOptional.push(key);
    }
  }

  return {
    mode: isStripeProduction() ? "production" : "test",
    webhookConfigured: isWebhookConfigured(),
    missingOptional,
  };
}

// =============================================================================
// TYPED ENVIRONMENT GETTERS
// =============================================================================

export const env = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://foreverforward-xi.vercel.app",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://foreverforward-xi.vercel.app",

  // AI
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Email
  resendApiKey: process.env.RESEND_API_KEY,
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || "4ever4wardfoundation@gmail.com",
  emailFromName: process.env.EMAIL_FROM_NAME || "Forever Forward",

  // Mode checks
  isProduction: isStripeProduction(),
  isWebhookConfigured: isWebhookConfigured(),
} as const;
