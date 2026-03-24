"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Ticket,
  Package,
  Plus,
  Minus,
  Loader2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EventTicketType, EventAddon } from "@/types/database";

interface EventWithDetails {
  id: string;
  title: string;
  event_type: string;
  ticket_price: number | null;
  is_free: boolean | null;
  ticket_types?: EventTicketType[];
  addons?: EventAddon[];
}

interface EventDetailContentProps {
  event: EventWithDetails;
  eventTypeLabel: string;
}

interface TicketSelection {
  ticketTypeId: string;
  quantity: number;
}

interface AddonSelection {
  addonId: string;
  quantity: number;
}

export function EventDetailContent({ event, eventTypeLabel }: EventDetailContentProps) {
  const router = useRouter();
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
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>(() => {
    if (event.ticket_types && event.ticket_types.length > 0) {
      return [{ ticketTypeId: event.ticket_types[0].id, quantity: 1 }];
    }
    return [{ ticketTypeId: "default", quantity: 1 }];
  });
  const [addonSelections, setAddonSelections] = useState<AddonSelection[]>([]);

  const hasTicketTypes = event.ticket_types && event.ticket_types.length > 0;
  const hasAddons = event.addons && event.addons.length > 0;

  // Calculate totals
  const ticketTotal = useMemo(() => {
    if (hasTicketTypes) {
      return ticketSelections.reduce((sum, selection) => {
        const ticketType = event.ticket_types?.find(tt => tt.id === selection.ticketTypeId);
        return sum + (ticketType?.price || 0) * selection.quantity;
      }, 0);
    }
    const quantity = ticketSelections[0]?.quantity || 1;
    return (event.ticket_price || 0) * quantity;
  }, [event, ticketSelections, hasTicketTypes]);

  const addonTotal = useMemo(() => {
    if (!event.addons) return 0;
    return addonSelections.reduce((sum, selection) => {
      const addon = event.addons?.find(a => a.id === selection.addonId);
      return sum + (addon?.price || 0) * selection.quantity;
    }, 0);
  }, [event, addonSelections]);

  const grandTotal = ticketTotal + addonTotal;

  const totalTickets = useMemo(() => {
    return ticketSelections.reduce((sum, s) => sum + s.quantity, 0);
  }, [ticketSelections]);

  const updateTicketQuantity = (ticketTypeId: string, delta: number) => {
    setTicketSelections(prev => {
      const existing = prev.find(s => s.ticketTypeId === ticketTypeId);
      const ticketType = event.ticket_types?.find(tt => tt.id === ticketTypeId);
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
      const addon = event.addons?.find(a => a.id === addonId);
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
          eventId: event.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
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

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-[#DDDDDD] p-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-[#5A7247]" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          You&apos;re Registered!
        </h3>
        <p className="text-[#555555] mb-6 max-w-md mx-auto">
          We&apos;ve sent a confirmation email to <strong>{formData.email}</strong> with all the event details.
        </p>
        <Button onClick={() => router.push("/events")} size="lg">
          Browse More Events
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
        {/* Ticket Types Selection */}
        {hasTicketTypes ? (
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
              <Ticket className="h-4 w-4 inline-block mr-2 text-[#C9A84C]" />
              Select Your Tickets
            </label>
            <div className="space-y-3">
              {event.ticket_types?.map((ticketType) => {
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
                      p-5 rounded-xl border-2 transition-all
                      ${quantity > 0 ? 'border-[#C9A84C] bg-[#FBF6E9]' : 'border-[#DDDDDD] bg-white hover:border-[#CCCCCC]'}
                      ${isSoldOut ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#1A1A1A] text-lg">{ticketType.name}</h4>
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
                          <p className="text-xs text-[#888888] mt-2">{available} remaining</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-xl text-[#1A1A1A]">
                          {ticketType.price > 0 ? `$${ticketType.price}` : 'Free'}
                        </p>
                        {!isSoldOut && (
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => updateTicketQuantity(ticketType.id, -1)}
                              className="w-9 h-9 rounded-lg bg-[#EEEEEE] hover:bg-[#DDDDDD] flex items-center justify-center transition-colors"
                              disabled={quantity === 0}
                            >
                              <Minus className="h-4 w-4 text-[#555555]" />
                            </button>
                            <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateTicketQuantity(ticketType.id, 1)}
                              className="w-9 h-9 rounded-lg bg-[#C9A84C] hover:bg-[#A68A2E] flex items-center justify-center transition-colors"
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
            <div className="flex items-center justify-between p-5 rounded-xl bg-[#FBF6E9] border border-[#E8D48B]">
              <div>
                <span className="font-medium text-[#1A1A1A]">General Admission</span>
                <p className="text-sm text-[#555555] mt-1">
                  {event.ticket_price && event.ticket_price > 0 ? `$${event.ticket_price} per ticket` : 'Free entry'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketSelections([{ ticketTypeId: "default", quantity: Math.max(1, (ticketSelections[0]?.quantity || 1) - 1) }])}
                  className="w-9 h-9 rounded-lg bg-[#EEEEEE] hover:bg-[#DDDDDD] flex items-center justify-center transition-colors"
                  disabled={(ticketSelections[0]?.quantity || 1) <= 1}
                >
                  <Minus className="h-4 w-4 text-[#555555]" />
                </button>
                <span className="w-10 text-center font-semibold text-lg">{ticketSelections[0]?.quantity || 1}</span>
                <button
                  type="button"
                  onClick={() => setTicketSelections([{ ticketTypeId: "default", quantity: Math.min(10, (ticketSelections[0]?.quantity || 1) + 1) }])}
                  className="w-9 h-9 rounded-lg bg-[#C9A84C] hover:bg-[#A68A2E] flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {hasAddons && totalTickets > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
              <Package className="h-4 w-4 inline-block mr-2 text-[#5A7247]" />
              Add-ons <span className="text-[#888888] font-normal">(optional)</span>
            </label>
            <div className="space-y-3">
              {event.addons?.map((addon) => {
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
                      p-5 rounded-xl border-2 transition-all
                      ${quantity > 0 ? 'border-[#5A7247] bg-[#EFF4EB]' : 'border-[#DDDDDD] bg-white hover:border-[#CCCCCC]'}
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
                        <p className="font-bold text-[#1A1A1A]">+${addon.price}</p>
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

        {/* Divider */}
        <div className="border-t border-[#EEEEEE] pt-6">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Your Information</h3>

          {/* Name Fields */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                required
                className="h-12"
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
                className="h-12"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
              className="h-12"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Phone <span className="text-[#888888] font-normal">(optional)</span>
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="h-12"
            />
          </div>

          {/* Dietary Restrictions for Movies on the Menu */}
          {event.event_type === "movies_on_the_menu" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Dietary Restrictions <span className="text-[#888888] font-normal">(optional)</span>
              </label>
              <Input
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                placeholder="Vegetarian, allergies, etc."
                className="h-12"
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
              className="h-12"
            />
          </div>
        </div>

        {/* Order Summary / Total */}
        <div className="border-t border-[#EEEEEE] pt-6">
          {grandTotal > 0 && (
            <div className="rounded-xl bg-[#1A1A1A] text-white p-5 mb-6 space-y-2">
              {ticketTotal > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>Tickets ({totalTickets})</span>
                  <span>${ticketTotal.toFixed(2)}</span>
                </div>
              )}
              {addonTotal > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>Add-ons</span>
                  <span>${addonTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-white/20">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Free event indicator */}
          {grandTotal === 0 && totalTickets > 0 && (
            <div className="flex items-center justify-center p-5 rounded-xl bg-[#EFF4EB] border border-[#5A7247] mb-6">
              <CheckCircle className="h-5 w-5 text-[#5A7247] mr-2" />
              <span className="font-semibold text-[#5A7247]">Free Event - No Payment Required</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || totalTickets === 0}
            className="w-full h-14 text-lg"
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
        </div>
      </form>
    </div>
  );
}
