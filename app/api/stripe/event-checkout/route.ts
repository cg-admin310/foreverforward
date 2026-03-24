import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createEventTicketCheckout, createEventCheckoutWithLineItems } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const ticketSelectionSchema = z.object({
  ticketTypeId: z.string(),
  quantity: z.number().min(1).max(10),
});

const addonSelectionSchema = z.object({
  addonId: z.string(),
  quantity: z.number().min(1).max(10),
});

const eventCheckoutSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  ticketQuantity: z.number().min(1, "At least 1 ticket required").max(50, "Maximum 50 tickets per order"),
  ticketSelections: z.array(ticketSelectionSchema).optional(),
  addonSelections: z.array(addonSelectionSchema).optional(),
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

// =============================================================================
// TYPES
// =============================================================================

interface LineItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  itemType: "ticket" | "addon";
  itemId: string;
}

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
      ticketSelections,
      addonSelections,
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
    if (event.capacity) {
      const availableTickets = event.capacity - (event.tickets_sold || 0);
      if (ticketQuantity > availableTickets) {
        return NextResponse.json(
          { error: `Only ${availableTickets} tickets remaining` },
          { status: 400 }
        );
      }
    }

    // Build line items and calculate total
    const lineItems: LineItem[] = [];
    let totalAmount = 0;
    let isFreeEvent = true;

    // Check if we have ticket type selections
    if (ticketSelections && ticketSelections.length > 0) {
      // Fetch ticket types for this event
      const ticketTypeIds = ticketSelections.map(s => s.ticketTypeId);
      const { data: ticketTypes, error: ticketTypesError } = await supabase
        .from("event_ticket_types")
        .select("*")
        .in("id", ticketTypeIds)
        .eq("event_id", eventId)
        .eq("is_active", true);

      if (ticketTypesError) {
        console.error("Error fetching ticket types:", ticketTypesError);
        return NextResponse.json(
          { error: "Failed to validate ticket types" },
          { status: 500 }
        );
      }

      // Validate each ticket selection
      for (const selection of ticketSelections) {
        const ticketType = ticketTypes?.find(tt => tt.id === selection.ticketTypeId);
        if (!ticketType) {
          return NextResponse.json(
            { error: "Invalid ticket type selected" },
            { status: 400 }
          );
        }

        // Check availability
        if (ticketType.quantity_available !== null) {
          const available = ticketType.quantity_available - (ticketType.quantity_sold || 0);
          if (selection.quantity > available) {
            return NextResponse.json(
              { error: `Only ${available} "${ticketType.name}" tickets remaining` },
              { status: 400 }
            );
          }
        }

        // Check max per order
        if (selection.quantity > ticketType.max_per_order) {
          return NextResponse.json(
            { error: `Maximum ${ticketType.max_per_order} "${ticketType.name}" tickets per order` },
            { status: 400 }
          );
        }

        const lineTotal = ticketType.price * selection.quantity;
        totalAmount += lineTotal;
        if (ticketType.price > 0) isFreeEvent = false;

        lineItems.push({
          name: `${event.title} - ${ticketType.name}`,
          description: ticketType.description || undefined,
          price: ticketType.price,
          quantity: selection.quantity,
          itemType: "ticket",
          itemId: ticketType.id,
        });
      }
    } else {
      // Legacy mode: use event's ticket_price
      const ticketPrice = event.is_free ? 0 : (event.ticket_price || 0);
      totalAmount = ticketPrice * ticketQuantity;
      if (ticketPrice > 0) isFreeEvent = false;

      lineItems.push({
        name: `${event.title} - General Admission`,
        price: ticketPrice,
        quantity: ticketQuantity,
        itemType: "ticket",
        itemId: "general",
      });
    }

    // Process add-on selections
    if (addonSelections && addonSelections.length > 0) {
      const addonIds = addonSelections.map(s => s.addonId);
      const { data: addons, error: addonsError } = await supabase
        .from("event_addons")
        .select("*")
        .in("id", addonIds)
        .eq("event_id", eventId)
        .eq("is_active", true);

      if (addonsError) {
        console.error("Error fetching addons:", addonsError);
        return NextResponse.json(
          { error: "Failed to validate add-ons" },
          { status: 500 }
        );
      }

      for (const selection of addonSelections) {
        const addon = addons?.find(a => a.id === selection.addonId);
        if (!addon) {
          return NextResponse.json(
            { error: "Invalid add-on selected" },
            { status: 400 }
          );
        }

        // Check availability
        if (addon.quantity_available !== null) {
          const available = addon.quantity_available - (addon.quantity_sold || 0);
          if (selection.quantity > available) {
            return NextResponse.json(
              { error: `Only ${available} "${addon.name}" remaining` },
              { status: 400 }
            );
          }
        }

        // Check max per order
        if (selection.quantity > addon.max_per_order) {
          return NextResponse.json(
            { error: `Maximum ${addon.max_per_order} "${addon.name}" per order` },
            { status: 400 }
          );
        }

        const lineTotal = addon.price * selection.quantity;
        totalAmount += lineTotal;
        if (addon.price > 0) isFreeEvent = false;

        lineItems.push({
          name: addon.name,
          description: addon.description || undefined,
          price: addon.price,
          quantity: selection.quantity,
          itemType: "addon",
          itemId: addon.id,
        });
      }
    }

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
        ticket_type: ticketSelections?.length ? "multiple" : "general",
        total_paid: totalAmount,
        payment_status: isFreeEvent && totalAmount === 0 ? "paid" : "pending",
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

    // Create order items for tracking
    const orderItems = lineItems.map(item => ({
      attendee_id: attendee.id,
      item_type: item.itemType,
      ticket_type_id: item.itemType === "ticket" && item.itemId !== "general" ? item.itemId : null,
      addon_id: item.itemType === "addon" ? item.itemId : null,
      item_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    if (orderItems.length > 0) {
      const { error: orderItemsError } = await supabase
        .from("event_order_items")
        .insert(orderItems);

      if (orderItemsError) {
        console.error("Failed to create order items:", orderItemsError);
        // Don't fail the whole request, just log it
      }
    }

    // If the event is free (total is 0), just update tickets_sold and return success
    if (isFreeEvent && totalAmount === 0) {
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

    // Create Stripe checkout session
    // If we have multiple line items, use the new function
    if (lineItems.length > 1 || (lineItems.length === 1 && lineItems[0].itemId !== "general")) {
      const { sessionId, url } = await createEventCheckoutWithLineItems({
        eventId,
        eventTitle: event.title,
        lineItems: lineItems.map(item => ({
          name: item.name,
          description: item.description,
          unitAmount: Math.round(item.price * 100), // Convert to cents
          quantity: item.quantity,
        })),
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        attendeeId: attendee.id,
        totalTickets: ticketQuantity,
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
    }

    // Legacy: single line item checkout
    const ticketPrice = event.is_free ? 0 : (event.ticket_price || 0);
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
