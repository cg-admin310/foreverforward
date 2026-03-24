"use client";

import { useState, useMemo } from "react";
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
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Event, EventTicketType, EventAddon } from "@/types/database";

interface EventWithDetails extends Event {
  ticket_types?: EventTicketType[];
  addons?: EventAddon[];
}

interface EventsContentProps {
  featured: EventWithDetails | null;
  upcoming: EventWithDetails[];
  past: EventWithDetails[];
  hasEvents: boolean;
  eventTypeLabels: Record<string, string>;
}

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
}

interface AddonSelection {
  addonId: string;
  quantity: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
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

function formatDateParts(dateString: string): { month: string; day: string; weekday: string } {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function EventsContent({
  featured,
  upcoming,
  past,
  hasEvents,
  eventTypeLabels,
}: EventsContentProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dietaryRestrictions: "",
    accessibilityNeeds: "",
  });
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
  const [addonSelections, setAddonSelections] = useState<AddonSelection[]>([]);

  // Combine featured with upcoming for display (featured first if exists)
  const allUpcoming = featured
    ? [featured, ...upcoming.filter(e => e.id !== featured.id)]
    : upcoming;

  // Check if event has ticket types configured
  const hasTicketTypes = selectedEvent?.ticket_types && selectedEvent.ticket_types.length > 0;
  const hasAddons = selectedEvent?.addons && selectedEvent.addons.length > 0;

  // Calculate totals
  const ticketTotal = useMemo(() => {
    if (!selectedEvent) return 0;

    if (hasTicketTypes) {
      return ticketSelections.reduce((sum, selection) => {
        const ticketType = selectedEvent.ticket_types?.find(tt => tt.id === selection.ticketTypeId);
        return sum + (ticketType?.price || 0) * selection.quantity;
      }, 0);
    }

    // Legacy: use event's ticket_price
    const quantity = ticketSelections[0]?.quantity || 1;
    return (selectedEvent.ticket_price || 0) * quantity;
  }, [selectedEvent, ticketSelections, hasTicketTypes]);

  const addonTotal = useMemo(() => {
    if (!selectedEvent?.addons) return 0;
    return addonSelections.reduce((sum, selection) => {
      const addon = selectedEvent.addons?.find(a => a.id === selection.addonId);
      return sum + (addon?.price || 0) * selection.quantity;
    }, 0);
  }, [selectedEvent, addonSelections]);

  const grandTotal = ticketTotal + addonTotal;

  const totalTickets = useMemo(() => {
    return ticketSelections.reduce((sum, s) => sum + s.quantity, 0);
  }, [ticketSelections]);

