"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { createEvent, updateEvent } from "@/lib/actions/events";
import type { Event, EventType } from "@/types/database";

interface EventFormProps {
  event?: Event;
  mode?: "create" | "edit";
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: "movies_on_the_menu", label: "Movies on the Menu" },
  { value: "workshop", label: "Workshop" },
  { value: "graduation", label: "Graduation" },
  { value: "community", label: "Community Event" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "other", label: "Other" },
];

export function EventForm({ event, mode = "create" }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    eventType: (event?.event_type as EventType) || "community",
    description: event?.description || "",
    shortDescription: event?.short_description || "",
    startDatetime: event?.start_datetime
      ? new Date(event.start_datetime).toISOString().slice(0, 16)
      : "",
    endDatetime: event?.end_datetime
      ? new Date(event.end_datetime).toISOString().slice(0, 16)
      : "",
    venueName: event?.venue_name || "",
    addressLine1: event?.address_line1 || "",
    city: event?.city || "Los Angeles",
    state: event?.state || "CA",
    isVirtual: event?.is_virtual || false,
    virtualLink: event?.virtual_link || "",
    capacity: event?.capacity?.toString() || "",
    ticketPrice: event?.ticket_price?.toString() || "0",
    isPublished: event?.is_published || false,
    featuredImageUrl: event?.featured_image_url || "",
    movieTitle: event?.movie_title || "",
    foodPairing: event?.food_pairing || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: mode === "create" ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createEvent({
          title: formData.title,
          slug: formData.slug,
          event_type: formData.eventType,
          description: formData.description || undefined,
          short_description: formData.shortDescription || undefined,
          start_datetime: new Date(formData.startDatetime).toISOString(),
          end_datetime: formData.endDatetime
            ? new Date(formData.endDatetime).toISOString()
            : undefined,
          venue_name: formData.venueName || undefined,
          address_line1: formData.addressLine1 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
          ticket_price: formData.ticketPrice
            ? parseFloat(formData.ticketPrice)
            : undefined,
          is_published: formData.isPublished,
          featured_image_url: formData.featuredImageUrl || undefined,
          movie_title: formData.movieTitle || undefined,
          food_pairing: formData.foodPairing || undefined,
        });

        if (result.success) {
          router.push("/events-admin");
          router.refresh();
        } else {
          setError(result.error || "Failed to create event");
        }
      } else if (event) {
        const result = await updateEvent(event.id, {
          title: formData.title,
          slug: formData.slug,
          event_type: formData.eventType,
          description: formData.description || null,
          short_description: formData.shortDescription || null,
          start_datetime: new Date(formData.startDatetime).toISOString(),
          end_datetime: formData.endDatetime
            ? new Date(formData.endDatetime).toISOString()
            : null,
          venue_name: formData.venueName || null,
          address_line1: formData.addressLine1 || null,
          city: formData.city || null,
          state: formData.state || null,
          is_virtual: formData.isVirtual,
          virtual_link: formData.virtualLink || null,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          ticket_price: formData.ticketPrice
            ? parseFloat(formData.ticketPrice)
            : null,
          is_published: formData.isPublished,
          featured_image_url: formData.featuredImageUrl || null,
          movie_title: formData.movieTitle || null,
          food_pairing: formData.foodPairing || null,
        });

        if (result.success) {
          router.push("/events-admin");
          router.refresh();
        } else {
          setError(result.error || "Failed to update event");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Event Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g., Movies on the Menu: Family Movie Night"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
              placeholder="movies-on-the-menu-march-2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.eventType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventType: e.target.value as EventType,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Short Description
            </label>
            <Input
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Brief description for cards and listings"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Full Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed event description..."
              rows={4}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload
              value={formData.featuredImageUrl}
              onChange={(url) =>
                setFormData({ ...formData, featuredImageUrl: url })
              }
              label="Featured Image"
              description="Upload an image for this event (displayed on event cards and detail pages)"
            />
          </div>
        </div>
      </div>

      {/* Movies on the Menu Specific */}
      {formData.eventType === "movies_on_the_menu" && (
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
          <h2 className="font-semibold text-[#1A1A1A] mb-4">Movies on the Menu Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Movie Title
              </label>
              <Input
                value={formData.movieTitle}
                onChange={(e) =>
                  setFormData({ ...formData, movieTitle: e.target.value })
                }
                placeholder="e.g., Black Panther, Soul, Coco..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Food Pairing / Menu Theme
              </label>
              <Textarea
                value={formData.foodPairing}
                onChange={(e) =>
                  setFormData({ ...formData, foodPairing: e.target.value })
                }
                placeholder="Describe the themed dinner menu..."
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Date & Time */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Date & Time</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Start Date & Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={formData.startDatetime}
              onChange={(e) =>
                setFormData({ ...formData, startDatetime: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              End Date & Time
            </label>
            <Input
              type="datetime-local"
              value={formData.endDatetime}
              onChange={(e) =>
                setFormData({ ...formData, endDatetime: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Location</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVirtual"
              checked={formData.isVirtual}
              onChange={(e) =>
                setFormData({ ...formData, isVirtual: e.target.checked })
              }
              className="h-4 w-4 rounded border-[#DDDDDD] text-[#C9A84C] focus:ring-[#C9A84C]"
            />
            <label htmlFor="isVirtual" className="text-sm text-[#555555]">
              This is a virtual event
            </label>
          </div>

          {formData.isVirtual ? (
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Virtual Event Link
              </label>
              <Input
                value={formData.virtualLink}
                onChange={(e) =>
                  setFormData({ ...formData, virtualLink: e.target.value })
                }
                placeholder="https://zoom.us/j/..."
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Venue Name
                </label>
                <Input
                  value={formData.venueName}
                  onChange={(e) =>
                    setFormData({ ...formData, venueName: e.target.value })
                  }
                  placeholder="e.g., Forever Forward Community Center"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Address
                </label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine1: e.target.value })
                  }
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  City
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  State
                </label>
                <Input
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="CA"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tickets & Capacity */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Tickets & Capacity</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Capacity
            </label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              placeholder="Leave empty for unlimited"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Ticket Price ($)
            </label>
            <Input
              type="number"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
              placeholder="0 for free"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Publishing</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="h-4 w-4 rounded border-[#DDDDDD] text-[#C9A84C] focus:ring-[#C9A84C]"
          />
          <label htmlFor="isPublished" className="text-sm text-[#555555]">
            Publish this event (make it visible on the public website)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Event"
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
