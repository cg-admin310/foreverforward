"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Search,
  Users,
  MapPin,
  Clock,
  Eye,
  Edit,
  Film,
  CheckCircle,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminEventDisplay } from "@/lib/actions/events";

interface EventsGridProps {
  initialEvents: AdminEventDisplay[];
}

export function EventsGrid({ initialEvents }: EventsGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movies_on_the_menu":
        return Film;
      case "graduation":
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "movies_on_the_menu":
        return "bg-purple-100 text-purple-700";
      case "graduation":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "workshop":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "community":
        return "bg-blue-100 text-blue-700";
      case "fundraiser":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "live":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "upcoming", "live", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-12 text-center">
          <CalendarPlus className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            {searchQuery || statusFilter !== "all" ? "No events found" : "No events yet"}
          </h3>
          <p className="text-[#888888]">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters or search query"
              : "Create your first event to get started"}
          </p>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const TypeIcon = getTypeIcon(event.event_type);
            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all cursor-pointer"
                onClick={() => router.push(`/events-admin/${event.id}`)}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        event.event_type
                      )}`}
                    >
                      <TypeIcon className="h-3 w-3" />
                      {event.event_type.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-[#1A1A1A] mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#555555]">
                      <Calendar className="h-4 w-4 text-[#888888]" />
                      {new Date(event.start_datetime).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#555555]">
                      <Clock className="h-4 w-4 text-[#888888]" />
                      {formatTime(event.start_datetime)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#555555]">
                      <MapPin className="h-4 w-4 text-[#888888]" />
                      {event.is_virtual ? "Virtual Event" : event.venue_name || "TBD"}
                    </div>
                  </div>

                  {/* Registration */}
                  {event.capacity && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#888888]">Registration</span>
                        <span className="text-[#555555]">
                          {event.tickets_sold || 0}/{event.capacity}
                        </span>
                      </div>
                      <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A7247] rounded-full"
                          style={{
                            width: `${((event.tickets_sold || 0) / event.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Revenue & Price */}
                  {event.ticket_price && event.ticket_price > 0 && (
                    <div className="flex items-center justify-between p-3 bg-[#FAFAF8] rounded-lg mb-4">
                      <div>
                        <p className="text-xs text-[#888888]">Ticket Price</p>
                        <p className="font-semibold text-[#1A1A1A]">${event.ticket_price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#888888]">Revenue</p>
                        <p className="font-semibold text-[#5A7247]">
                          ${event.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/events-admin/${event.id}/attendees`);
                      }}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Attendees
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/events-admin/${event.id}/edit`);
                      }}
                      className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                    >
                      <Edit className="h-4 w-4 text-[#888888]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/events/${event.id}`, "_blank");
                      }}
                      className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                    >
                      <Eye className="h-4 w-4 text-[#888888]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
