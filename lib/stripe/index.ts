import Stripe from "stripe";

// =============================================================================
// STRIPE CLIENT
// =============================================================================

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
// EVENT TICKET CHECKOUT
// =============================================================================

export interface EventTicketCheckoutParams {
  eventId: string;
  eventTitle: string;
  ticketPrice: number; // in dollars
  ticketQuantity: number;
  customerEmail?: string;
  customerName?: string;
  attendeeId: string; // Pre-created attendee record ID
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Creates a Stripe Checkout session for event ticket purchases
 */
export async function createEventTicketCheckout(
  params: EventTicketCheckoutParams
): Promise<{ sessionId: string; url: string }> {
  const {
    eventId,
    eventTitle,
    ticketPrice,
    ticketQuantity,
    customerEmail,
    customerName,
    attendeeId,
    successUrl,
    cancelUrl,
    metadata,
  } = params;

  // Convert dollars to cents
  const amountInCents = Math.round(ticketPrice * 100);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Ticket: ${eventTitle}`,
          description: `Event ticket for ${eventTitle}`,
        },
        unit_amount: amountInCents,
      },
      quantity: ticketQuantity,
    },
  ];

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "required",
    metadata: {
      type: "event_ticket",
      event_id: eventId,
      attendee_id: attendeeId,
      ticket_quantity: ticketQuantity.toString(),
      ...metadata,
    },
    payment_intent_data: {
      metadata: {
        type: "event_ticket",
        event_id: eventId,
        attendee_id: attendeeId,
        customer_name: customerName || "",
      },
    },
  };

  if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create event ticket checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

// =============================================================================
// EVENT CHECKOUT WITH LINE ITEMS (Multiple ticket types and add-ons)
// =============================================================================

export interface EventCheckoutLineItem {
  name: string;
  description?: string;
  unitAmount: number; // in cents
  quantity: number;
}

export interface EventCheckoutWithLineItemsParams {
  eventId: string;
  eventTitle: string;
  lineItems: EventCheckoutLineItem[];
  customerEmail?: string;
  customerName?: string;
  attendeeId: string;
  totalTickets: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Creates a Stripe Checkout session for event purchases with multiple line items
 * (ticket types and add-ons)
 */
export async function createEventCheckoutWithLineItems(
  params: EventCheckoutWithLineItemsParams
): Promise<{ sessionId: string; url: string }> {
  const {
    eventId,
    eventTitle,
    lineItems,
    customerEmail,
    customerName,
    attendeeId,
    totalTickets,
    successUrl,
    cancelUrl,
    metadata,
  } = params;

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lineItems.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        description: item.description,
      },
      unit_amount: item.unitAmount,
    },
    quantity: item.quantity,
  }));

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: stripeLineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "required",
    metadata: {
      type: "event_ticket",
      event_id: eventId,
      attendee_id: attendeeId,
      ticket_quantity: totalTickets.toString(),
      ...metadata,
    },
    payment_intent_data: {
      metadata: {
        type: "event_ticket",
        event_id: eventId,
        attendee_id: attendeeId,
        ticket_quantity: totalTickets.toString(),
        customer_name: customerName || "",
      },
    },
  };

  if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create event checkout session URL");
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
    // Validate amount is a positive number
    const amount = Number(item.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid amount: ${item.amount}`);
    }

    // When using amount, don't specify quantity (Stripe doesn't allow both)
    // If quantity > 1, multiply the amount
    const totalAmount = Math.round(amount * 100) * (item.quantity || 1);
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: totalAmount,
      currency: "usd",
      description: item.quantity && item.quantity > 1
        ? `${item.description} (x${item.quantity})`
        : item.description,
    });
  }

  // Calculate days until due (minimum 1 day, default 30)
  let daysUntilDue = 30;
  if (dueDate) {
    const calculatedDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    daysUntilDue = Math.max(1, calculatedDays); // Stripe requires at least 1 day
  }

  // Create the invoice
  const invoiceParams: Stripe.InvoiceCreateParams = {
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: daysUntilDue,
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
// BILLING PORTAL
// =============================================================================

/**
 * Creates a billing portal session for customer self-service
 * Allows customers to view/pay invoices and manage payment methods
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const { customerId, returnUrl } = params;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return { url: session.url };
}

// =============================================================================
// RECURRING INVOICE SUBSCRIPTIONS
// =============================================================================

export interface CreateRecurringInvoiceParams {
  customerId: string;
  monthlyAmount: number; // in dollars
  description: string;
  clientId: string;
  dayOfMonth?: number; // 1-28, billing anchor day
}

/**
 * Creates a subscription for recurring invoice generation
 * Uses collection_method: 'send_invoice' so invoices are sent, not auto-charged
 */
export async function createRecurringInvoiceSchedule(
  params: CreateRecurringInvoiceParams
): Promise<Stripe.Subscription> {
  const { customerId, monthlyAmount, description, clientId, dayOfMonth } = params;

  // Create a price for this specific amount
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: Math.round(monthlyAmount * 100),
    recurring: { interval: "month" },
    product_data: {
      name: "Forever Forward IT Services",
      metadata: {
        client_id: clientId,
        source: "forever_forward_crm",
      },
    },
    metadata: {
      client_id: clientId,
      source: "forever_forward_crm",
    },
  });

  // Create subscription with invoice collection method
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ price: price.id }],
    collection_method: "send_invoice",
    days_until_due: 30,
    metadata: {
      client_id: clientId,
      type: "recurring_msp",
      source: "forever_forward_crm",
      description,
    },
  };

  // Set billing cycle anchor if day specified
  if (dayOfMonth && dayOfMonth >= 1 && dayOfMonth <= 28) {
    // Calculate next billing date
    const now = new Date();
    let billingDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    if (billingDate <= now) {
      billingDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
    }
    subscriptionParams.billing_cycle_anchor = Math.floor(billingDate.getTime() / 1000);
    subscriptionParams.proration_behavior = "none";
  }

  return stripe.subscriptions.create(subscriptionParams);
}

