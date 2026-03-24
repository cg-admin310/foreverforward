import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createEventTicketCheckout } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const eventCheckoutSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  ticketQuantity: z.number().min(1, "At least 1 ticket required").max(10, "Maximum 10 tickets per order"),
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

// =============================================================================
// POST - CREATE EVENT TICKET CHECKOUT SESSION
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = eventCheckoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      eventId,
      firstName,
      lastName,
      email,
      phone,
      ticketQuantity,
      dietaryRestrictions,
      accessibilityNeeds,
    } = validationResult.data;

    const supabase = createAdminClient();

    // Fetch the event to verify it exists and get details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, slug, ticket_price, is_free, capacity, tickets_sold, is_published, is_cancelled, start_datetime")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Verify event is still available
    if (!event.is_published) {
      return NextResponse.json(
        { error: "This event is not currently available" },
        { status: 400 }
      );
    }

    if (event.is_cancelled) {
      return NextResponse.json(
        { error: "This event has been cancelled" },
        { status: 400 }
      );
    }

    // Check if event has already passed
    if (new Date(event.start_datetime) < new Date()) {
      return NextResponse.json(
        { error: "This event has already occurred" },
        { status: 400 }
      );
    }

    // Check capacity
    const availableTickets = event.capacity - (event.tickets_sold || 0);
    if (ticketQuantity > availableTickets) {
      return NextResponse.json(
        { error: `Only ${availableTickets} tickets remaining` },
        { status: 400 }
      );
    }

    const ticketPrice = event.is_free ? 0 : (event.ticket_price || 0);
    const totalAmount = ticketPrice * ticketQuantity;

    // Create a pending attendee record
    const { data: attendee, error: attendeeError } = await supabase
      .from("event_attendees")
      .insert({
        event_id: eventId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        ticket_quantity: ticketQuantity,
        ticket_type: "general",
        total_paid: totalAmount,
        payment_status: event.is_free ? "paid" : "pending",
        dietary_restrictions: dietaryRestrictions || null,
        accessibility_needs: accessibilityNeeds || null,
      })
      .select()
      .single();

    if (attendeeError || !attendee) {
      console.error("Failed to create attendee record:", attendeeError);
      return NextResponse.json(
        { error: "Failed to register for event" },
        { status: 500 }
      );
    }

    // If the event is free, just update tickets_sold and return success
    if (event.is_free) {
      await supabase
        .from("events")
        .update({ tickets_sold: (event.tickets_sold || 0) + ticketQuantity })
        .eq("id", eventId);

      return NextResponse.json({
        success: true,
        isFree: true,
        attendeeId: attendee.id,
        message: "Successfully registered for free event",
      });
    }

    // Get the site URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create Stripe checkout session for paid events
    const { sessionId, url } = await createEventTicketCheckout({
      eventId,
      eventTitle: event.title,
      ticketPrice,
      ticketQuantity,
      customerEmail: email,
      customerName: `${firstName} ${lastName}`,
      attendeeId: attendee.id,
      successUrl: `${siteUrl}/events/success?session_id={CHECKOUT_SESSION_ID}&attendee_id=${attendee.id}`,
      cancelUrl: `${siteUrl}/events?cancelled=true`,
      metadata: {
        event_slug: event.slug,
      },
    });

    return NextResponse.json({
      success: true,
      isFree: false,
      sessionId,
      url,
      attendeeId: attendee.id,
    });
  } catch (error) {
    console.error("Error creating event checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
