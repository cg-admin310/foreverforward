"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event, EventAttendee, EventTicketType, EventAddon } from "@/types/database";

// ============================================================================
// EXTENDED EVENT TYPE (with ticket types and add-ons)
// ============================================================================

export interface EventWithDetails extends Event {
  ticket_types?: EventTicketType[];
  addons?: EventAddon[];
}

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
  ActionResult<{ featured: EventWithDetails | null; upcoming: EventWithDetails[]; past: EventWithDetails[] }>
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

    // Get ticket types and add-ons for all events
    const eventIds = events?.map(e => e.id) || [];

    let ticketTypes: EventTicketType[] = [];
    let addons: EventAddon[] = [];

    if (eventIds.length > 0) {
      const [ticketTypesResult, addonsResult] = await Promise.all([
        adminClient
          .from("event_ticket_types")
          .select("*")
          .in("event_id", eventIds)
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        adminClient
          .from("event_addons")
          .select("*")
          .in("event_id", eventIds)
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);

      ticketTypes = ticketTypesResult.data || [];
      addons = addonsResult.data || [];
    }

    // Attach ticket types and add-ons to events
    const eventsWithDetails: EventWithDetails[] = (events || []).map(event => ({
      ...event,
      ticket_types: ticketTypes.filter(tt => tt.event_id === event.id),
      addons: addons.filter(a => a.event_id === event.id),
    }));

    // Separate into featured, upcoming, and past
    const upcoming = eventsWithDetails.filter((e) => new Date(e.start_datetime) >= new Date(now));
    const past = eventsWithDetails.filter((e) => new Date(e.start_datetime) < new Date(now));

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
// GET SINGLE EVENT WITH DETAILS (Public)
// ============================================================================

export async function getEventWithDetails(slug: string): Promise<ActionResult<EventWithDetails>> {
  try {
    const adminClient = createAdminClient();

    const { data: event, error } = await adminClient
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error.message };
    }

    // Fetch ticket types and add-ons
    const [ticketTypesResult, addonsResult] = await Promise.all([
      adminClient
        .from("event_ticket_types")
        .select("*")
        .eq("event_id", event.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      adminClient
        .from("event_addons")
        .select("*")
        .eq("event_id", event.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const eventWithDetails: EventWithDetails = {
      ...event,
      ticket_types: ticketTypesResult.data || [],
      addons: addonsResult.data || [],
    };

    return { success: true, data: eventWithDetails };
  } catch (error) {
    console.error("Error in getEventWithDetails:", error);
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
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_virtual?: boolean;
  virtual_link?: string;
  description?: string;
  short_description?: string;
  capacity?: number;
  ticket_price?: number;
  is_free?: boolean;
  is_published?: boolean;
  is_featured?: boolean;
  featured_image_url?: string;
  movie_title?: string;
  movie_description?: string;
  food_pairing?: string;
  gallery_urls?: string[];
  timezone?: string;
}): Promise<ActionResult<Event>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Determine is_free based on ticket_price if not explicitly set
    const isFree = eventData.is_free !== undefined
      ? eventData.is_free
      : !eventData.ticket_price || eventData.ticket_price === 0;

    const { data, error } = await supabase
      .from("events")
      .insert({
        ...eventData,
        is_free: isFree,
        is_cancelled: false,
        tickets_sold: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/events-admin");
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

// ============================================================================
// LIVE EVENT DASHBOARD STATS
// ============================================================================

export interface LiveEventDashboard {
  event: Event;
  totalRegistered: number;
  totalTickets: number;
  totalGuests: number;
  checkedInCount: number;
  guestsCheckedIn: number;
  walkUps: number;
  vipCount: number;
  donorCount: number;
  checkInRate: number;
  spotsRemaining: number | null;
  recentActivity: CheckInLogEntry[];
}

export interface CheckInLogEntry {
  id: string;
  action: string;
  attendee_name: string;
  method: string | null;
  notes: string | null;
  created_at: string;
}

export async function getLiveEventDashboard(
  eventId: string
): Promise<ActionResult<LiveEventDashboard>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return { success: false, error: "Event not found" };
    }

    // Get attendees with enhanced fields
    const { data: attendees, error: attendeesError } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .neq("status", "cancelled");

    if (attendeesError) {
      console.error("Error fetching attendees:", attendeesError);
      return { success: false, error: attendeesError.message };
    }

    // Calculate stats
    const totalRegistered = attendees?.length || 0;
    const totalTickets = attendees?.reduce((sum, a) => sum + (a.ticket_quantity || 1), 0) || 0;
    const totalGuests = attendees?.reduce((sum, a) => sum + (a.guests_count || 0), 0) || 0;
    const checkedInCount = attendees?.filter(a => a.checked_in).length || 0;
    const guestsCheckedIn = attendees?.reduce((sum, a) => sum + (a.guests_checked_in || 0), 0) || 0;
    const walkUps = attendees?.filter(a => a.is_walk_up).length || 0;
    const vipCount = attendees?.filter(a => a.is_vip).length || 0;
    const donorCount = attendees?.filter(a => a.is_donor).length || 0;
    const checkInRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 100) : 0;
    const spotsRemaining = event.capacity ? Math.max(0, event.capacity - totalTickets - totalGuests) : null;

    // Get recent activity log
    const { data: logEntries, error: logError } = await supabase
      .from("event_checkin_log")
      .select("*, event_attendees(first_name, last_name)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(20);

    const recentActivity: CheckInLogEntry[] = (logEntries || []).map(entry => ({
      id: entry.id,
      action: entry.action,
      attendee_name: entry.event_attendees
        ? `${entry.event_attendees.first_name} ${entry.event_attendees.last_name}`
        : "Unknown",
      method: entry.method,
      notes: entry.notes,
      created_at: entry.created_at,
    }));

    return {
      success: true,
      data: {
        event,
        totalRegistered,
        totalTickets,
        totalGuests,
        checkedInCount,
        guestsCheckedIn,
        walkUps,
        vipCount,
        donorCount,
        checkInRate,
        spotsRemaining,
        recentActivity,
      },
    };
  } catch (error) {
    console.error("Error in getLiveEventDashboard:", error);
    return { success: false, error: "Failed to fetch live event data" };
  }
}

// ============================================================================
// CHECK-IN ATTENDEE
// ============================================================================

export async function checkInAttendee(
  attendeeId: string,
  options?: {
    method?: "qr_scan" | "manual" | "pre_registered" | "walk_up";
    checkedInBy?: string;
    notes?: string;
  }
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        check_in_method: options?.method || "manual",
        checked_in_by: options?.checkedInBy || null,
        check_in_notes: options?.notes || null,
      })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error checking in attendee:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in checkInAttendee:", error);
    return { success: false, error: "Failed to check in attendee" };
  }
}

