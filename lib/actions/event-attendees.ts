"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { EventAttendee, EventOrderItem, PaymentStatus } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EventAttendeeWithOrder extends EventAttendee {
  order_items: EventOrderItem[];
  event?: {
    id: string;
    title: string;
    start_datetime: string;
  };
}

export interface AttendeeStats {
  total: number;
  checkedIn: number;
  pending: number;
  paid: number;
  refunded: number;
  totalRevenue: number;
}

// ============================================================================
// GET ATTENDEES WITH DETAILS
// ============================================================================

export async function getEventAttendeesWithDetails(
  eventId: string
): Promise<ActionResult<EventAttendeeWithOrder[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch attendees
    const { data: attendees, error: attendeesError } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (attendeesError) {
      console.error("Error fetching attendees:", attendeesError);
      return { success: false, error: attendeesError.message };
    }

    // Fetch order items for all attendees
    const attendeeIds = attendees?.map((a) => a.id) || [];
    let orderItems: EventOrderItem[] = [];

    if (attendeeIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from("event_order_items")
        .select("*")
        .in("attendee_id", attendeeIds);

      if (!itemsError && items) {
        orderItems = items;
      }
    }

    // Combine attendees with their order items
    const attendeesWithOrders: EventAttendeeWithOrder[] = (attendees || []).map(
      (attendee) => ({
        ...attendee,
        order_items: orderItems.filter((item) => item.attendee_id === attendee.id),
      })
    );

    return { success: true, data: attendeesWithOrders };
  } catch (error) {
    console.error("Error in getEventAttendeesWithDetails:", error);
    return { success: false, error: "Failed to fetch attendees" };
  }
}

// ============================================================================
// GET SINGLE ATTENDEE WITH ORDER DETAILS
// ============================================================================

export async function getAttendeeWithOrderDetails(
  attendeeId: string
): Promise<ActionResult<EventAttendeeWithOrder>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch attendee with event info
    const { data: attendee, error: attendeeError } = await supabase
      .from("event_attendees")
      .select(`
        *,
        events:event_id (
          id,
          title,
          start_datetime
        )
      `)
      .eq("id", attendeeId)
      .single();

    if (attendeeError) {
      console.error("Error fetching attendee:", attendeeError);
      return { success: false, error: attendeeError.message };
    }

    // Fetch order items
    const { data: orderItems } = await supabase
      .from("event_order_items")
      .select("*")
      .eq("attendee_id", attendeeId);

    const attendeeWithOrder: EventAttendeeWithOrder = {
      ...attendee,
      event: attendee.events as EventAttendeeWithOrder["event"],
      order_items: orderItems || [],
    };

    return { success: true, data: attendeeWithOrder };
  } catch (error) {
    console.error("Error in getAttendeeWithOrderDetails:", error);
    return { success: false, error: "Failed to fetch attendee" };
  }
}

// ============================================================================
// GET ATTENDEE STATS
// ============================================================================

export async function getAttendeeStats(
  eventId: string
): Promise<ActionResult<AttendeeStats>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: attendees, error } = await supabase
      .from("event_attendees")
      .select("payment_status, total_paid, checked_in")
      .eq("event_id", eventId);

    if (error) {
      return { success: false, error: error.message };
    }

    const stats: AttendeeStats = {
      total: attendees?.length || 0,
      checkedIn: attendees?.filter((a) => a.checked_in).length || 0,
      pending: attendees?.filter((a) => a.payment_status === "pending").length || 0,
      paid: attendees?.filter((a) => a.payment_status === "paid").length || 0,
      refunded: attendees?.filter((a) => a.payment_status === "refunded").length || 0,
      totalRevenue: attendees?.reduce((sum, a) => {
        if (a.payment_status === "paid" && a.total_paid) {
          return sum + a.total_paid;
        }
        return sum;
      }, 0) || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getAttendeeStats:", error);
    return { success: false, error: "Failed to get stats" };
  }
}

// ============================================================================
// CHECK IN ATTENDEE
// ============================================================================

