export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "@/lib/actions/events";
import { getEventAttendeesWithDetails } from "@/lib/actions/event-attendees";
import { AttendeesView } from "./attendees-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventAttendeesPage({ params }: PageProps) {
  const { id } = await params;

  const [eventResult, attendeesResult] = await Promise.all([
    getEventById(id),
    getEventAttendeesWithDetails(id),
  ]);

  if (!eventResult.success || !eventResult.data) {
    notFound();
  }

  const event = eventResult.data;
  const attendees = attendeesResult.data || [];

  // Calculate stats
  const stats = {
    total: attendees.length,
    totalTickets: attendees.reduce((sum, a) => sum + (a.ticket_quantity || 1), 0),
    checkedIn: attendees.filter((a) => a.checked_in).length,
    checkedOut: attendees.filter((a) => a.checked_out_at).length,
    paid: attendees.filter((a) => a.payment_status === "paid").length,
    pending: attendees.filter((a) => a.payment_status === "pending").length,
    refunded: attendees.filter((a) => a.payment_status === "refunded" || a.payment_status === "partial_refund").length,
    totalRevenue: attendees
      .filter((a) => a.payment_status === "paid")
      .reduce((sum, a) => sum + (a.total_paid || 0), 0),
    totalRefunded: attendees.reduce((sum, a) => sum + (a.refund_amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href={`/events-admin/${id}`}
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Attendee Management
            </h1>
            <p className="text-[#888888]">{event.title}</p>
          </div>
        </div>
      </div>

      {/* Attendees View */}
      <AttendeesView
        eventId={id}
        eventTitle={event.title}
        isFreeEvent={event.is_free || event.ticket_price === 0}
        attendees={attendees}
        stats={stats}
      />
    </div>
  );
}
