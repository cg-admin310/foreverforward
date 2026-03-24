export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventById, getEventAttendees } from "@/lib/actions/events";
import { DeleteEventButton } from "./delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [eventResult, attendeesResult] = await Promise.all([
    getEventById(id),
    getEventAttendees(id),
  ]);

  if (!eventResult.success || !eventResult.data) {
    notFound();
  }

  const event = eventResult.data;
  const attendees = attendeesResult.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const eventTypeLabels: Record<string, string> = {
    movies_on_the_menu: "Movies on the Menu",
    workshop: "Workshop",
    graduation: "Graduation",
    community: "Community Event",
    fundraiser: "Fundraiser",
    other: "Other",
  };

  const getStatusBadge = () => {
    if (event.is_cancelled) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          Cancelled
        </span>
      );
    }
    if (!event.is_published) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          Draft
        </span>
      );
    }
    const now = new Date();
    const start = new Date(event.start_datetime);
    const end = event.end_datetime ? new Date(event.end_datetime) : null;

    if (start > now) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    }
    if (end && now < end) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Live Now
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
        Completed
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/events-admin"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{event.title}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-[#888888]">
              {eventTypeLabels[event.event_type] || event.event_type}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/events-admin/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DeleteEventButton eventId={id} eventTitle={event.title} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
            <h2 className="font-semibold text-[#1A1A1A] mb-4">Event Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FBF6E9]">
                  <Calendar className="h-4 w-4 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888]">Date & Time</p>
                  <p className="text-[#1A1A1A]">
                    {formatDate(event.start_datetime)}
                  </p>
                  <p className="text-sm text-[#555555]">
                    {formatTime(event.start_datetime)}
                    {event.end_datetime &&
                      ` - ${formatTime(event.end_datetime)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#FBF6E9]">
                  {event.is_virtual ? (
                    <Globe className="h-4 w-4 text-[#C9A84C]" />
                  ) : (
                    <MapPin className="h-4 w-4 text-[#C9A84C]" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#888888]">Location</p>
                  {event.is_virtual ? (
                    <>
                      <p className="text-[#1A1A1A]">Virtual Event</p>
                      {event.virtual_link && (
                        <a
                          href={event.virtual_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#C9A84C] hover:underline"
                        >
                          Join Link
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[#1A1A1A]">
                        {event.venue_name || "Venue TBD"}
                      </p>
                      {event.address_line1 && (
                        <p className="text-sm text-[#555555]">
                          {event.address_line1}
                          {event.city && `, ${event.city}`}
                          {event.state && `, ${event.state}`}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {event.description && (
                <div className="pt-4 border-t border-[#DDDDDD]">
                  <p className="text-sm text-[#888888] mb-2">Description</p>
                  <p className="text-[#555555] whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendees */}
          <div className="bg-white rounded-xl border border-[#DDDDDD]">
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">
                Registered Attendees ({attendees.length})
              </h2>
            </div>
            {attendees.length > 0 ? (
              <div className="divide-y divide-[#DDDDDD]">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-semibold">
                        {attendee.first_name.charAt(0)}
                        {attendee.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {attendee.first_name} {attendee.last_name}
                        </p>
                        <p className="text-sm text-[#888888]">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[#555555]">
                        {attendee.ticket_quantity || 1} ticket
                        {(attendee.ticket_quantity || 1) !== 1 ? "s" : ""}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          attendee.checked_in
                            ? "bg-green-100 text-green-700"
                            : attendee.payment_status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {attendee.checked_in
                          ? "Checked In"
                          : attendee.payment_status === "cancelled"
                          ? "Cancelled"
                          : "Registered"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                <p className="text-sm text-[#888888]">No registrations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Event Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Registered</span>
                <span className="font-medium text-[#1A1A1A]">
                  {event.tickets_sold || 0}
                  {event.capacity && ` / ${event.capacity}`}
                </span>
              </div>
              {event.ticket_price !== null && event.ticket_price > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888888]">Revenue</span>
                  <span className="font-medium text-[#5A7247]">
                    ${((event.ticket_price || 0) * (event.tickets_sold || 0)).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Ticket Price</span>
                <span className="font-medium text-[#1A1A1A]">
                  {event.ticket_price && event.ticket_price > 0
                    ? `$${event.ticket_price}`
                    : "Free"}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {event.is_published ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-[#555555]">
                  {event.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!event.is_cancelled ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-[#555555]">
                  {event.is_cancelled ? "Cancelled" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Quick Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888888]">Created</span>
                <span className="text-[#1A1A1A]">
                  {new Date(event.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Slug</span>
                <span className="text-[#1A1A1A] font-mono text-xs">
                  {event.slug}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