export async function checkInAttendee(
  attendeeId: string
): Promise<ActionResult<{ checked_in_at: string }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        checked_in: true,
        checked_in_at: now,
        checked_out_at: null, // Clear check-out when checking in
      })
      .eq("id", attendeeId)
      .select("event_id, checked_in_at")
      .single();

    if (error) {
      console.error("Error checking in attendee:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/events-admin/${data.event_id}/attendees`);
    revalidatePath(`/events-admin/${data.event_id}`);
    return { success: true, data: { checked_in_at: data.checked_in_at } };
  } catch (error) {
    console.error("Error in checkInAttendee:", error);
    return { success: false, error: "Failed to check in attendee" };
  }
}

// ============================================================================
// CHECK OUT ATTENDEE
// ============================================================================

export async function checkOutAttendee(
  attendeeId: string
): Promise<ActionResult<{ checked_out_at: string }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        checked_out_at: now,
      })
      .eq("id", attendeeId)
      .select("event_id, checked_out_at")
      .single();

    if (error) {
      console.error("Error checking out attendee:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/events-admin/${data.event_id}/attendees`);
    return { success: true, data: { checked_out_at: data.checked_out_at } };
  } catch (error) {
    console.error("Error in checkOutAttendee:", error);
    return { success: false, error: "Failed to check out attendee" };
  }
}

// ============================================================================
// UNDO CHECK IN
// ============================================================================

export async function undoCheckIn(attendeeId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({
        checked_in: false,
        checked_in_at: null,
        checked_out_at: null,
      })
      .eq("id", attendeeId)
      .select("event_id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/events-admin/${data.event_id}/attendees`);
    return { success: true };
  } catch (error) {
    console.error("Error in undoCheckIn:", error);
    return { success: false, error: "Failed to undo check-in" };
  }
}

// ============================================================================
// CHECK IN BY QR CODE
// ============================================================================

export async function checkInByQRCode(
  qrToken: string
): Promise<ActionResult<{ attendeeId: string; name: string; eventTitle: string; alreadyCheckedIn: boolean }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    // Find attendee by QR token
    const { data: attendee, error: findError } = await supabase
      .from("event_attendees")
      .select(`
        id,
        first_name,
        last_name,
        event_id,
        checked_in,
        payment_status,
        events:event_id (title)
      `)
      .eq("qr_code_token", qrToken)
      .single();

    if (findError || !attendee) {
      return { success: false, error: "Invalid QR code - attendee not found" };
    }

    // Check if payment is complete for paid events
    if (attendee.payment_status === "pending") {
      return { success: false, error: "Payment not completed - cannot check in" };
    }

    // If already checked in, return info but don't update
    if (attendee.checked_in) {
      return {
        success: true,
        data: {
          attendeeId: attendee.id,
          name: `${attendee.first_name} ${attendee.last_name}`,
          eventTitle: (attendee.events as { title: string })?.title || "Event",
          alreadyCheckedIn: true,
        },
      };
    }

    // Update check-in status
    const { error: updateError } = await supabase
      .from("event_attendees")
      .update({
        checked_in: true,
        checked_in_at: now,
      })
      .eq("id", attendee.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath(`/events-admin/${attendee.event_id}/attendees`);

    return {
      success: true,
      data: {
        attendeeId: attendee.id,
        name: `${attendee.first_name} ${attendee.last_name}`,
        eventTitle: (attendee.events as { title: string })?.title || "Event",
        alreadyCheckedIn: false,
      },
    };
  } catch (error) {
    console.error("Error in checkInByQRCode:", error);
    return { success: false, error: "Failed to process QR code" };
  }
}

// ============================================================================
// UPDATE PAYMENT NOTES
// ============================================================================

export async function updatePaymentNotes(
  attendeeId: string,
  notes: string
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("event_attendees")
      .update({ payment_notes: notes || null })
      .eq("id", attendeeId)
      .select("event_id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/events-admin/${data.event_id}/attendees`);
    return { success: true };
  } catch (error) {
    console.error("Error in updatePaymentNotes:", error);
    return { success: false, error: "Failed to update payment notes" };
  }
}

// ============================================================================
// UPDATE PAYMENT STATUS (Manual override)
// ============================================================================