  const handleGetTickets = (event: EventWithDetails) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setRegistrationSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dietaryRestrictions: "",
      accessibilityNeeds: "",
    });

    // Initialize ticket selections
    if (event.ticket_types && event.ticket_types.length > 0) {
      // Default to 1 of the first ticket type
      setTicketSelections([{ ticketTypeId: event.ticket_types[0].id, quantity: 1 }]);
    } else {
      // Legacy mode: just track quantity
      setTicketSelections([{ ticketTypeId: "default", quantity: 1 }]);
    }
    setAddonSelections([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setRegistrationSuccess(false);
  };

  const updateTicketQuantity = (ticketTypeId: string, delta: number) => {
    setTicketSelections(prev => {
      const existing = prev.find(s => s.ticketTypeId === ticketTypeId);
      const ticketType = selectedEvent?.ticket_types?.find(tt => tt.id === ticketTypeId);
      const maxPerOrder = ticketType?.max_per_order || 10;
      const availableQty = ticketType?.quantity_available !== null && ticketType?.quantity_available !== undefined
        ? ticketType.quantity_available - (ticketType.quantity_sold || 0)
        : Infinity;
      const maxAllowed = Math.min(maxPerOrder, availableQty);

      if (existing) {
        const newQty = Math.max(0, Math.min(maxAllowed, existing.quantity + delta));
        if (newQty === 0) {
          return prev.filter(s => s.ticketTypeId !== ticketTypeId);
        }
        return prev.map(s => s.ticketTypeId === ticketTypeId ? { ...s, quantity: newQty } : s);
      } else if (delta > 0) {
        return [...prev, { ticketTypeId, quantity: Math.min(delta, maxAllowed) }];
      }
      return prev;
    });
  };

  const updateAddonQuantity = (addonId: string, delta: number) => {
    setAddonSelections(prev => {
      const existing = prev.find(s => s.addonId === addonId);
      const addon = selectedEvent?.addons?.find(a => a.id === addonId);
      const maxPerOrder = addon?.max_per_order || 5;
      const availableQty = addon?.quantity_available !== null && addon?.quantity_available !== undefined
        ? addon.quantity_available - (addon.quantity_sold || 0)
        : Infinity;
      const maxAllowed = Math.min(maxPerOrder, availableQty);

      if (existing) {
        const newQty = Math.max(0, Math.min(maxAllowed, existing.quantity + delta));
        if (newQty === 0) {
          return prev.filter(s => s.addonId !== addonId);
        }
        return prev.map(s => s.addonId === addonId ? { ...s, quantity: newQty } : s);
      } else if (delta > 0) {
        return [...prev, { addonId, quantity: Math.min(delta, maxAllowed) }];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    if (totalTickets === 0) {
      alert("Please select at least one ticket");
      return;
    }

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
          // Send either ticket type selections or legacy quantity
          ticketQuantity: hasTicketTypes ? totalTickets : ticketSelections[0]?.quantity || 1,
          ticketSelections: hasTicketTypes ? ticketSelections.filter(s => s.quantity > 0) : undefined,
          addonSelections: addonSelections.filter(s => s.quantity > 0),
          dietaryRestrictions: formData.dietaryRestrictions || undefined,
          accessibilityNeeds: formData.accessibilityNeeds || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process registration");
      }

      if (data.isFree) {
        setRegistrationSuccess(true);
      } else {
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

  // Empty state
  if (!hasEvents) {
    return (
      <section className="py-20 lg:py-32 bg-gradient-to-b from-[#FAFAF8] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-[#1A1A1A] rounded-3xl transform rotate-1" />
            <div className="relative bg-white rounded-3xl p-12 lg:p-16 border border-[#DDDDDD] shadow-xl">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A68A2E] flex items-center justify-center mx-auto mb-8"
                >
                  <CalendarPlus className="h-12 w-12 text-white" />
                </motion.div>

                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                  Events Coming Soon
                </h2>
                <p className="text-lg text-[#555555] mb-8 max-w-lg mx-auto leading-relaxed">
                  We&apos;re cooking up something special! Sign up to be the first to know
                  when our next community gathering is announced.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="min-w-[200px]">
                    <Link href="/get-involved/enroll">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Get Notified
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* All Upcoming Events Grid */}
      <section className="py-16 lg:py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A84C] uppercase tracking-wider mb-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A]">
                Don&apos;t Miss Out
              </h2>
            </div>
            <p className="text-[#555555] max-w-md">
              Join us for workshops, family events, and community gatherings that bring people together.
            </p>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8"
          >
            {allUpcoming.map((event, index) => {
              const dateParts = formatDateParts(event.start_datetime);
              const isMoviesOnMenu = event.event_type === "movies_on_the_menu";
              const isFeatured = index === 0 && featured?.id === event.id;
              const spotsLeft = event.capacity ? Math.max(0, event.capacity - (event.tickets_sold || 0)) : null;

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className={`group relative ${isFeatured ? 'lg:col-span-full' : ''}`}
                >
                  <div
                    className={`
                      relative overflow-hidden rounded-2xl border transition-all duration-300
                      ${isMoviesOnMenu
                        ? 'bg-[#1A1A1A] border-[#333] hover:border-[#C9A84C]'
                        : 'bg-white border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-xl'
                      }
                      ${isFeatured ? 'lg:grid lg:grid-cols-2' : ''}
                    `}
                  >
                    {/* Image Section */}
                    <div className={`
                      relative overflow-hidden
                      ${isFeatured ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[400px]' : 'aspect-[16/9]'}
                    `}>
                      {event.featured_image_url ? (
                        <Image
                          src={event.featured_image_url}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 50vw"}
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
                                <Film className="h-16 w-16 mx-auto mb-3 opacity-80" />
                                <span className="text-lg font-semibold">Movies on the Menu</span>
                              </>
                            ) : (
                              <>
                                <Users className="h-16 w-16 mx-auto mb-3 opacity-80" />
                                <span className="text-lg font-semibold">Community Event</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Date Badge - Floating */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-white rounded-xl p-3 shadow-lg text-center min-w-[70px]">
                          <span className="block text-xs font-bold text-[#C9A84C] tracking-wider">
                            {dateParts.month}
                          </span>
                          <span className="block text-2xl font-bold text-[#1A1A1A] leading-none">
                            {dateParts.day}
                          </span>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {isFeatured && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        </div>
                      )}

                      {/* Movies on Menu Badge */}
                      {isMoviesOnMenu && !isFeatured && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-xs font-bold">
                            <Utensils className="h-3 w-3" />
                            Dinner + Movie
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 lg:p-8 ${isMoviesOnMenu ? 'text-white' : ''}`}>
                      {/* Event Type Tag */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`
                          inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                          ${isMoviesOnMenu
                            ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                            : 'bg-[#EFF4EB] text-[#5A7247]'
                          }
                        `}>
                          {eventTypeLabels[event.event_type] || event.event_type}
                        </span>
                        {event.is_free || !event.ticket_price ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#5A7247] text-white">
                            FREE
                          </span>
                        ) : null}
                      </div>

                      {/* Title */}
                      <h3 className={`
                        text-2xl lg:text-3xl font-bold mb-4 leading-tight
                        ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}
                      `}>
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className={`
                          mb-6 leading-relaxed line-clamp-2
                          ${isMoviesOnMenu ? 'text-white/70' : 'text-[#555555]'}
                        `}>
                          {event.description}
                        </p>
                      )}

                      {/* Event Details */}
                      <div className={`
                        flex flex-wrap gap-4 mb-6 text-sm
                        ${isMoviesOnMenu ? 'text-white/60' : 'text-[#888888]'}
                      `}>
                        <span className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                          {formatTime(event.start_datetime)}
                        </span>
                        {event.venue_name && (
                          <span className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                            {event.venue_name}
                          </span>
                        )}
                        {spotsLeft !== null && (
                          <span className="flex items-center gap-2">
                            <Users className={`h-4 w-4 ${isMoviesOnMenu ? 'text-[#C9A84C]' : 'text-[#C9A84C]'}`} />
                            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold Out'}
                          </span>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          {event.ticket_price && event.ticket_price > 0 ? (
                            <div>
                              <span className={`text-3xl font-bold ${isMoviesOnMenu ? 'text-white' : 'text-[#1A1A1A]'}`}>
                                ${event.ticket_price}
                              </span>
                              <span className={`text-sm ml-1 ${isMoviesOnMenu ? 'text-white/60' : 'text-[#888888]'}`}>
                                /person
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-[#5A7247]">
                              Free Event
                            </span>
                          )}
                        </div>

                        <Button
                          size="lg"
                          onClick={() => handleGetTickets(event)}
                          disabled={spotsLeft === 0}
                          className={`
                            ${isMoviesOnMenu
                              ? 'bg-[#C9A84C] hover:bg-[#A68A2E] text-[#1A1A1A]'
                              : ''
                            }
                          `}
                        >
                          {spotsLeft === 0 ? (
                            'Sold Out'
                          ) : (
                            <>
                              <Ticket className="h-5 w-5 mr-2" />
                              {event.ticket_price ? 'Get Tickets' : 'Register Free'}
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Movies on the Menu Extra Info */}
                      {isMoviesOnMenu && event.movie_title && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="flex items-center gap-3 text-white/70">
                            <Film className="h-5 w-5 text-[#C9A84C]" />
                            <span>Featuring: <strong className="text-white">{event.movie_title}</strong></span>
                          </div>
                          {event.food_pairing && (
                            <div className="flex items-center gap-3 text-white/70 mt-2">
                              <Utensils className="h-5 w-5 text-[#C9A84C]" />
                              <span>Menu: <strong className="text-white">{event.food_pairing}</strong></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Past Events - Compact Grid */}
      {past.length > 0 && (
        <section className="py-16 lg:py-20 bg-white border-t border-[#EEEEEE]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">
                Past Events
              </h2>
              <p className="text-[#888888]">
                A look back at our recent community gatherings
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {past.slice(0, 6).map((event) => {
                const dateParts = formatDateParts(event.start_datetime);
                return (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className="group bg-[#FAFAF8] rounded-xl p-5 border border-[#EEEEEE] hover:border-[#DDDDDD] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date */}
                      <div className="shrink-0 w-14 h-14 rounded-lg bg-[#1A1A1A] flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-[#C9A84C] tracking-wider">
                          {dateParts.month}
                        </span>
                        <span className="text-lg font-bold text-white leading-none">
                          {dateParts.day}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1A1A1A] truncate group-hover:text-[#C9A84C] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#888888] mt-1">
                          {eventTypeLabels[event.event_type] || event.event_type}
                        </p>
                        {event.tickets_sold && event.tickets_sold > 0 && (
                          <p className="text-sm text-[#5A7247] font-medium mt-2">
                            {event.tickets_sold} attended
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Ticket Purchase Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative bg-[#1A1A1A] text-white p-6">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="pr-8">
                <span className="inline-block px-2 py-1 rounded bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mb-2">
                  {eventTypeLabels[selectedEvent.event_type] || selectedEvent.event_type}
                </span>
                <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#C9A84C]" />
                    {formatDate(selectedEvent.start_datetime)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#C9A84C]" />
                    {formatTime(selectedEvent.start_datetime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {registrationSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-[#5A7247]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    You&apos;re Registered!
                  </h3>
                  <p className="text-[#555555] mb-6">
                    Check your email for confirmation and event details.
                  </p>
                  <Button onClick={handleCloseModal} size="lg">
                    Done
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Ticket Types Selection */}
                  {hasTicketTypes ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                        <Ticket className="h-4 w-4 inline-block mr-2 text-[#C9A84C]" />
                        Select Tickets <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {selectedEvent.ticket_types?.map((ticketType) => {
                          const selection = ticketSelections.find(s => s.ticketTypeId === ticketType.id);
                          const quantity = selection?.quantity || 0;
                          const available = ticketType.quantity_available !== null
                            ? ticketType.quantity_available - (ticketType.quantity_sold || 0)
                            : null;
                          const isSoldOut = available !== null && available <= 0;

                          return (
                            <div
                              key={ticketType.id}
                              className={`
                                p-4 rounded-xl border-2 transition-all
                                ${quantity > 0 ? 'border-[#C9A84C] bg-[#FBF6E9]' : 'border-[#DDDDDD] bg-white'}
                                ${isSoldOut ? 'opacity-60' : ''}
                              `}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-[#1A1A1A]">{ticketType.name}</h4>
                                    {isSoldOut && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">
                                        Sold Out
                                      </span>
                                    )}
                                  </div>
                                  {ticketType.description && (
                                    <p className="text-sm text-[#555555] mt-1">{ticketType.description}</p>
                                  )}
                                  {available !== null && !isSoldOut && (
                                    <p className="text-xs text-[#888888] mt-1">{available} remaining</p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-lg text-[#1A1A1A]">
                                    {ticketType.price > 0 ? `$${ticketType.price}` : 'Free'}
                                  </p>
                                  {!isSoldOut && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <button
                                        type="button"
                                        onClick={() => updateTicketQuantity(ticketType.id, -1)}
                                        className="w-8 h-8 rounded-lg bg-[#EEEEEE] hover:bg-[#DDDDDD] flex items-center justify-center transition-colors"
                                        disabled={quantity === 0}
                                      >
                                        <Minus className="h-4 w-4 text-[#555555]" />
                                      </button>
                                      <span className="w-8 text-center font-semibold">{quantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateTicketQuantity(ticketType.id, 1)}
                                        className="w-8 h-8 rounded-lg bg-[#C9A84C] hover:bg-[#A68A2E] flex items-center justify-center transition-colors"
                                      >
                                        <Plus className="h-4 w-4 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Legacy: Simple ticket quantity selector */
                    <div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-[#FBF6E9] border border-[#E8D48B]">
                        <span className="font-medium text-[#1A1A1A]">Price per ticket</span>
                        {selectedEvent.ticket_price && selectedEvent.ticket_price > 0 ? (
                          <span className="text-2xl font-bold text-[#1A1A1A]">
                            ${selectedEvent.ticket_price}
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-[#5A7247]">FREE</span>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                          Number of Tickets <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={ticketSelections[0]?.quantity || 1}
                          onChange={(e) => setTicketSelections([{ ticketTypeId: "default", quantity: parseInt(e.target.value) }])}
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "ticket" : "tickets"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Add-ons Section */}
                  {hasAddons && totalTickets > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                        <Package className="h-4 w-4 inline-block mr-2 text-[#5A7247]" />
                        Add-ons <span className="text-[#888888] font-normal">(optional)</span>
                      </label>
                      <div className="space-y-3">
                        {selectedEvent.addons?.map((addon) => {
                          const selection = addonSelections.find(s => s.addonId === addon.id);
                          const quantity = selection?.quantity || 0;
                          const available = addon.quantity_available !== null
                            ? addon.quantity_available - (addon.quantity_sold || 0)
                            : null;
                          const isSoldOut = available !== null && available <= 0;

                          return (
                            <div
                              key={addon.id}
                              className={`
                                p-4 rounded-xl border-2 transition-all
                                ${quantity > 0 ? 'border-[#5A7247] bg-[#EFF4EB]' : 'border-[#DDDDDD] bg-white'}
                                ${isSoldOut ? 'opacity-60' : ''}
                              `}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-[#1A1A1A]">{addon.name}</h4>
                                    {addon.category && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-[#EEEEEE] text-[#555555] capitalize">
                                        {addon.category}
                                      </span>
                                    )}
                                    {isSoldOut && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 font-medium">
                                        Sold Out
                                      </span>
                                    )}
                                  </div>
                                  {addon.description && (
                                    <p className="text-sm text-[#555555] mt-1">{addon.description}</p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-[#1A1A1A]">
                                    +${addon.price}
                                  </p>
                                  {!isSoldOut && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <button
                                        type="button"
                                        onClick={() => updateAddonQuantity(addon.id, -1)}
                                        className="w-8 h-8 rounded-lg bg-[#EEEEEE] hover:bg-[#DDDDDD] flex items-center justify-center transition-colors"
                                        disabled={quantity === 0}
                                      >
                                        <Minus className="h-4 w-4 text-[#555555]" />
                                      </button>
                                      <span className="w-8 text-center font-semibold">{quantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateAddonQuantity(addon.id, 1)}
                                        className="w-8 h-8 rounded-lg bg-[#5A7247] hover:bg-[#3D5030] flex items-center justify-center transition-colors"
                                      >
                                        <Plus className="h-4 w-4 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Phone <span className="text-[#888888] font-normal">(optional)</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Dietary Restrictions for Movies on the Menu */}
                  {selectedEvent.event_type === "movies_on_the_menu" && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Dietary Restrictions <span className="text-[#888888] font-normal">(optional)</span>
                      </label>
                      <Input
                        value={formData.dietaryRestrictions}
                        onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                        placeholder="Vegetarian, allergies, etc."
                      />
                    </div>
                  )}

                  {/* Accessibility */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Accessibility Needs <span className="text-[#888888] font-normal">(optional)</span>
                    </label>
                    <Input
                      value={formData.accessibilityNeeds}
                      onChange={(e) => setFormData({ ...formData, accessibilityNeeds: e.target.value })}
                      placeholder="Let us know how we can accommodate you"
                    />
                  </div>

                  {/* Order Summary / Total */}
                  {grandTotal > 0 && (
                    <div className="rounded-xl bg-[#1A1A1A] text-white p-4 space-y-2">
                      {ticketTotal > 0 && (
                        <div className="flex justify-between text-sm text-white/70">
                          <span>Tickets ({totalTickets})</span>
                          <span>${ticketTotal.toFixed(2)}</span>
                        </div>
                      )}
                      {addonTotal > 0 && (
                        <div className="flex justify-between text-sm text-white/70">
                          <span>Add-ons</span>
                          <span>${addonTotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-white/20">
                        <span className="font-medium">Total</span>
                        <span className="text-2xl font-bold">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Free event indicator */}
                  {grandTotal === 0 && totalTickets > 0 && (
                    <div className="flex items-center justify-center p-4 rounded-xl bg-[#EFF4EB] border border-[#5A7247]">
                      <CheckCircle className="h-5 w-5 text-[#5A7247] mr-2" />
                      <span className="font-semibold text-[#5A7247]">Free Event - No Payment Required</span>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || totalTickets === 0}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : grandTotal > 0 ? (
                      <>
                        <ArrowRight className="h-5 w-5 mr-2" />
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
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