// ============================================================================
// CHECK-OUT ATTENDEE
// ============================================================================

export async function checkOutAttendee(
  attendeeId: string
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    // First get current attendee data
    const { data: attendee, error: fetchError } = await supabase
      .from("event_attendees")
      .select("*, event_id")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    // Update attendee
    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        checked_in: false,
        checked_in_at: null,
      })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error checking out attendee:", error);
      return { success: false, error: error.message };
    }

    // Log the checkout
    await supabase.from("event_checkin_log").insert({
      event_id: attendee.event_id,
      attendee_id: attendeeId,
      action: "check_out",
    });

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in checkOutAttendee:", error);
    return { success: false, error: "Failed to check out attendee" };
  }
}

// ============================================================================
// WALK-UP REGISTRATION
// ============================================================================

export async function walkUpRegistration(
  eventId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    ticketQuantity?: number;
    guestsCount?: number;
    guestNames?: string[];
    tableNumber?: string;
    paymentMethod?: string;
    amountPaid?: number;
    notes?: string;
  }
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Check event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return { success: false, error: "Event not found" };
    }

    // Create walk-up attendee (already checked in)
    const { data: attendee, error } = await supabase
      .from("event_attendees")
      .insert({
        event_id: eventId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        ticket_quantity: data.ticketQuantity || 1,
        guests_count: data.guestsCount || 0,
        guest_names: data.guestNames || null,
        party_size: 1 + (data.guestsCount || 0),
        table_number: data.tableNumber || null,
        total_paid: data.amountPaid || 0,
        status: "registered",
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        check_in_method: "walk_up",
        is_walk_up: true,
        registration_source: "walk_up",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating walk-up registration:", error);
      return { success: false, error: error.message };
    }

    // Log the walk-up registration
    await supabase.from("event_checkin_log").insert({
      event_id: eventId,
      attendee_id: attendee.id,
      action: "walk_up_register",
      method: "walk_up",
      metadata: {
        guests_count: data.guestsCount || 0,
        payment_amount: data.amountPaid || 0,
        payment_method: data.paymentMethod || "none",
      },
    });

    // If payment was collected, log it
    if (data.amountPaid && data.amountPaid > 0) {
      await supabase.from("event_checkin_log").insert({
        event_id: eventId,
        attendee_id: attendee.id,
        action: "payment_received",
        metadata: {
          payment_amount: data.amountPaid,
          payment_method: data.paymentMethod || "cash",
        },
      });
    }

    // Update tickets sold on event
    await supabase
      .from("events")
      .update({
        tickets_sold: (event.tickets_sold || 0) + (data.ticketQuantity || 1),
      })
      .eq("id", eventId);

    revalidatePath("/events-admin");
    return { success: true, data: attendee };
  } catch (error) {
    console.error("Error in walkUpRegistration:", error);
    return { success: false, error: "Failed to register walk-up" };
  }
}

