"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event, EventAttendee } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// GET PUBLISHED EVENTS (Public)
// ============================================================================

export async function getPublishedEvents(): Promise<
  ActionResult<{ featured: Event | null; upcoming: Event[]; past: Event[] }>
> {
  try {
    const adminClient = createAdminClient();
    const now = new Date().toISOString();

    // Get all published, non-cancelled events
    const { data: events, error } = await adminClient
      .from("events")
      .select("*")
      .eq("is_published", true)
      .eq("is_cancelled", false)
      .order("start_datetime", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message };
    }

    // Separate into featured, upcoming, and past
    const upcoming = events?.filter((e) => new Date(e.start_datetime) >= new Date(now)) || [];
    const past = events?.filter((e) => new Date(e.start_datetime) < new Date(now)) || [];

    // Featured is the soonest upcoming event, or most recent if none upcoming
    const featured = upcoming.length > 0 ? upcoming[0] : past.length > 0 ? past[0] : null;

    // Remove featured from upcoming list
    const upcomingFiltered = featured ? upcoming.filter((e) => e.id !== featured.id) : upcoming;

    return {
      success: true,
      data: {
        featured,
        upcoming: upcomingFiltered,
        past: past.slice(0, 5), // Last 5 past events
      },
    };
  } catch (error) {
    console.error("Error in getPublishedEvents:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

// ============================================================================
// GET SINGLE EVENT (Public)
// ============================================================================

export async function getEvent(slug: string): Promise<ActionResult<Event>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getEvent:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

// ============================================================================
// REGISTER FOR EVENT (Public)
// ============================================================================

export async function registerForEvent(
  eventId: string,
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    ticketCount?: number;
  }
): Promise<ActionResult<EventAttendee>> {
  try {
    const adminClient = createAdminClient();

    // Check event exists and has capacity
    const { data: event, error: eventError } = await adminClient
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return { success: false, error: "Event not found" };
    }

    if (event.is_cancelled) {
      return { success: false, error: "This event has been cancelled" };
    }

    // Check capacity if set
    if (event.capacity) {
      const { count } = await adminClient
        .from("event_attendees")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .neq("status", "cancelled");

      if (count && count >= event.capacity) {
        return { success: false, error: "This event is at capacity" };
      }
    }

    // Register attendee
    const { data, error } = await adminClient
      .from("event_attendees")
      .insert({
        event_id: eventId,
        first_name: attendee.firstName,
        last_name: attendee.lastName,
        email: attendee.email,
        phone: attendee.phone || null,
        ticket_count: attendee.ticketCount || 1,
        status: "registered",
      })
      .select()
      .single();

    if (error) {
      console.error("Error registering for event:", error);
      return { success: false, error: error.message };
    }

    // Update tickets sold count on event
    await adminClient
      .from("events")
      .update({ tickets_sold: (event.tickets_sold || 0) + (attendee.ticketCount || 1) })
      .eq("id", eventId);

    revalidatePath("/events");
    return { success: true, data };
  } catch (error) {
    console.error("Error in registerForEvent:", error);
    return { success: false, error: "Failed to register for event" };
  }
}

// ============================================================================
// GET ALL EVENTS (Admin)
// ============================================================================

export async function getAdminEvents(options?: {
  type?: string;
  status?: "upcoming" | "past" | "cancelled";
  limit?: number;
}): Promise<ActionResult<Event[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("events")
      .select("*")
      .order("start_datetime", { ascending: false });

    if (options?.type) {
      query = query.eq("event_type", options.type);
    }

    if (options?.status === "cancelled") {
      query = query.eq("is_cancelled", true);
    } else if (options?.status === "upcoming") {
      query = query
        .eq("is_cancelled", false)
        .gte("start_datetime", new Date().toISOString());
    } else if (options?.status === "past") {
      query = query
        .eq("is_cancelled", false)
        .lt("start_datetime", new Date().toISOString());
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching admin events:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getAdminEvents:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

// ============================================================================
// CREATE EVENT (Admin)
// ============================================================================

export async function createEvent(eventData: {
  title: string;
  slug: string;
  event_type: string;
  start_datetime: string;
  end_datetime?: string;
  venue_name?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  description?: string;
  capacity?: number;
  ticket_price?: number;
  is_published?: boolean;
}): Promise<ActionResult<Event>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("events")
      .insert({
        ...eventData,
        is_cancelled: false,
        tickets_sold: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/events-admin");
    revalidatePath("/events");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createEvent:", error);
    return { success: false, error: "Failed to create event" };
  }
}

// ============================================================================
// UPDATE EVENT (Admin)
// ============================================================================

export async function updateEvent(
  id: string,
  updates: Partial<Event>
): Promise<ActionResult<Event>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/events-admin");
    revalidatePath("/events");
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateEvent:", error);
    return { success: false, error: "Failed to update event" };
  }
}

// ============================================================================
// GET EVENT ATTENDEES (Admin)
// ============================================================================

export async function getEventAttendees(
  eventId: string
): Promise<ActionResult<EventAttendee[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching attendees:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getEventAttendees:", error);
    return { success: false, error: "Failed to fetch attendees" };
  }
}
