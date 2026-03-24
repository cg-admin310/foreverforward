"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Film,
  Utensils,
  Star,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Event } from "@/types/database";

interface EventsContentProps {
  featured: Event | null;
  upcoming: Event[];
  past: Event[];
  hasEvents: boolean;
  eventTypeLabels: Record<string, string>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateParts(dateString: string): { month: string; day: string } {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.getDate().toString(),
  };
}

export function EventsContent({
  featured,
  upcoming,
  past,
  hasEvents,
  eventTypeLabels,
}: EventsContentProps) {
  if (!hasEvents) {
    return (
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 border border-[#DDDDDD]"
          >
            <CalendarPlus className="h-16 w-16 text-[#C9A84C] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              No Upcoming Events
            </h2>
            <p className="text-[#555555] mb-8 max-w-md mx-auto">
              We&apos;re currently planning our next community events. Sign up for
              our newsletter to be the first to know when tickets go on sale!
            </p>
            <Button asChild size="lg">
              <Link href="/get-involved/enroll">Get Event Updates</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Featured Event */}
      {featured && (
        <section className="py-16 lg:py-24 bg-[#FAFAF8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-[#C9A84C] fill-[#C9A84C]" />
                <span className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">
                  Featured Event
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#DDDDDD]"
            >
              <div className="grid lg:grid-cols-2">
                {/* Event Image */}
                <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center min-h-[300px] relative overflow-hidden">
                  {featured.featured_image_url ? (
                    <Image
                      src={featured.featured_image_url}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="text-center text-[#1A1A1A]/80">
                      <Film className="h-16 w-16 mx-auto mb-4" />
                      <span className="font-semibold">
                        {featured.event_type === "movies_on_the_menu"
                          ? "Movies on the Menu"
                          : "Event"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 lg:p-10">
                  <Badge variant="gold" className="mb-4">
                    {eventTypeLabels[featured.event_type] || featured.event_type}
                  </Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-4">
                    {featured.title}
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-[#555555]">
                      <Calendar className="h-5 w-5 text-[#C9A84C]" />
                      <span>{formatDate(featured.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#555555]">
                      <Clock className="h-5 w-5 text-[#C9A84C]" />
                      <span>
                        {formatTime(featured.start_datetime)}
                        {featured.end_datetime &&
                          ` - ${formatTime(featured.end_datetime)}`}
                      </span>
                    </div>
                    {featured.venue_name && (
                      <div className="flex items-center gap-3 text-[#555555]">
                        <MapPin className="h-5 w-5 text-[#C9A84C]" />
                        <span>{featured.venue_name}</span>
                      </div>
                    )}
                  </div>

                  {featured.description && (
                    <p className="text-[#555555] leading-relaxed mb-6">
                      {featured.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-[#FBF6E9]">
                    <div>
                      {featured.ticket_price ? (
                        <>
                          <span className="text-2xl font-bold text-[#1A1A1A]">
                            ${featured.ticket_price}
                          </span>
                          <span className="text-[#888888] ml-1">per person</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-[#5A7247]">
                          Free Event
                        </span>
                      )}
                    </div>
                    {featured.capacity && (
                      <div className="text-right">
                        <span className="text-[#5A7247] font-medium">
                          {Math.max(
                            0,
                            featured.capacity - (featured.tickets_sold || 0)
                          )}{" "}
                          spots left
                        </span>
                        <span className="text-[#888888] text-sm block">
                          of {featured.capacity} total
                        </span>
                      </div>
                    )}
                  </div>

                  <Button size="lg" className="w-full">
                    <Ticket className="h-5 w-5 mr-2" />
                    {featured.ticket_price ? "Get Tickets" : "Register Now"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Upcoming Events"
              subtitle="Mark your calendar for these community gatherings."
            />

            <div className="mt-12 space-y-6">
              {upcoming.map((event, index) => {
                const dateParts = formatDateParts(event.start_datetime);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#FAFAF8] rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Date Badge */}
                      <div className="shrink-0 w-20 h-20 rounded-xl bg-[#1A1A1A] flex flex-col items-center justify-center text-center">
                        <span className="text-[#C9A84C] text-sm font-medium">
                          {dateParts.month}
                        </span>
                        <span className="text-white text-2xl font-bold">
                          {dateParts.day}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge
                              variant={
                                event.event_type === "movies_on_the_menu"
                                  ? "gold"
                                  : "default"
                              }
                              size="sm"
                              className="mb-2"
                            >
                              {eventTypeLabels[event.event_type] ||
                                event.event_type}
                            </Badge>
                            <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                              {event.title}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            {!event.ticket_price || event.ticket_price === 0 ? (
                              <span className="text-[#5A7247] font-semibold">
                                Free
                              </span>
                            ) : (
                              <span className="text-[#1A1A1A] font-semibold">
                                ${event.ticket_price}
                              </span>
                            )}
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-[#555555] mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#888888]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(event.start_datetime)}
                          </span>
                          {event.venue_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.venue_name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="shrink-0">
                        <Button
                          variant={
                            !event.ticket_price || event.ticket_price === 0
                              ? "secondary"
                              : "default"
                          }
                        >
                          {!event.ticket_price || event.ticket_price === 0
                            ? "Register"
                            : "Get Tickets"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#F5F3EF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Recent Event Highlights"
              subtitle="A look back at some of our favorite community moments."
              centered
            />

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {past.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center border border-[#DDDDDD]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#C9A84C]">
                      {event.tickets_sold || 0}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#888888]">
                    {new Date(event.start_datetime).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
