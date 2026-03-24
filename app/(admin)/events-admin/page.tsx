"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  Users,
  Ticket,
  DollarSign,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Event {
  id: string;
  title: string;
  type: "movies_on_menu" | "graduation" | "info_session" | "workshop" | "other";
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  checked_in: number;
  ticket_price: number;
  revenue: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Movies on the Menu: Black Panther",
    type: "movies_on_menu",
    date: "2026-03-28",
    time: "6:00 PM",
    location: "Forever Forward Center",
    capacity: 50,
    registered: 45,
    checked_in: 0,
    ticket_price: 15,
    revenue: 675,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Father Forward Cohort 12 Graduation",
    type: "graduation",
    date: "2026-04-05",
    time: "2:00 PM",
    location: "Forever Forward Center",
    capacity: 100,
    registered: 28,
    checked_in: 0,
    ticket_price: 0,
    revenue: 0,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Tech-Ready Youth Info Session",
    type: "info_session",
    date: "2026-04-10",
    time: "5:30 PM",
    location: "Virtual (Zoom)",
    capacity: 30,
    registered: 15,
    checked_in: 0,
    ticket_price: 0,
    revenue: 0,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Movies on the Menu: Spider-Verse",
    type: "movies_on_menu",
    date: "2026-02-28",
    time: "6:00 PM",
    location: "Forever Forward Center",
    capacity: 50,
    registered: 50,
    checked_in: 47,
    ticket_price: 15,
    revenue: 750,
    status: "completed",
  },
];

const stats = {
  upcoming: sampleEvents.filter((e) => e.status === "upcoming").length,
  total_registered: sampleEvents.reduce((sum, e) => sum + e.registered, 0),
  total_revenue: sampleEvents.reduce((sum, e) => sum + e.revenue, 0),
  avg_attendance: 94,
};

export default function EventsAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = sampleEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movies_on_menu":
        return Film;
      case "graduation":
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "movies_on_menu":
        return "bg-purple-100 text-purple-700";
      case "graduation":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "info_session":
        return "bg-blue-100 text-blue-700";
      case "workshop":
        return "bg-[#FBF6E9] text-[#C9A84C]";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Events Manager</h1>
          <p className="text-[#555555]">
            Manage events, track registrations, and check-ins
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Upcoming Events",
            value: stats.upcoming,
            icon: Calendar,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Total Registered",
            value: stats.total_registered,
            icon: Users,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Total Revenue",
            value: `$${stats.total_revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Avg Attendance",
            value: `${stats.avg_attendance}%`,
            icon: Ticket,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#888888]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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

      {/* Events Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event, index) => {
          const TypeIcon = getTypeIcon(event.type);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      event.type
                    )}`}
                  >
                    <TypeIcon className="h-3 w-3" />
                    {event.type.replace(/_/g, " ")}
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
                <h3 className="font-semibold text-[#1A1A1A] mb-3">{event.title}</h3>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <Calendar className="h-4 w-4 text-[#888888]" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <Clock className="h-4 w-4 text-[#888888]" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <MapPin className="h-4 w-4 text-[#888888]" />
                    {event.location}
                  </div>
                </div>

                {/* Registration */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#888888]">Registration</span>
                    <span className="text-[#555555]">
                      {event.registered}/{event.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5A7247] rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Revenue & Price */}
                {event.ticket_price > 0 && (
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Attendees
                  </Button>
                  <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                    <Edit className="h-4 w-4 text-[#888888]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                    <Eye className="h-4 w-4 text-[#888888]" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
