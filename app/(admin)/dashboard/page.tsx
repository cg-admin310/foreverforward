"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight,
  Bell,
  Bot,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/admin/metric-card";

// Sample data - would come from Supabase
const metrics = [
  {
    title: "New Leads",
    value: 24,
    change: { value: 12, type: "increase" as const },
    icon: Users,
  },
  {
    title: "Active Participants",
    value: 87,
    change: { value: 8, type: "increase" as const },
    icon: GraduationCap,
    iconColor: "text-[#5A7247]",
    iconBg: "bg-[#EFF4EB]",
  },
  {
    title: "MSP Clients",
    value: 12,
    change: { value: 2, type: "increase" as const },
    icon: Building2,
  },
  {
    title: "Monthly Revenue",
    value: "$28.5K",
    change: { value: 15, type: "increase" as const },
    icon: DollarSign,
    iconColor: "text-[#5A7247]",
    iconBg: "bg-[#EFF4EB]",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "lead",
    message: "New program lead: Marcus Johnson",
    time: "5 minutes ago",
    icon: Users,
  },
  {
    id: 2,
    type: "participant",
    message: "James Williams completed Week 4",
    time: "1 hour ago",
    icon: GraduationCap,
  },
  {
    id: 3,
    type: "client",
    message: "Proposal sent to Hope Community Center",
    time: "2 hours ago",
    icon: FileText,
  },
  {
    id: 4,
    type: "travis",
    message: "Travis escalation: Anthony Brown needs support",
    time: "3 hours ago",
    icon: Bot,
    urgent: true,
  },
  {
    id: 5,
    type: "payment",
    message: "Invoice #1234 paid by LA Youth Services",
    time: "5 hours ago",
    icon: DollarSign,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Movies on the Menu: Black Panther",
    date: "Mar 28, 2026",
    attendees: 45,
  },
  {
    id: 2,
    title: "Father Forward Cohort 12 Graduation",
    date: "Apr 5, 2026",
    attendees: 28,
  },
  {
    id: 3,
    title: "Tech-Ready Youth Info Session",
    date: "Apr 10, 2026",
    attendees: 15,
  },
];

const travisAlerts = [
  {
    id: 1,
    participant: "Anthony Brown",
    issue: "Expressed frustration with coursework",
    severity: "medium",
    time: "3 hours ago",
  },
  {
    id: 2,
    participant: "DeShawn Mitchell",
    issue: "Missed 2 consecutive check-ins",
    severity: "high",
    time: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
          <p className="text-[#555555]">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/reports">View Reports</Link>
          </Button>
          <Button asChild>
            <Link href="/leads/new">Add Lead</Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A]">Recent Activity</h2>
            <Link
              href="/activity"
              className="text-sm text-[#C9A84C] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 flex items-start gap-3 hover:bg-[#FAFAF8] transition-colors ${
                  activity.urgent ? "bg-red-50" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.urgent
                      ? "bg-red-100 text-red-600"
                      : "bg-[#FBF6E9] text-[#C9A84C]"
                  }`}
                >
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">{activity.message}</p>
                  <p className="text-xs text-[#888888] mt-1">{activity.time}</p>
                </div>
                {activity.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    Action needed
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Travis Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD]"
          >
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#C9A84C]" />
                <h2 className="font-semibold text-[#1A1A1A]">Travis Alerts</h2>
              </div>
              <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-semibold rounded-full">
                {travisAlerts.length}
              </span>
            </div>
            <div className="divide-y divide-[#DDDDDD]">
              {travisAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/travis/alerts/${alert.id}`}
                  className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-[#1A1A1A]">
                      {alert.participant}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-[#555555]">{alert.issue}</p>
                  <p className="text-xs text-[#888888] mt-1">{alert.time}</p>
                </Link>
              ))}
            </div>
            <div className="p-3 border-t border-[#DDDDDD]">
              <Link
                href="/travis"
                className="flex items-center justify-center gap-1 text-sm text-[#C9A84C] hover:underline"
              >
                Open Travis Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-[#DDDDDD]"
          >
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5A7247]" />
                <h2 className="font-semibold text-[#1A1A1A]">Upcoming Events</h2>
              </div>
            </div>
            <div className="divide-y divide-[#DDDDDD]">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events-admin/${event.id}`}
                  className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                >
                  <p className="font-medium text-sm text-[#1A1A1A]">
                    {event.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#888888]">{event.date}</span>
                    <span className="text-xs text-[#555555]">
                      {event.attendees} registered
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-3 border-t border-[#DDDDDD]">
              <Link
                href="/events-admin"
                className="flex items-center justify-center gap-1 text-sm text-[#C9A84C] hover:underline"
              >
                Manage Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { title: "Generate Proposal", href: "/documents/new?type=proposal", icon: FileText },
          { title: "Schedule Event", href: "/events-admin/new", icon: Calendar },
          { title: "Send Email Campaign", href: "/emails/new", icon: Bell },
          { title: "View Pipeline", href: "/clients", icon: TrendingUp },
        ].map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-md transition-all group"
          >
            <div className="p-2 rounded-lg bg-[#FBF6E9] text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors">
              <action.icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-[#1A1A1A]">{action.title}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
