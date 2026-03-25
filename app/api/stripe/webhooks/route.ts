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
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

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

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
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

  // Only sync invoices that originated from our CRM
  if (invoice.metadata?.source !== "forever_forward_crm") {
    console.log("[Webhook] Skipping non-CRM invoice:", invoice.id);
    return;
  }

  const adminClient = createAdminClient();
  const clientId = invoice.metadata?.client_id;
  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : (invoice.customer as Stripe.Customer | null)?.id || null;

  // Upsert invoice record to Supabase
  const { error } = await adminClient
    .from("invoices")
    .upsert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: customerId,
      client_id: clientId || null,
      number: invoice.number,
      amount: (invoice.amount_due || invoice.total || 0) / 100,
      status: "draft",
      invoice_type: (invoice.metadata?.type as "one-time" | "recurring") || "one-time",
      description: invoice.description || null,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
      metadata: invoice.metadata || null,
      created_at: new Date(invoice.created * 1000).toISOString(),
    }, {
      onConflict: "stripe_invoice_id",
    });

  if (error) {
    console.error("[Webhook] Failed to create invoice record:", error);
  } else {
    console.log("[Webhook] Invoice record created:", invoice.id);
  }
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
  console.log("[Webhook] Invoice finalized:", invoice.id);

  const adminClient = createAdminClient();

  // Update invoice to 'open' status when finalized (sent)
  const { error } = await adminClient
    .from("invoices")
    .update({
      status: "open",
      number: invoice.number,
      sent_at: new Date().toISOString(),
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
    })
    .eq("stripe_invoice_id", invoice.id);

  if (error) {
    console.error("[Webhook] Failed to update finalized invoice:", error);
  } else {
    console.log("[Webhook] Invoice marked as open:", invoice.id);
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
  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
    : new Date().toISOString();

  // Update invoice status in our database
  const { error, data: updated } = await adminClient
    .from("invoices")
    .update({
      status: "paid",
      paid_at: paidAt,
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq("stripe_invoice_id", invoice.id)
    .select("id")
    .single();

  if (error || !updated) {
    // If no existing record, create one (for invoices created outside CRM)
    const clientId = invoice.metadata?.client_id;
    const customerId = typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as Stripe.Customer | null)?.id || null;

    await adminClient.from("invoices").insert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: customerId,
      client_id: clientId || null,
      number: invoice.number,
      amount: (invoice.amount_paid || 0) / 100,
      status: "paid",
      invoice_type: (invoice.metadata?.type as "one-time" | "recurring") || "one-time",
      description: invoice.description || null,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      paid_at: paidAt,
      stripe_payment_intent_id: paymentIntentId,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
      metadata: invoice.metadata || null,
    });
    console.log("[Webhook] Created paid invoice record:", invoice.id);
  } else {
    console.log("[Webhook] Invoice marked as paid:", invoice.id);
  }

  // Log activity for audit trail
  if (invoice.metadata?.client_id) {
    try {
      await adminClient.from("activities").insert({
        activity_type: "invoice_paid",
        description: `Invoice ${invoice.number || invoice.id} paid - $${(invoice.amount_paid || 0) / 100}`,
        client_id: invoice.metadata.client_id,
        metadata: {
          invoice_id: invoice.id,
          amount: (invoice.amount_paid || 0) / 100,
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
      const customerId = typeof invoiceData.customer === "object" && invoiceData.customer
        ? invoiceData.customer.id
        : (invoiceData.customer as string);

      // Create a new donation record for this recurring payment
      await createDonation({
        donorFirstName: existingDonation.donor_first_name,
        donorLastName: existingDonation.donor_last_name,
        donorEmail: existingDonation.donor_email,
        donorPhone: existingDonation.donor_phone || undefined,
        amount: (invoice.amount_paid || 0) / 100,
        frequency: "monthly",
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        paymentStatus: "succeeded",
        source: "recurring",
        campaign: existingDonation.campaign || undefined,
        designation: existingDonation.designation || undefined,
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
