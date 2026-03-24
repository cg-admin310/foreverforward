import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructWebhookEvent, getCheckoutSession } from "@/lib/stripe";
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
  console.log("Processing event ticket payment:", session.id);

  const attendeeId = session.metadata?.attendee_id;
  const eventId = session.metadata?.event_id;
  const ticketQuantity = parseInt(session.metadata?.ticket_quantity || "1", 10);

  if (!attendeeId || !eventId) {
    console.error("Missing attendee_id or event_id in event ticket session metadata");
    return;
  }

  const adminClient = createAdminClient();

  // Get payment intent ID
  let paymentIntentId: string | null = null;
  if (session.payment_intent) {
    paymentIntentId = typeof session.payment_intent === "object"
      ? session.payment_intent.id
      : session.payment_intent;
  }

  // Update the attendee record with payment success
  const { error: attendeeError } = await adminClient
    .from("event_attendees")
    .update({
      payment_status: "paid",
      stripe_payment_intent_id: paymentIntentId,
    })
    .eq("id", attendeeId);

  if (attendeeError) {
    console.error("Failed to update attendee payment status:", attendeeError);
    return;
  }

  // Update tickets_sold count on the event
  const { data: event, error: eventFetchError } = await adminClient
    .from("events")
    .select("tickets_sold")
    .eq("id", eventId)
    .single();

  if (eventFetchError) {
    console.error("Failed to fetch event for ticket count update:", eventFetchError);
    return;
  }

  const { error: eventUpdateError } = await adminClient
    .from("events")
    .update({
      tickets_sold: (event.tickets_sold || 0) + ticketQuantity,
    })
    .eq("id", eventId);

  if (eventUpdateError) {
    console.error("Failed to update event tickets_sold:", eventUpdateError);
    return;
  }

  console.log(`Event ticket payment processed: attendee ${attendeeId}, event ${eventId}, ${ticketQuantity} tickets`);
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

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("Invoice paid:", invoice.id);

  // Handle MSP billing invoices
  if (invoice.metadata?.source === "forever_forward_crm") {
    const adminClient = createAdminClient();

    // Get payment intent ID - might be string or object
    const paymentIntentId = typeof (invoice as { payment_intent?: string | { id: string } }).payment_intent === "object"
      ? ((invoice as { payment_intent?: { id: string } }).payment_intent?.id || null)
      : ((invoice as { payment_intent?: string }).payment_intent || null);

    // Update invoice status in our database if we're tracking it
    const { error } = await adminClient
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: paymentIntentId,
      })
      .eq("stripe_invoice_id", invoice.id);

    if (error) {
      console.log("No matching invoice found in database:", invoice.id);
    } else {
      console.log("Invoice marked as paid:", invoice.id);
    }
  }

  // Handle recurring donation payments
  // Use type assertion as Stripe types may vary
  const invoiceData = invoice as unknown as { subscription?: string | { id: string }; customer?: string | { id: string } };
  if (invoiceData.subscription) {
    const adminClient = createAdminClient();
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
        amount: (invoice.amount_paid || 0) / 100, // Convert from cents
        frequency: "monthly",
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        paymentStatus: "succeeded",
        source: "recurring",
        campaign: existingDonation.campaign || undefined,
        designation: existingDonation.designation || undefined,
      });
      console.log("Created new donation record for recurring payment");
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Invoice payment failed:", invoice.id);

  // Update invoice status
  const adminClient = createAdminClient();
  await adminClient
    .from("invoices")
    .update({ status: "failed" })
    .eq("stripe_invoice_id", invoice.id);
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
