import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Clock, Ticket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Tickets Confirmed | Forever Forward",
  description: "Your event tickets have been confirmed. See you there!",
};

interface SearchParams {
  session_id?: string;
  attendee_id?: string;
}

async function TicketConfirmation({ attendeeId }: { attendeeId: string }) {
  const supabase = createAdminClient();

  // Fetch attendee with event details
  const { data: attendee, error } = await supabase
    .from("event_attendees")
    .select(`
      *,
      event:events(
        id,
        title,
        slug,
        start_datetime,
        end_datetime,
        venue_name,
        address,
        city,
        state,
        zip_code,
        is_virtual,
        virtual_link,
        ticket_price,
        event_type
      )
    `)
    .eq("id", attendeeId)
    .single();

  if (error || !attendee) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
          Unable to load ticket details
        </h2>
        <p className="text-[#555555] mb-6">
          Your purchase was successful, but we couldn&apos;t load the details. Check
          your email for confirmation.
        </p>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const event = attendee.event as {
    id: string;
    title: string;
    slug: string;
    start_datetime: string;
    end_datetime: string | null;
    venue_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    is_virtual: boolean;
    virtual_link: string | null;
    ticket_price: number | null;
    event_type: string;
  };

  const eventDate = new Date(event.start_datetime);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const locationParts = [
    event.venue_name,
    event.address,
    event.city && event.state ? `${event.city}, ${event.state}` : event.city || event.state,
    event.zip_code,
  ].filter(Boolean);

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-[#5A7247]" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
        You&apos;re Going!
      </h1>
      <p className="text-lg text-[#555555] mb-8 max-w-md mx-auto">
        Your tickets are confirmed. We&apos;ve sent a confirmation email to{" "}
        <span className="font-medium text-[#1A1A1A]">{attendee.email}</span>.
      </p>

      {/* Ticket Details Card */}
      <div className="bg-white rounded-2xl border border-[#DDDDDD] shadow-sm overflow-hidden max-w-md mx-auto mb-8">
        {/* Gold Header */}
        <div className="bg-[#C9A84C] text-[#1A1A1A] p-4">
          <div className="flex items-center justify-center gap-2">
            <Ticket className="h-5 w-5" />
            <span className="font-semibold">
              {attendee.ticket_quantity} {attendee.ticket_quantity === 1 ? "Ticket" : "Tickets"}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 text-left">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">{event.title}</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1A1A1A]">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1A1A1A]">{formattedTime}</p>
              </div>
            </div>

            {event.is_virtual ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1A1A1A]">Virtual Event</p>
                  {event.virtual_link && (
                    <p className="text-sm text-[#555555]">Link will be sent before the event</p>
                  )}
                </div>
              </div>
            ) : locationParts.length > 0 ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  {locationParts.map((part, i) => (
                    <p key={i} className={i === 0 ? "font-medium text-[#1A1A1A]" : "text-sm text-[#555555]"}>
                      {part}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t border-[#DDDDDD]">
            <div className="flex justify-between text-sm text-[#555555]">
              <span>Order for</span>
              <span className="font-medium text-[#1A1A1A]">
                {attendee.first_name} {attendee.last_name}
              </span>
            </div>
            {attendee.total_paid > 0 && (
              <div className="flex justify-between text-sm text-[#555555] mt-1">
                <span>Total paid</span>
                <span className="font-medium text-[#1A1A1A]">
                  ${attendee.total_paid.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/events">
            Browse More Events
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Help Text */}
      <p className="text-sm text-[#888888] mt-8">
        Questions about your tickets?{" "}
        <Link href="/contact" className="text-[#C9A84C] hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-[#FBF6E9] flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Ticket className="h-10 w-10 text-[#C9A84C]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
        Loading your tickets...
      </h2>
    </div>
  );
}

export default async function EventSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const attendeeId = params.attendee_id;

  return (
    <div className="min-h-[80vh] bg-[#FAFAF8] flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full">
        {attendeeId ? (
          <Suspense fallback={<LoadingState />}>
            <TicketConfirmation attendeeId={attendeeId} />
          </Suspense>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-[#5A7247]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              Thank You!
            </h1>
            <p className="text-[#555555] mb-8">
              Your registration has been received. Check your email for
              confirmation details.
            </p>
            <Button asChild size="lg">
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
