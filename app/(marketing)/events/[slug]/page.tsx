import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Film,
  Utensils,
  ArrowLeft,
  Share2,
  CalendarPlus,
  Navigation,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventWithDetails, getPublishedEvents } from "@/lib/actions/events";
import { EventDetailContent } from "./event-detail-content";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

const eventTypeLabels: Record<string, string> = {
  movies_on_the_menu: "Movies on the Menu",
  orientation: "Info Session",
  workshop: "Workshop",
  job_fair: "Job Fair",
  community: "Community Event",
  graduation: "Graduation",
  fundraiser: "Fundraiser",
};

export async function generateStaticParams() {
  const result = await getPublishedEvents();
  const events = [
    ...(result.data?.featured ? [result.data.featured] : []),
    ...(result.data?.upcoming || []),
    ...(result.data?.past || []),
  ];

  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEventWithDetails(slug);
  const event = result.data;

  if (!event) {
    return {
      title: "Event Not Found | Forever Forward",
    };
  }

  const eventDate = new Date(event.start_datetime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    title: `${event.title} | Forever Forward Events`,
    description: event.short_description || event.description || `Join us for ${event.title} on ${eventDate}`,
    openGraph: {
      title: event.title,
      description: event.short_description || event.description || undefined,
      images: event.featured_image_url ? [event.featured_image_url] : undefined,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const result = await getEventWithDetails(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;
  const isMoviesOnMenu = event.event_type === "movies_on_the_menu";
  const isPastEvent = new Date(event.start_datetime) < new Date();
  const spotsLeft = event.capacity ? Math.max(0, event.capacity - (event.tickets_sold || 0)) : null;
  const isSoldOut = spotsLeft === 0;

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

  const endTime = event.end_datetime
    ? new Date(event.end_datetime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const locationParts = [
    event.venue_name,
    event.address_line1,
    event.city && event.state ? `${event.city}, ${event.state} ${event.zip_code || ""}`.trim() : event.city || event.state,
  ].filter(Boolean);

  const googleMapsUrl = locationParts.length > 0
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationParts.join(", "))}`
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className={`relative py-16 lg:py-24 overflow-hidden ${isMoviesOnMenu ? 'bg-[#1A1A1A]' : 'bg-[#FAFAF8]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/events"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity ${
              isMoviesOnMenu ? 'text-white/70' : 'text-[#555555]'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Event Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {event.featured_image_url ? (
                <Image
                  src={event.featured_image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className={`
                  absolute inset-0 flex items-center justify-center
                  ${isMoviesOnMenu
                    ? 'bg-gradient-to-br from-[#C9A84C] via-[#A68A2E] to-[#8B7225]'
                    : 'bg-gradient-to-br from-[#5A7247] via-[#4A6139] to-[#3D5030]'
                  }
                `}>
                  <div className="text-center text-white/90">
                    {isMoviesOnMenu ? (
                      <>
                        <Film className="h-24 w-24 mx-auto mb-4 opacity-80" />
                        <span className="text-2xl font-semibold">Movies on the Menu</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-24 w-24 mx-auto mb-4 opacity-80" />
                        <span className="text-2xl font-semibold">Community Event</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {isPastEvent && (
                  <span className="px-3 py-1.5 rounded-full bg-[#1A1A1A]/80 text-white text-sm font-semibold">
                    Past Event
                  </span>
                )}
                {!isPastEvent && isSoldOut && (
                  <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold">
                    Sold Out
                  </span>
                )}
                {!isPastEvent && event.is_featured && (
                  <span className="px-3 py-1.5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-sm font-bold flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div>
              {/* Event Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider
                  ${isMoviesOnMenu
                    ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                    : 'bg-[#EFF4EB] text-[#5A7247]'
                  }
                `}>
                  {eventTypeLabels[event.event_type] || event.event_type}
                </span>
                {(event.is_free || !event.ticket_price) && !isPastEvent && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#5A7247] text-white">
                    FREE
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
                isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'
              }`}>
                {event.title}
              </h1>

              {/* Key Details */}
              <div className={`space-y-4 mb-8 ${isMoviesOnMenu ? 'text-white/80' : 'text-[#555555]'}`}>
                <div className="flex items-start gap-3">
                  <Calendar className={`h-5 w-5 shrink-0 mt-0.5 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                  <div>
                    <p className={`font-semibold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className={`h-5 w-5 shrink-0 mt-0.5 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                  <div>
                    <p className={`font-semibold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {formattedTime}{endTime ? ` - ${endTime}` : ''}
                    </p>
                  </div>
                </div>

                {event.is_virtual ? (
                  <div className="flex items-start gap-3">
                    <MapPin className={`h-5 w-5 shrink-0 mt-0.5 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                    <div>
                      <p className={`font-semibold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        Virtual Event
                      </p>
                      <p className="text-sm">Link will be sent after registration</p>
                    </div>
                  </div>
                ) : locationParts.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className={`h-5 w-5 shrink-0 mt-0.5 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                    <div>
                      {locationParts.map((part, i) => (
                        <p key={i} className={i === 0 ? `font-semibold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}` : ''}>
                          {part}
                        </p>
                      ))}
                      {googleMapsUrl && (
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-sm mt-1 ${
                            isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'
                          } hover:underline`}
                        >
                          <Navigation className="h-3 w-3" />
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {spotsLeft !== null && !isPastEvent && (
                  <div className="flex items-start gap-3">
                    <Users className={`h-5 w-5 shrink-0 mt-0.5 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                    <div>
                      <p className={`font-semibold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Sold Out'}
                      </p>
                      <p className="text-sm">of {event.capacity} total capacity</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Movies on the Menu Special Info */}
              {isMoviesOnMenu && (event.movie_title || event.food_pairing) && (
                <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm mb-8">
                  {event.movie_title && (
                    <div className="flex items-center gap-3 text-white/90 mb-3">
                      <Film className="h-5 w-5 text-[#C9A84C]" />
                      <span>
                        <strong className="text-white">Featured Film:</strong> {event.movie_title}
                      </span>
                    </div>
                  )}
                  {event.food_pairing && (
                    <div className="flex items-center gap-3 text-white/90">
                      <Utensils className="h-5 w-5 text-[#C9A84C]" />
                      <span>
                        <strong className="text-white">Dinner Menu:</strong> {event.food_pairing}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Price & Quick Actions */}
              {!isPastEvent && (
                <div className={`p-6 rounded-xl ${isMoviesOnMenu ? 'bg-white/10' : 'bg-[#FBF6E9]'} mb-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${isMoviesOnMenu ? 'text-white/70' : 'text-[#555555]'}`}>
                      Starting at
                    </span>
                    {event.ticket_price && event.ticket_price > 0 ? (
                      <span className={`text-3xl font-bold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                        ${event.ticket_price}<span className="text-lg font-normal">/person</span>
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-[#5A7247]">Free Event</span>
                    )}
                  </div>
                  <Button asChild={false} size="lg" className="w-full" disabled={isSoldOut}>
                    <a href="#register">
                      {isSoldOut ? 'Sold Out' : 'Get Tickets'}
                    </a>
                  </Button>
                </div>
              )}

              {/* Share Button */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className={isMoviesOnMenu ? 'border-white/20 text-white hover:bg-white/10' : ''}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                <Button variant="outline" size="sm" className={isMoviesOnMenu ? 'border-white/20 text-white hover:bg-white/10' : ''}>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      {event.description && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">About This Event</h2>
            <div className="prose prose-lg max-w-none text-[#555555]">
              {event.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration Section */}
      {!isPastEvent && !isSoldOut && (
        <section id="register" className="py-16 lg:py-24 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                Register for This Event
              </h2>
              <p className="text-[#555555]">
                Secure your spot at {event.title}
              </p>
            </div>

            <EventDetailContent
              event={event}
              eventTypeLabel={eventTypeLabels[event.event_type] || event.event_type}
            />
          </div>
        </section>
      )}

      {/* Past Event Notice */}
      {isPastEvent && (
        <section className="py-16 bg-[#FAFAF8]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 rounded-2xl bg-white border border-[#DDDDDD]">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                This Event Has Ended
              </h2>
              <p className="text-[#555555] mb-6">
                Thanks to everyone who attended! Check out our upcoming events for more opportunities to connect.
              </p>
              <Button asChild size="lg">
                <Link href="/events">View Upcoming Events</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {event.gallery_urls && event.gallery_urls.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.gallery_urls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                  <Image
                    src={url}
                    alt={`${event.title} gallery image ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
