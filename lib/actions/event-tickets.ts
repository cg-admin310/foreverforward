"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  EventTicketType,
  EventTicketTypeInsert,
  EventTicketTypeUpdate,
  EventAddon,
  EventAddonInsert,
  EventAddonUpdate,
} from "@/types/database";

// ============================================================================
// TICKET TYPES
// ============================================================================

export async function getEventTicketTypes(eventId: string): Promise<{
  success: boolean;
  data?: EventTicketType[];
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_ticket_types")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching ticket types:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getEventTicketTypes:", error);
    return { success: false, error: "Failed to fetch ticket types" };
  }
}

export async function createTicketType(
  data: EventTicketTypeInsert
): Promise<{
  success: boolean;
  data?: EventTicketType;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: ticketType, error } = await supabase
      .from("event_ticket_types")
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket type:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: ticketType };
  } catch (error) {
    console.error("Error in createTicketType:", error);
    return { success: false, error: "Failed to create ticket type" };
  }
}

export async function updateTicketType(
  id: string,
  data: EventTicketTypeUpdate
): Promise<{
  success: boolean;
  data?: EventTicketType;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: ticketType, error } = await supabase
      .from("event_ticket_types")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket type:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: ticketType };
  } catch (error) {
    console.error("Error in updateTicketType:", error);
    return { success: false, error: "Failed to update ticket type" };
  }
}

export async function deleteTicketType(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("event_ticket_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting ticket type:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteTicketType:", error);
    return { success: false, error: "Failed to delete ticket type" };
  }
}

// ============================================================================
// ADD-ONS
// ============================================================================

export async function getEventAddons(eventId: string): Promise<{
  success: boolean;
  data?: EventAddon[];
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_addons")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching addons:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getEventAddons:", error);
    return { success: false, error: "Failed to fetch addons" };
  }
}

export async function createAddon(
  data: EventAddonInsert
): Promise<{
  success: boolean;
  data?: EventAddon;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: addon, error } = await supabase
      .from("event_addons")
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error("Error creating addon:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: addon };
  } catch (error) {
    console.error("Error in createAddon:", error);
    return { success: false, error: "Failed to create addon" };
  }
}

export async function updateAddon(
  id: string,
  data: EventAddonUpdate
): Promise<{
  success: boolean;
  data?: EventAddon;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: addon, error } = await supabase
      .from("event_addons")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating addon:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: addon };
  } catch (error) {
    console.error("Error in updateAddon:", error);
    return { success: false, error: "Failed to update addon" };
  }
}

export async function deleteAddon(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("event_addons")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting addon:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteAddon:", error);
    return { success: false, error: "Failed to delete addon" };
  }
}

// ============================================================================
// TICKET TYPES WITH ADD-ONS (for event detail page)
// ============================================================================

export async function getEventTicketsAndAddons(eventId: string): Promise<{
  success: boolean;
  data?: {
    ticketTypes: EventTicketType[];
    addons: EventAddon[];
  };
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    const [ticketsResult, addonsResult] = await Promise.all([
      supabase
        .from("event_ticket_types")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("event_addons")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (ticketsResult.error) {
      console.error("Error fetching ticket types:", ticketsResult.error);
      return { success: false, error: ticketsResult.error.message };
    }

    if (addonsResult.error) {
      console.error("Error fetching addons:", addonsResult.error);
      return { success: false, error: addonsResult.error.message };
    }

    return {
      success: true,
      data: {
        ticketTypes: ticketsResult.data || [],
        addons: addonsResult.data || [],
      },
    };
  } catch (error) {
    console.error("Error in getEventTicketsAndAddons:", error);
    return { success: false, error: "Failed to fetch event tickets and addons" };
  }
}