/**
 * Cancels a recurring invoice subscription
 */
export async function cancelRecurringInvoiceSchedule(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Updates the amount on a recurring subscription
 */
export async function updateRecurringInvoiceAmount(params: {
  subscriptionId: string;
  newMonthlyAmount: number;
  clientId: string;
}): Promise<Stripe.Subscription> {
  const { subscriptionId, newMonthlyAmount, clientId } = params;

  // Get the current subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const currentItem = subscription.items.data[0];

  // Create a new price for the new amount
  const newPrice = await stripe.prices.create({
    currency: "usd",
    unit_amount: Math.round(newMonthlyAmount * 100),
    recurring: { interval: "month" },
    product_data: {
      name: "Forever Forward IT Services",
      metadata: {
        client_id: clientId,
        source: "forever_forward_crm",
      },
    },
  });

  // Update the subscription with the new price
  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: currentItem.id,
        price: newPrice.id,
      },
    ],
    proration_behavior: "none",
  });
}

// =============================================================================
// INVOICE EDITING (Draft Invoices Only)
// =============================================================================

/**
 * Adds a line item to a draft invoice
 * Only works for invoices in 'draft' status
 */
export async function addInvoiceItem(params: {
  invoiceId: string;
  description: string;
  amount: number; // in dollars
  quantity?: number;
}): Promise<Stripe.InvoiceItem> {
  const { invoiceId, description, amount, quantity = 1 } = params;

  // Get the invoice to find the customer
  const invoice = await stripe.invoices.retrieve(invoiceId);

  if (invoice.status !== "draft") {
    throw new Error("Can only add items to draft invoices");
  }

  // When using amount, don't specify quantity (Stripe doesn't allow both)
  const totalAmount = Math.round(amount * 100) * quantity;
  return stripe.invoiceItems.create({
    customer: invoice.customer as string,
    invoice: invoiceId,
    amount: totalAmount,
    currency: "usd",
    description: quantity > 1 ? `${description} (x${quantity})` : description,
  });
}

/**
 * Removes a line item from a draft invoice
 */
export async function deleteInvoiceItem(invoiceItemId: string): Promise<void> {
  await stripe.invoiceItems.del(invoiceItemId);
}

/**
 * Updates a draft invoice's due date or description
 */
export async function updateDraftInvoice(params: {
  invoiceId: string;
  dueDate?: Date;
  description?: string;
}): Promise<Stripe.Invoice> {
  const { invoiceId, dueDate, description } = params;

  const invoice = await stripe.invoices.retrieve(invoiceId);

  if (invoice.status !== "draft") {
    throw new Error("Can only update draft invoices");
  }

  const updateParams: Stripe.InvoiceUpdateParams = {};

  if (dueDate) {
    updateParams.due_date = Math.floor(dueDate.getTime() / 1000);
  }

  if (description) {
    updateParams.description = description;
  }

  return stripe.invoices.update(invoiceId, updateParams);
}

/**
 * Gets all line items for an invoice
 */
export async function getInvoiceLineItems(
  invoiceId: string
): Promise<Stripe.InvoiceLineItem[]> {
  const lines = await stripe.invoices.listLineItems(invoiceId);
  return lines.data;
}

// =============================================================================
// INVOICE REMINDERS
// =============================================================================

/**
 * Sends a reminder for an open invoice
 * Note: Stripe automatically handles some reminders based on settings
 */
export async function sendInvoiceReminder(invoiceId: string): Promise<void> {
  // Retrieve the invoice to get customer info
  const invoice = await stripe.invoices.retrieve(invoiceId, {
    expand: ["customer"],
  });

  if (invoice.status !== "open") {
    throw new Error("Can only send reminders for open invoices");
  }

  // Send the invoice again (this sends a reminder email)
  await stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Marks an invoice as uncollectible (bad debt)
 */
export async function markInvoiceUncollectible(
  invoiceId: string
): Promise<Stripe.Invoice> {
  return stripe.invoices.markUncollectible(invoiceId);
}

// =============================================================================
// LIST ALL INVOICES
// =============================================================================

/**
 * Lists all invoices with pagination support
 * Useful for syncing to database
 */
export async function listAllInvoices(params?: {
  limit?: number;
  startingAfter?: string;
  status?: "draft" | "open" | "paid" | "uncollectible" | "void";
  createdAfter?: Date;
}): Promise<{ invoices: Stripe.Invoice[]; hasMore: boolean; lastId?: string }> {
  const { limit = 100, startingAfter, status, createdAfter } = params || {};

  const listParams: Stripe.InvoiceListParams = {
    limit,
  };

  if (startingAfter) {
    listParams.starting_after = startingAfter;
  }

  if (status) {
    listParams.status = status;
  }

  if (createdAfter) {
    listParams.created = {
      gte: Math.floor(createdAfter.getTime() / 1000),
    };
  }

  const response = await stripe.invoices.list(listParams);

  return {
    invoices: response.data,
    hasMore: response.has_more,
    lastId: response.data.length > 0 ? response.data[response.data.length - 1].id : undefined,
  };
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