// ============================================================================
// CHECK-IN GUEST
// ============================================================================

export async function checkInGuest(
  attendeeId: string,
  guestIndex: number,
  guestName?: string
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current attendee
    const { data: attendee, error: fetchError } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    const newGuestsCheckedIn = (attendee.guests_checked_in || 0) + 1;

    // Update attendee
    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        guests_checked_in: newGuestsCheckedIn,
      })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error checking in guest:", error);
      return { success: false, error: error.message };
    }

    // Log the guest check-in
    await supabase.from("event_checkin_log").insert({
      event_id: attendee.event_id,
      attendee_id: attendeeId,
      action: "guest_check_in",
      metadata: {
        guest_name: guestName || `Guest ${guestIndex + 1}`,
        guest_index: guestIndex,
      },
    });

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in checkInGuest:", error);
    return { success: false, error: "Failed to check in guest" };
  }
}

// ============================================================================
// UPDATE TABLE ASSIGNMENT
// ============================================================================

export async function updateTableAssignment(
  attendeeId: string,
  tableNumber: string | null,
  seatAssignment?: string
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current attendee for logging
    const { data: attendee, error: fetchError } = await supabase
      .from("event_attendees")
      .select("*, event_id, table_number")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    // Update attendee
    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        table_number: tableNumber,
        seat_assignment: seatAssignment || null,
      })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error updating table assignment:", error);
      return { success: false, error: error.message };
    }

    // Log the table assignment change
    if (tableNumber !== attendee.table_number) {
      await supabase.from("event_checkin_log").insert({
        event_id: attendee.event_id,
        attendee_id: attendeeId,
        action: "table_assign",
        metadata: {
          old_table: attendee.table_number,
          new_table: tableNumber,
          seat: seatAssignment,
        },
      });
    }

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateTableAssignment:", error);
    return { success: false, error: "Failed to update table assignment" };
  }
}

// ============================================================================
// MARK VIP
// ============================================================================

export async function markAttendeeVIP(
  attendeeId: string,
  isVip: boolean
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: attendee, error: fetchError } = await supabase
      .from("event_attendees")
      .select("*, event_id")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    const { data, error } = await supabase
      .from("event_attendees")
      .update({ is_vip: isVip })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error updating VIP status:", error);
      return { success: false, error: error.message };
    }

    // Log VIP upgrade
    if (isVip && !attendee.is_vip) {
      await supabase.from("event_checkin_log").insert({
        event_id: attendee.event_id,
        attendee_id: attendeeId,
        action: "vip_upgrade",
      });
    }

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in markAttendeeVIP:", error);
    return { success: false, error: "Failed to update VIP status" };
  }
}

// ============================================================================
// PRINT BADGE
// ============================================================================

export async function markBadgePrinted(
  attendeeId: string
): Promise<ActionResult<EventAttendee>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        badge_printed: true,
        badge_printed_at: new Date().toISOString(),
      })
      .eq("id", attendeeId)
      .select()
      .single();

    if (error) {
      console.error("Error marking badge printed:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/events-admin");
    return { success: true, data };
  } catch (error) {
    console.error("Error in markBadgePrinted:", error);
    return { success: false, error: "Failed to mark badge printed" };
  }
}