export async function updatePaymentStatus(
  attendeeId: string,
  status: PaymentStatus
): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
      payment_status: status,
    };

    // If marking as paid manually, set payment date
    if (status === "paid") {
      updateData.payment_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("event_attendees")
      .update(updateData)
      .eq("id", attendeeId)
      .select("event_id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/events-admin/${data.event_id}/attendees`);
    return { success: true };
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

// ============================================================================
// PROCESS FULL REFUND
// ============================================================================

export async function processFullRefund(
  attendeeId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Get attendee with payment intent
    const { data: attendee, error: fetchError } = await adminClient
      .from("event_attendees")
      .select("stripe_payment_intent_id, total_paid, event_id, payment_status")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    if (attendee.payment_status === "refunded") {
      return { success: false, error: "This attendee has already been refunded" };
    }

    if (!attendee.stripe_payment_intent_id) {
      return { success: false, error: "No payment found for this attendee" };
    }

    if (!attendee.total_paid || attendee.total_paid <= 0) {
      return { success: false, error: "No amount to refund" };
    }

    // Process Stripe refund
    try {
      await stripe.refunds.create({
        payment_intent: attendee.stripe_payment_intent_id,
        reason: "requested_by_customer",
      });
    } catch (stripeError) {
      console.error("Stripe refund error:", stripeError);
      return { success: false, error: "Failed to process refund with Stripe" };
    }

    // Update attendee record
    const { error: updateError } = await adminClient
      .from("event_attendees")
      .update({
        payment_status: "refunded",
        refund_amount: attendee.total_paid,
        refund_reason: reason,
        refunded_at: new Date().toISOString(),
      })
      .eq("id", attendeeId);

    if (updateError) {
      console.error("Error updating attendee after refund:", updateError);
      return { success: false, error: "Refund processed but failed to update record" };
    }

    revalidatePath(`/events-admin/${attendee.event_id}/attendees`);
    revalidatePath(`/events-admin/${attendee.event_id}`);
    return { success: true };
  } catch (error) {
    console.error("Error in processFullRefund:", error);
    return { success: false, error: "Failed to process refund" };
  }
}

// ============================================================================
// DELETE ATTENDEE
// ============================================================================

export async function deleteAttendee(attendeeId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get event_id first for revalidation
    const { data: attendee, error: fetchError } = await supabase
      .from("event_attendees")
      .select("event_id, payment_status, stripe_payment_intent_id")
      .eq("id", attendeeId)
      .single();

    if (fetchError || !attendee) {
      return { success: false, error: "Attendee not found" };
    }

    // Prevent deletion if paid and not refunded
    if (attendee.payment_status === "paid" && attendee.stripe_payment_intent_id) {
      return {
        success: false,
        error: "Cannot delete paid attendee. Please refund first."
      };
    }

    // Delete order items first
    await supabase
      .from("event_order_items")
      .delete()
      .eq("attendee_id", attendeeId);

    // Delete attendee
    const { error: deleteError } = await supabase
      .from("event_attendees")
      .delete()
      .eq("id", attendeeId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath(`/events-admin/${attendee.event_id}/attendees`);
    revalidatePath(`/events-admin/${attendee.event_id}`);
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAttendee:", error);
    return { success: false, error: "Failed to delete attendee" };
  }
}

// ============================================================================
// EXPORT ATTENDEES TO CSV
// ============================================================================

export async function exportAttendeesToCSV(
  eventId: string
): Promise<ActionResult<string>> {
  try {
    const result = await getEventAttendeesWithDetails(eventId);

    if (!result.success || !result.data) {
      return { success: false, error: "Failed to fetch attendees" };
    }

    const attendees = result.data;

    // CSV header
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Tickets",
      "Total Paid",
      "Payment Status",
      "Payment Method",
      "Checked In",
      "Check-In Time",
      "Dietary Restrictions",
      "Accessibility Needs",
      "Payment Notes",
      "Registered At",
    ];

    // CSV rows
    const rows = attendees.map((a) => [
      a.first_name,
      a.last_name,
      a.email,
      a.phone || "",
      a.ticket_quantity?.toString() || "1",
      a.total_paid?.toFixed(2) || "0.00",
      a.payment_status || "pending",
      a.payment_method || "",
      a.checked_in ? "Yes" : "No",
      a.checked_in_at ? new Date(a.checked_in_at).toLocaleString() : "",
      a.dietary_restrictions || "",
      a.accessibility_needs || "",
      a.payment_notes || "",
      new Date(a.created_at).toLocaleString(),
    ]);

    // Build CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Error in exportAttendeesToCSV:", error);
    return { success: false, error: "Failed to export attendees" };
  }
}
