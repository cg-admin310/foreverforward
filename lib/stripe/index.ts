import Stripe from "stripe";

// =============================================================================
// STRIPE CLIENT
// =============================================================================

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// =============================================================================
// TYPES
// =============================================================================

export interface CreateDonationCheckoutParams {
  amount: number; // in dollars
  frequency: "one_time" | "monthly";
  donorEmail?: string;
  donorName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateInvoiceParams {
  customerId: string;
  items: {
    description: string;
    amount: number; // in dollars
    quantity?: number;
  }[];
  dueDate?: Date;
  autoSend?: boolean;
  metadata?: Record<string, string>;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

// =============================================================================
// DONATION CHECKOUT
// =============================================================================

/**
 * Creates a Stripe Checkout session for donations
 * Supports both one-time and recurring (monthly) donations
 */
export async function createDonationCheckout(
  params: CreateDonationCheckoutParams
): Promise<{ sessionId: string; url: string }> {
  const { amount, frequency, donorEmail, donorName, successUrl, cancelUrl, metadata } = params;

  // Convert dollars to cents
  const amountInCents = Math.round(amount * 100);

  // Build line items based on frequency
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (frequency === "monthly") {
    // For recurring donations, we need to create a price dynamically
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Monthly Donation to Forever Forward",
          description: "Your recurring gift supports workforce development for Black fathers and youth in Los Angeles.",
        },
        unit_amount: amountInCents,
        recurring: {
          interval: "month",
        },
      },
      quantity: 1,
    });
  } else {
    // One-time donation
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Donation to Forever Forward",
          description: "Your gift supports workforce development for Black fathers and youth in Los Angeles.",
        },
        unit_amount: amountInCents,
      },
      quantity: 1,
    });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: frequency === "monthly" ? "subscription" : "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    // For nonprofits - allow optional tax receipts
    submit_type: frequency === "one_time" ? "donate" : undefined,
    // Collect billing address for tax receipts
    billing_address_collection: "required",
    // Allow promotional codes
    allow_promotion_codes: true,
    metadata: {
      type: "donation",
      frequency,
      amount: amount.toString(),
      ...metadata,
    },
  };

  // Add customer email if provided
  if (donorEmail) {
    sessionParams.customer_email = donorEmail;
  }

  // Add customer creation for subscriptions
  if (frequency === "monthly") {
    sessionParams.customer_creation = "always";
    sessionParams.subscription_data = {
      metadata: {
        type: "donation",
        donor_name: donorName || "",
      },
    };
  } else {
    sessionParams.payment_intent_data = {
      metadata: {
        type: "donation",
        donor_name: donorName || "",
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================

/**
 * Creates a Stripe customer for MSP clients
 */
export async function createStripeCustomer(
  params: CreateCustomerParams
): Promise<Stripe.Customer> {
  const { email, name, metadata } = params;

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      source: "forever_forward_crm",
      ...metadata,
    },
  });

  return customer;
}

/**
 * Gets or creates a Stripe customer by email
 */
export async function getOrCreateCustomer(
  email: string,
  name: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return createStripeCustomer({ email, name, metadata });
}

// =============================================================================
// INVOICE MANAGEMENT
// =============================================================================

/**
 * Creates a Stripe invoice for MSP billing
 */
export async function createInvoice(
  params: CreateInvoiceParams
): Promise<Stripe.Invoice> {
  const { customerId, items, dueDate, autoSend = false, metadata } = params;

  // Create invoice items first
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(item.amount * 100), // Convert to cents
      currency: "usd",
      description: item.description,
      quantity: item.quantity || 1,
    });
  }

  // Create the invoice
  const invoiceParams: Stripe.InvoiceCreateParams = {
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: dueDate
      ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 30,
    metadata: {
      source: "forever_forward_crm",
      ...metadata,
    },
  };

  const invoice = await stripe.invoices.create(invoiceParams);

  // Finalize the invoice (generates the PDF and invoice number)
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  // Send the invoice if requested
  if (autoSend) {
    await stripe.invoices.sendInvoice(invoice.id);
  }

  return finalizedInvoice;
}

/**
 * Sends an invoice to the customer
 */
export async function sendInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Gets an invoice by ID
 */
export async function getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.retrieve(invoiceId);
}

/**
 * Lists invoices for a customer
 */
export async function listCustomerInvoices(
  customerId: string,
  limit = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });
  return invoices.data;
}

/**
 * Voids an invoice
 */
export async function voidInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.voidInvoice(invoiceId);
}

// =============================================================================
// SUBSCRIPTION MANAGEMENT
// =============================================================================

/**
 * Cancels a subscription (for recurring donations)
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Gets a subscription
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

// =============================================================================
// PAYMENT INTENT HELPERS
// =============================================================================

/**
 * Retrieves a payment intent
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Gets a checkout session with expanded data
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer", "payment_intent", "subscription"],
  });
}

// =============================================================================
// WEBHOOK SIGNATURE VERIFICATION
// =============================================================================

/**
 * Verifies a Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
