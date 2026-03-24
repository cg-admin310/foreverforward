"use client";

import { useState } from "react";
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
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketQuantity: 1,
    dietaryRestrictions: "",
    accessibilityNeeds: "",
  });

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setRegistrationSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ticketQuantity: 1,
      dietaryRestrictions: "",
      accessibilityNeeds: "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setRegistrationSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stripe/event-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          ticketQuantity: formData.ticketQuantity,
          dietaryRestrictions: formData.dietaryRestrictions || undefined,
          accessibilityNeeds: formData.accessibilityNeeds || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process registration");
      }

      if (data.isFree) {
        // Free event - show success message
        setRegistrationSuccess(true);
      } else {
        // Paid event - redirect to Stripe
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(error instanceof Error ? error.message : "Failed to process registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleGetTickets(featured)}
                  >
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
                          onClick={() => handleGetTickets(event)}
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

      {/* Ticket Purchase Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[#DDDDDD] p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {selectedEvent.ticket_price ? "Get Tickets" : "Register"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-[#F5F3EF] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#555555]" />
              </button>
            </div>

            <div className="p-6">
              {registrationSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-[#5A7247]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    You&apos;re Registered!
                  </h3>
                  <p className="text-[#555555] mb-6">
                    Check your email for confirmation and event details.
                  </p>
                  <Button onClick={handleCloseModal}>Done</Button>
                </div>
              ) : (
                <>
                  {/* Event Summary */}
                  <div className="bg-[#FBF6E9] rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">
                      {selectedEvent.title}
                    </h3>
                    <div className="space-y-1 text-sm text-[#555555]">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#C9A84C]" />
                        {formatDate(selectedEvent.start_datetime)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#C9A84C]" />
                        {formatTime(selectedEvent.start_datetime)}
                      </p>
                      {selectedEvent.venue_name && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#C9A84C]" />
                          {selectedEvent.venue_name}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E8D48B]">
                      {selectedEvent.ticket_price ? (
                        <span className="text-lg font-bold text-[#1A1A1A]">
                          ${selectedEvent.ticket_price} per ticket
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-[#5A7247]">
                          Free Event
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Phone (optional)
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Number of Tickets *
                      </label>
                      <select
                        value={formData.ticketQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticketQuantity: parseInt(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "ticket" : "tickets"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedEvent.event_type === "movies_on_the_menu" && (
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Dietary Restrictions (optional)
                        </label>
                        <Input
                          value={formData.dietaryRestrictions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dietaryRestrictions: e.target.value,
                            })
                          }
                          placeholder="e.g., vegetarian, allergies"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                        Accessibility Needs (optional)
                      </label>
                      <Input
                        value={formData.accessibilityNeeds}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessibilityNeeds: e.target.value,
                          })
                        }
                        placeholder="Let us know how we can accommodate you"
                      />
                    </div>

                    {/* Total */}
                    {selectedEvent.ticket_price && selectedEvent.ticket_price > 0 && (
                      <div className="bg-[#1A1A1A] text-white rounded-lg p-4 flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold">
                          ${(selectedEvent.ticket_price * formData.ticketQuantity).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : selectedEvent.ticket_price ? (
                        <>
                          <Ticket className="h-5 w-5 mr-2" />
                          Continue to Payment
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
