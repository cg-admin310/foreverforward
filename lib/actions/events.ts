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
// GET EVENT BY ID (Admin)
// ============================================================================

export async function getEventById(id: string): Promise<ActionResult<Event>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getEventById:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

// ============================================================================
// DELETE EVENT (Admin)
// ============================================================================

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/events-admin");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    return { success: false, error: "Failed to delete event" };
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
  short_description?: string;
  capacity?: number;
  ticket_price?: number;
  is_published?: boolean;
  featured_image_url?: string;
  movie_title?: string;
  food_pairing?: string;
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

// ============================================================================
// GET EVENTS STATS (Admin)
// ============================================================================

export async function getEventsStats(): Promise<ActionResult<{
  upcoming: number;
  totalRegistered: number;
  totalRevenue: number;
  avgAttendance: number;
}>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    // Get all events
    const { data: events, error } = await supabase
      .from("events")
      .select("*");

    if (error) {
      console.error("Error fetching events stats:", error);
      return { success: false, error: error.message };
    }

    const upcomingCount = events?.filter(
      (e) => !e.is_cancelled && new Date(e.start_datetime) >= new Date(now)
    ).length || 0;

    const totalRegistered = events?.reduce((sum, e) => sum + (e.tickets_sold || 0), 0) || 0;

    // Calculate revenue (ticket_price * tickets_sold for paid events)
    const totalRevenue = events?.reduce((sum, e) => {
      if (e.ticket_price && e.tickets_sold) {
        return sum + (e.ticket_price * e.tickets_sold);
      }
      return sum;
    }, 0) || 0;

    // Calculate average attendance rate for past events
    const pastEvents = events?.filter(
      (e) => !e.is_cancelled && new Date(e.start_datetime) < new Date(now) && e.capacity
    ) || [];

    let avgAttendance = 0;
    if (pastEvents.length > 0) {
      const totalAttendanceRate = pastEvents.reduce((sum, e) => {
        return sum + ((e.tickets_sold || 0) / (e.capacity || 1)) * 100;
      }, 0);
      avgAttendance = Math.round(totalAttendanceRate / pastEvents.length);
    }

    return {
      success: true,
      data: {
        upcoming: upcomingCount,
        totalRegistered,
        totalRevenue,
        avgAttendance,
      },
    };
  } catch (error) {
    console.error("Error in getEventsStats:", error);
    return { success: false, error: "Failed to fetch events stats" };
  }
}

// ============================================================================
// GET EVENTS FOR ADMIN (with enhanced data)
// ============================================================================

export interface AdminEventDisplay {
  id: string;
  title: string;
  event_type: string;
  start_datetime: string;
  end_datetime: string | null;
  venue_name: string | null;
  is_virtual: boolean | null;
  virtual_link: string | null;
  capacity: number | null;
  tickets_sold: number | null;
  ticket_price: number | null;
  is_published: boolean | null;
  is_cancelled: boolean | null;
  status: "upcoming" | "live" | "completed" | "cancelled";
  revenue: number;
}

export async function getAdminEventsDisplay(): Promise<ActionResult<AdminEventDisplay[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_datetime", { ascending: false });

    if (error) {
      console.error("Error fetching admin events:", error);
      return { success: false, error: error.message };
    }

    const eventsDisplay: AdminEventDisplay[] = (data || []).map((e) => {
      const startDate = new Date(e.start_datetime);
      const endDate = e.end_datetime ? new Date(e.end_datetime) : null;

      let status: AdminEventDisplay["status"];
      if (e.is_cancelled) {
        status = "cancelled";
      } else if (startDate > now) {
        status = "upcoming";
      } else if (endDate && now < endDate) {
        status = "live";
      } else if (!endDate && startDate.toDateString() === now.toDateString()) {
        status = "live";
      } else {
        status = "completed";
      }

      return {
        id: e.id,
        title: e.title,
        event_type: e.event_type,
        start_datetime: e.start_datetime,
        end_datetime: e.end_datetime,
        venue_name: e.venue_name,
        is_virtual: e.is_virtual,
        virtual_link: e.virtual_link,
        capacity: e.capacity,
        tickets_sold: e.tickets_sold,
        ticket_price: e.ticket_price,
        is_published: e.is_published,
        is_cancelled: e.is_cancelled,
        status,
        revenue: (e.ticket_price || 0) * (e.tickets_sold || 0),
      };
    });

    return { success: true, data: eventsDisplay };
  } catch (error) {
    console.error("Error in getAdminEventsDisplay:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}
