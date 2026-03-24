export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Calendar,
  Plus,
  Users,
  Ticket,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminEventsDisplay, getEventsStats } from "@/lib/actions/events";
import { EventsGrid } from "./events-grid";

export default async function EventsAdminPage() {
  // Fetch events and stats in parallel
  const [eventsResult, statsResult] = await Promise.all([
    getAdminEventsDisplay(),
    getEventsStats(),
  ]);

  const events = eventsResult.data || [];
  const stats = statsResult.data;

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
        <Button asChild>
          <Link href="/events-admin/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Upcoming Events",
            value: stats?.upcoming || 0,
            icon: Calendar,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Total Registered",
            value: stats?.totalRegistered || 0,
            icon: Users,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Total Revenue",
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Avg Attendance",
            value: `${stats?.avgAttendance || 0}%`,
            icon: Ticket,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
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
          </div>
        ))}
      </div>

      {/* Events Grid (Client Component for interactivity) */}
      <EventsGrid initialEvents={events} />
    </div>
  );
}