// ============================================================================
// GET EVENT TABLES
// ============================================================================

export interface EventTableWithOccupancy {
  id: string;
  table_number: string;
  table_name: string | null;
  capacity: number;
  seats_filled: number;
  section: string | null;
  is_vip: boolean;
  is_reserved: boolean;
  reserved_for: string | null;
  is_full: boolean;
  attendees: { id: string; name: string; is_vip: boolean }[];
}

export async function getEventTables(
  eventId: string
): Promise<ActionResult<EventTableWithOccupancy[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get tables
    const { data: tables, error: tablesError } = await supabase
      .from("event_tables")
      .select("*")
      .eq("event_id", eventId)
      .order("table_number", { ascending: true });

    if (tablesError) {
      console.error("Error fetching tables:", tablesError);
      return { success: false, error: tablesError.message };
    }

    // Get attendees with table assignments
    const { data: attendees, error: attendeesError } = await supabase
      .from("event_attendees")
      .select("id, first_name, last_name, table_number, is_vip")
      .eq("event_id", eventId)
      .not("table_number", "is", null)
      .eq("checked_in", true);

    if (attendeesError) {
      console.error("Error fetching attendees:", attendeesError);
    }

    // Map attendees to tables
    const tablesWithOccupancy: EventTableWithOccupancy[] = (tables || []).map(table => {
      const tableAttendees = (attendees || [])
        .filter(a => a.table_number === table.table_number)
        .map(a => ({
          id: a.id,
          name: `${a.first_name} ${a.last_name}`,
          is_vip: a.is_vip || false,
        }));

      return {
        ...table,
        seats_filled: tableAttendees.length,
        is_full: tableAttendees.length >= (table.capacity || 8),
        attendees: tableAttendees,
      };
    });

    return { success: true, data: tablesWithOccupancy };
  } catch (error) {
    console.error("Error in getEventTables:", error);
    return { success: false, error: "Failed to fetch tables" };
  }
}

// ============================================================================
// CREATE EVENT TABLE
// ============================================================================

export async function createEventTable(
  eventId: string,
  data: {
    tableNumber: string;
    tableName?: string;
    capacity?: number;
    section?: string;
    isVip?: boolean;
    isReserved?: boolean;
    reservedFor?: string;
  }
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: table, error } = await supabase
      .from("event_tables")
      .insert({
        event_id: eventId,
        table_number: data.tableNumber,
        table_name: data.tableName || null,
        capacity: data.capacity || 8,
        section: data.section || null,
        is_vip: data.isVip || false,
        is_reserved: data.isReserved || false,
        reserved_for: data.reservedFor || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating table:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/events-admin");
    return { success: true, data: { id: table.id } };
  } catch (error) {
    console.error("Error in createEventTable:", error);
    return { success: false, error: "Failed to create table" };
  }
}

// ============================================================================
// GET CHECK-IN LOG
// ============================================================================

export async function getCheckInLog(
  eventId: string,
  options?: { limit?: number; action?: string }
): Promise<ActionResult<CheckInLogEntry[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("event_checkin_log")
      .select("*, event_attendees(first_name, last_name)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (options?.action) {
      query = query.eq("action", options.action);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching check-in log:", error);
      return { success: false, error: error.message };
    }

    const logEntries: CheckInLogEntry[] = (data || []).map(entry => ({
      id: entry.id,
      action: entry.action,
      attendee_name: entry.event_attendees
        ? `${entry.event_attendees.first_name} ${entry.event_attendees.last_name}`
        : "Unknown",
      method: entry.method,
      notes: entry.notes,
      created_at: entry.created_at,
    }));

    return { success: true, data: logEntries };
  } catch (error) {
    console.error("Error in getCheckInLog:", error);
    return { success: false, error: "Failed to fetch check-in log" };
  }
}

// ============================================================================
// SEARCH ATTENDEES (for check-in)
// ============================================================================

export async function searchEventAttendees(
  eventId: string,
  query: string
): Promise<ActionResult<EventAttendee[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const searchTerm = `%${query.toLowerCase()}%`;

    const { data, error } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .neq("status", "cancelled")
      .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
      .order("last_name", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Error searching attendees:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in searchEventAttendees:", error);
    return { success: false, error: "Failed to search attendees" };
  }
}
