import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent, getCheckoutSession, stripe } from "@/lib/stripe";
import { updateDonation, createDonation } from "@/lib/actions/donations";
import { createAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// WEBHOOK CONFIGURATION
// =============================================================================

// Disable body parsing - we need the raw body for signature verification
export const runtime = "nodejs";

// =============================================================================
// POST - HANDLE STRIPE WEBHOOKS
// =============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let eventId: string | null = null;
  let eventType: string | null = null;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("[Webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Check for placeholder webhook secret
    if (webhookSecret === "whsec_your_stripe_webhook_secret") {
      console.error("[Webhook] STRIPE_WEBHOOK_SECRET is still set to placeholder value");
      return NextResponse.json(
        { error: "Webhook secret not properly configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    eventId = event.id;
    eventType = event.type;

    // Log webhook receipt for monitoring
    console.log(`[Webhook] Received: ${event.type} (${event.id})`);

    // Log to webhook_events table for audit trail
    const adminClient = createAdminClient();
    await logWebhookEvent(adminClient, {
      stripeEventId: event.id,
      eventType: event.type,
      status: "processing",
      payload: event.data.object as unknown as Record<string, unknown>,
    });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.created":
        await handleInvoiceCreated(event.data.object as Stripe.Invoice);
        break;

      case "invoice.finalized":
        await handleInvoiceFinalized(event.data.object as Stripe.Invoice);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.marked_uncollectible":
        await handleInvoiceMarkedUncollectible(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Mark webhook as completed
    const processingDuration = Date.now() - startTime;
    await updateWebhookEventStatus(adminClient, event.id, "completed", processingDuration);
    console.log(`[Webhook] Completed: ${event.type} (${event.id}) in ${processingDuration}ms`);

    return NextResponse.json({ received: true });
  } catch (error) {
    const processingDuration = Date.now() - startTime;
    console.error(`[Webhook] Handler error for ${eventType || "unknown"} (${eventId || "unknown"}):`, error);

    // Log failure if we have event info
    if (eventId) {
      try {
        const adminClient = createAdminClient();
        await updateWebhookEventStatus(adminClient, eventId, "failed", processingDuration, {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
      } catch {
        // Don't fail on logging errors
      }
    }

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout session completed:", session.id);

  const paymentType = session.metadata?.type;

  // Handle event ticket payments
  if (paymentType === "event_ticket") {
    await handleEventTicketPayment(session);
    return;
  }

  // Handle donation payments
  const donationId = session.metadata?.donation_id;

  if (!donationId) {
    console.log("No donation_id in session metadata, skipping");
    return;
  }

  // Get expanded session data
  const fullSession = await getCheckoutSession(session.id);

  // Update the donation record
  const updateData: Parameters<typeof updateDonation>[1] = {
    paymentStatus: "succeeded",
  };

  // Add Stripe IDs
  if (fullSession.payment_intent && typeof fullSession.payment_intent === "object") {
    updateData.stripePaymentIntentId = fullSession.payment_intent.id;
  } else if (typeof fullSession.payment_intent === "string") {
    updateData.stripePaymentIntentId = fullSession.payment_intent;
  }

  if (fullSession.subscription && typeof fullSession.subscription === "object") {
    updateData.stripeSubscriptionId = fullSession.subscription.id;
  } else if (typeof fullSession.subscription === "string") {
    updateData.stripeSubscriptionId = fullSession.subscription;
  }

  if (fullSession.customer && typeof fullSession.customer === "object") {
    updateData.stripeCustomerId = fullSession.customer.id;
  } else if (typeof fullSession.customer === "string") {
    updateData.stripeCustomerId = fullSession.customer;
  }

  await updateDonation(donationId, updateData);
  console.log(`Donation ${donationId} updated with payment success`);
}

async function handleEventTicketPayment(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing event ticket payment:", session.id);

  const attendeeId = session.metadata?.attendee_id;
  const eventId = session.metadata?.event_id;
  const ticketQuantity = parseInt(session.metadata?.ticket_quantity || "1", 10);

  if (!attendeeId || !eventId) {
    console.error("[Webhook] Missing attendee_id or event_id in metadata:", {
      attendeeId,
      eventId,
      sessionId: session.id,
    });
    return;
  }

  const adminClient = createAdminClient();

  // Get payment intent ID and payment method details
  let paymentIntentId: string | null = null;
  let paymentMethod: string | null = null;

  if (session.payment_intent) {
    paymentIntentId = typeof session.payment_intent === "object"
      ? session.payment_intent.id
      : session.payment_intent;

    // Retrieve payment intent with payment method expanded
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["payment_method"],
      });

      if (paymentIntent.payment_method && typeof paymentIntent.payment_method === "object") {
        const pm = paymentIntent.payment_method as Stripe.PaymentMethod;
        if (pm.card) {
          // Format: "VISA **** 4242"
          paymentMethod = `${pm.card.brand.toUpperCase()} **** ${pm.card.last4}`;
        }
      }
    } catch (error) {
      console.error("[Webhook] Failed to retrieve payment method:", error);
      // Continue without payment method - not critical
    }
  }

  // Update the attendee record with full payment details
  const { error: attendeeError } = await adminClient
    .from("event_attendees")
    .update({
      payment_status: "paid",
      stripe_payment_intent_id: paymentIntentId,
      payment_method: paymentMethod,
      payment_date: new Date().toISOString(),
    })
    .eq("id", attendeeId);

  if (attendeeError) {
    console.error("[Webhook] Failed to update attendee payment status:", attendeeError);
    return;
  }

  // Update tickets_sold count on the event
  const { data: event, error: eventFetchError } = await adminClient
    .from("events")
    .select("tickets_sold")
    .eq("id", eventId)
    .single();

  if (eventFetchError) {
    console.error("[Webhook] Failed to fetch event for ticket count update:", eventFetchError);
    return;
  }

  const { error: eventUpdateError } = await adminClient
    .from("events")
    .update({
      tickets_sold: (event.tickets_sold || 0) + ticketQuantity,
    })
    .eq("id", eventId);

  if (eventUpdateError) {
    console.error("[Webhook] Failed to update event tickets_sold:", eventUpdateError);
    return;
  }

  // Log to activities table for audit trail
  try {
    await adminClient.from("activities").insert({
      activity_type: "event_ticket_purchase",
      description: `Payment confirmed for ${ticketQuantity} ticket(s) - ${paymentMethod || "Card"}`,
      metadata: {
        event_id: eventId,
        attendee_id: attendeeId,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        payment_intent_id: paymentIntentId,
        payment_method: paymentMethod,
      },
    });
  } catch (activityError) {
    console.error("[Webhook] Failed to log activity:", activityError);
    // Non-critical, continue
  }

  console.log(`[Webhook] Event ticket payment processed: attendee=${attendeeId}, event=${eventId}, tickets=${ticketQuantity}, method=${paymentMethod}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent succeeded:", paymentIntent.id);

  const paymentType = paymentIntent.metadata?.type;

  // Handle event ticket payments
  if (paymentType === "event_ticket") {
    const attendeeId = paymentIntent.metadata?.attendee_id;
    if (attendeeId) {
      const adminClient = createAdminClient();
      await adminClient
        .from("event_attendees")
        .update({ payment_status: "paid" })
        .eq("id", attendeeId);
      console.log(`Event attendee ${attendeeId} marked as paid`);
    }
    return;
  }

  // Check if this is related to a donation
  if (paymentType !== "donation") {
    console.log("Payment intent is not a donation or event ticket, skipping");
    return;
  }

  // Update any donation with this payment intent
  const adminClient = createAdminClient();
  const { data: donation } = await adminClient
    .from("donations")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (donation) {
    await updateDonation(donation.id, { paymentStatus: "succeeded" });
    console.log(`Donation ${donation.id} marked as succeeded`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent failed:", paymentIntent.id);

  const adminClient = createAdminClient();
  const { data: donation } = await adminClient
    .from("donations")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (donation) {
    await updateDonation(donation.id, { paymentStatus: "failed" });
    console.log(`Donation ${donation.id} marked as failed`);
  }
}

async function handleInvoiceCreated(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice created:", invoice.id);

  const adminClient = createAdminClient();
  const clientId = invoice.metadata?.client_id || null;
  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : (invoice.customer as Stripe.Customer | null)?.id || null;

  // If no client_id in metadata, try to find client by Stripe customer ID
  let resolvedClientId = clientId;
  if (!resolvedClientId && customerId) {
    const { data: client } = await adminClient
      .from("msp_clients")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (client) {
      resolvedClientId = client.id;
    }
  }

  // Extract line items from Stripe invoice
  const lineItems = invoice.lines?.data?.map((item) => ({
    description: item.description || "Line item",
    amount: (item.amount || 0) / 100,
    quantity: item.quantity || 1,
    stripe_line_item_id: item.id,
  })) || [];

  // Upsert invoice record to Supabase - sync ALL invoices, not just CRM-created
  const { error, data: upserted } = await adminClient
    .from("invoices")
    .upsert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: customerId,
      client_id: resolvedClientId,
      number: invoice.number,
      amount: (invoice.amount_due || invoice.total || 0) / 100,
      status: invoice.status === "draft" ? "draft" : invoice.status || "draft",
      invoice_type: (invoice as unknown as { subscription?: string | null }).subscription ? "recurring" : "one-time",
      description: invoice.description || null,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
      line_items: lineItems,
      metadata: invoice.metadata || null,
      created_at: new Date(invoice.created * 1000).toISOString(),
    }, {
      onConflict: "stripe_invoice_id",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Webhook] Failed to create invoice record:", error);
  } else {
    console.log("[Webhook] Invoice record synced:", invoice.id);

    // Log billing event
    await logBillingEvent({
      invoiceId: upserted?.id,
      clientId: resolvedClientId,
      eventType: "created",
      description: `Invoice ${invoice.number || invoice.id} created - $${(invoice.amount_due || 0) / 100}`,
      metadata: {
        stripe_invoice_id: invoice.id,
        amount: (invoice.amount_due || 0) / 100,
        source: invoice.metadata?.source || "stripe",
      },
    });
  }
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice finalized:", invoice.id);

  const adminClient = createAdminClient();

  // Update invoice to 'open' status when finalized (sent)
  const { error, data: updated } = await adminClient
    .from("invoices")
    .update({
      status: "open",
      number: invoice.number,
      sent_at: new Date().toISOString(),
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
    })
    .eq("stripe_invoice_id", invoice.id)
    .select("id, client_id")
    .single();

  if (error) {
    console.error("[Webhook] Failed to update finalized invoice:", error);
  } else {
    console.log("[Webhook] Invoice marked as open:", invoice.id);

    // Log billing event
    await logBillingEvent({
      invoiceId: updated?.id,
      clientId: invoice.metadata?.client_id || updated?.client_id || null,
      eventType: "sent",
      description: `Invoice ${invoice.number || invoice.id} sent to customer`,
      metadata: {
        stripe_invoice_id: invoice.id,
        amount: (invoice.amount_due || 0) / 100,
        hosted_invoice_url: invoice.hosted_invoice_url,
      },
    });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice paid:", invoice.id);

  const adminClient = createAdminClient();

  // Get payment intent ID - might be string or object
  const paymentIntentId = typeof (invoice as { payment_intent?: string | { id: string } }).payment_intent === "object"
    ? ((invoice as { payment_intent?: { id: string } }).payment_intent?.id || null)
    : ((invoice as { payment_intent?: string }).payment_intent || null);

  // Calculate paid_at timestamp
  const paidAtTimestamp = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000)
    : new Date();
  const paidAt = paidAtTimestamp.toISOString();

  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : (invoice.customer as Stripe.Customer | null)?.id || null;

  // Try to find client by Stripe customer ID if not in metadata
  let clientId = invoice.metadata?.client_id || null;
  if (!clientId && customerId) {
    const { data: client } = await adminClient
      .from("msp_clients")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (client) {
      clientId = client.id;
    }
  }

  // Update invoice status in our database
  const { error, data: updated } = await adminClient
    .from("invoices")
    .update({
      status: "paid",
      paid_at: paidAt,
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq("stripe_invoice_id", invoice.id)
    .select("id, client_id")
    .single();

  let invoiceRecordId = updated?.id;
  const resolvedClientId = clientId || updated?.client_id;

  if (error || !updated) {
    // If no existing record, create one (for invoices created outside CRM)
    const { data: inserted } = await adminClient.from("invoices").insert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: customerId,
      client_id: clientId,
      number: invoice.number,
      amount: (invoice.amount_paid || 0) / 100,
      status: "paid",
      invoice_type: (invoice as unknown as { subscription?: string | null }).subscription ? "recurring" : "one-time",
      description: invoice.description || null,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      paid_at: paidAt,
      stripe_payment_intent_id: paymentIntentId,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
      metadata: invoice.metadata || null,
    }).select("id").single();

    invoiceRecordId = inserted?.id;
    console.log("[Webhook] Created paid invoice record:", invoice.id);
  } else {
    console.log("[Webhook] Invoice marked as paid:", invoice.id);
  }

  const amountPaid = (invoice.amount_paid || 0) / 100;

  // Update revenue history
  await updateRevenueHistory({
    amount: amountPaid,
    paidAt: paidAtTimestamp,
    source: "billing",
  });

  // Log billing event
  await logBillingEvent({
    invoiceId: invoiceRecordId,
    clientId: resolvedClientId,
    eventType: "paid",
    description: `Invoice ${invoice.number || invoice.id} paid - $${amountPaid}`,
    metadata: {
      stripe_invoice_id: invoice.id,
      amount: amountPaid,
      payment_intent_id: paymentIntentId,
    },
  });

  // Log activity for audit trail
  if (resolvedClientId) {
    try {
      await adminClient.from("activities").insert({
        activity_type: "invoice_paid",
        description: `Invoice ${invoice.number || invoice.id} paid - $${amountPaid}`,
        client_id: resolvedClientId,
        metadata: {
          invoice_id: invoice.id,
          amount: amountPaid,
          payment_intent_id: paymentIntentId,
        },
      });
    } catch (activityError) {
      console.error("[Webhook] Failed to log invoice activity:", activityError);
    }
  }

  // Handle recurring donation payments
  const invoiceData = invoice as unknown as { subscription?: string | { id: string }; customer?: string | { id: string } };
  if (invoiceData.subscription) {
    const subscriptionId = typeof invoiceData.subscription === "object"
      ? invoiceData.subscription.id
      : invoiceData.subscription;

    const { data: existingDonation } = await adminClient
      .from("donations")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .single();

    if (existingDonation) {
      const donorCustomerId = typeof invoiceData.customer === "object" && invoiceData.customer
        ? invoiceData.customer.id
        : (invoiceData.customer as string);

      // Create a new donation record for this recurring payment
      await createDonation({
        donorFirstName: existingDonation.donor_first_name,
        donorLastName: existingDonation.donor_last_name,
        donorEmail: existingDonation.donor_email,
        donorPhone: existingDonation.donor_phone || undefined,
        amount: amountPaid,
        frequency: "monthly",
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: donorCustomerId,
        paymentStatus: "succeeded",
        source: "recurring",
        campaign: existingDonation.campaign || undefined,
        designation: existingDonation.designation || undefined,
      });

      // Update donation revenue history
      await updateRevenueHistory({
        amount: amountPaid,
        paidAt: paidAtTimestamp,
        source: "donations",
      });

      console.log("[Webhook] Created new donation record for recurring payment");
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice payment failed:", invoice.id);

  const adminClient = createAdminClient();

  // Update invoice status
  const { error } = await adminClient
    .from("invoices")
    .update({
      status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_invoice_id", invoice.id);

  if (error) {
    console.error("[Webhook] Failed to update invoice status:", error);
  }

  // Log activity for audit trail
  if (invoice.metadata?.client_id) {
    try {
      await adminClient.from("activities").insert({
        activity_type: "invoice_payment_failed",
        description: `Invoice ${invoice.number || invoice.id} payment failed`,
        client_id: invoice.metadata.client_id,
        metadata: {
          invoice_id: invoice.id,
          amount: (invoice.amount_due || 0) / 100,
        },
      });
    } catch (activityError) {
      console.error("[Webhook] Failed to log activity:", activityError);
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id);

  // Update donation with subscription ID if applicable
  if (subscription.metadata?.type === "donation") {
    const adminClient = createAdminClient();
    const { data: donation } = await adminClient
      .from("donations")
      .select("id")
      .eq("stripe_customer_id", subscription.customer as string)
      .eq("frequency", "monthly")
      .is("stripe_subscription_id", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (donation) {
      await updateDonation(donation.id, {
        stripeSubscriptionId: subscription.id,
      });
      console.log(`Donation ${donation.id} updated with subscription ID`);
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id, "Status:", subscription.status);

  // Handle subscription status changes
  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    const adminClient = createAdminClient();
    await adminClient
      .from("donations")
      .update({ payment_status: subscription.status })
      .eq("stripe_subscription_id", subscription.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);

  const adminClient = createAdminClient();
  await adminClient
    .from("donations")
    .update({ payment_status: "cancelled" })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleInvoiceMarkedUncollectible(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice marked uncollectible:", invoice.id);

  const adminClient = createAdminClient();

  // Update invoice status
  const { error, data: updated } = await adminClient
    .from("invoices")
    .update({
      status: "uncollectible",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_invoice_id", invoice.id)
    .select("id, client_id")
    .single();

  if (error) {
    console.error("[Webhook] Failed to update uncollectible invoice:", error);
    return;
  }

  // Log billing event
  await logBillingEvent({
    invoiceId: updated?.id,
    clientId: invoice.metadata?.client_id || updated?.client_id || null,
    eventType: "voided",
    description: `Invoice ${invoice.number || invoice.id} marked as uncollectible`,
    metadata: {
      stripe_invoice_id: invoice.id,
      amount: (invoice.amount_due || 0) / 100,
    },
  });

  // Log activity for audit trail
  if (invoice.metadata?.client_id || updated?.client_id) {
    const clientId = invoice.metadata?.client_id || updated?.client_id;
    try {
      await adminClient.from("activities").insert({
        activity_type: "invoice_uncollectible",
        description: `Invoice ${invoice.number || invoice.id} marked uncollectible - $${(invoice.amount_due || 0) / 100}`,
        client_id: clientId,
        metadata: {
          invoice_id: invoice.id,
          amount: (invoice.amount_due || 0) / 100,
        },
      });
    } catch (activityError) {
      console.error("[Webhook] Failed to log activity:", activityError);
    }
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Log a billing event for audit trail
 */
async function logBillingEvent(params: {
  invoiceId?: string | null;
  clientId?: string | null;
  eventType: string;
  description: string;
  metadata?: Record<string, unknown>;
  performedBy?: string;
}) {
  const adminClient = createAdminClient();

  try {
    await adminClient.from("billing_events").insert({
      invoice_id: params.invoiceId || null,
      client_id: params.clientId || null,
      event_type: params.eventType,
      description: params.description,
      metadata: params.metadata || null,
      performed_by: params.performedBy || null,
    });
  } catch (error) {
    console.error("[Webhook] Failed to log billing event:", error);
  }
}

/**
 * Update revenue history when an invoice is paid
 */
async function updateRevenueHistory(params: {
  amount: number;
  paidAt: Date;
  source?: string;
}) {
  const adminClient = createAdminClient();
  const monthYear = params.paidAt.toISOString().slice(0, 7); // 'YYYY-MM' format

  try {
    // Upsert to revenue_history
    const { error } = await adminClient.rpc("upsert_revenue_history", {
      p_source: params.source || "billing",
      p_month_year: monthYear,
      p_total_amount: params.amount,
      p_collected_amount: params.amount,
    });

    if (error) {
      // Fallback to manual upsert if RPC doesn't exist
      const { data: existing } = await adminClient
        .from("revenue_history")
        .select("*")
        .eq("source", params.source || "billing")
        .eq("month_year", monthYear)
        .single();

      if (existing) {
        await adminClient
          .from("revenue_history")
          .update({
            collected_amount: (existing.collected_amount || 0) + params.amount,
            total_amount: (existing.total_amount || 0) + params.amount,
            record_count: (existing.record_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await adminClient.from("revenue_history").insert({
          source: params.source || "billing",
          month_year: monthYear,
          total_amount: params.amount,
          collected_amount: params.amount,
          outstanding_amount: 0,
          record_count: 1,
        });
      }
    }

    console.log(`[Webhook] Updated revenue history for ${monthYear}: +$${params.amount}`);
  } catch (error) {
    console.error("[Webhook] Failed to update revenue history:", error);
  }
}

/**
 * Log a webhook event for monitoring and debugging
 */
async function logWebhookEvent(
  adminClient: ReturnType<typeof createAdminClient>,
  params: {
    stripeEventId: string;
    eventType: string;
    status: "received" | "processing" | "completed" | "failed";
    payload?: Record<string, unknown>;
    stripeInvoiceId?: string;
    stripeCustomerId?: string;
    stripePaymentIntentId?: string;
  }
) {
  try {
    // Extract IDs from payload if not provided
    const payload = params.payload || {};
    const stripeInvoiceId = params.stripeInvoiceId || (payload.id as string) || null;
    const stripeCustomerId = params.stripeCustomerId ||
      (typeof payload.customer === "string" ? payload.customer : (payload.customer as { id?: string })?.id) ||
      null;
    const stripePaymentIntentId = params.stripePaymentIntentId ||
      (typeof payload.payment_intent === "string" ? payload.payment_intent : (payload.payment_intent as { id?: string })?.id) ||
      null;

    await adminClient.from("webhook_events").upsert({
      stripe_event_id: params.stripeEventId,
      event_type: params.eventType,
      status: params.status,
      stripe_invoice_id: params.eventType.startsWith("invoice.") ? stripeInvoiceId : null,
      stripe_customer_id: stripeCustomerId,
      stripe_payment_intent_id: stripePaymentIntentId,
      payload: params.payload || null,
      processing_started_at: params.status === "processing" ? new Date().toISOString() : undefined,
    }, {
      onConflict: "stripe_event_id",
    });
  } catch (error) {
    console.error("[Webhook] Failed to log webhook event:", error);
    // Don't throw - logging failures shouldn't break webhook processing
  }
}

/**
 * Update webhook event status after processing
 */
async function updateWebhookEventStatus(
  adminClient: ReturnType<typeof createAdminClient>,
  stripeEventId: string,
  status: "completed" | "failed",
  durationMs: number,
  errorDetails?: { message: string; stack?: string }
) {
  try {
    await adminClient
      .from("webhook_events")
      .update({
        status,
        processing_completed_at: new Date().toISOString(),
        processing_duration_ms: durationMs,
        error_message: errorDetails?.message || null,
        error_details: errorDetails || null,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_event_id", stripeEventId);
  } catch (error) {
    console.error("[Webhook] Failed to update webhook event status:", error);
  }
}
