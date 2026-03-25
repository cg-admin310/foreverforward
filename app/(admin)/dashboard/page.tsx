export const dynamic = "force-dynamic";

import Link from "next/link";
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

// Static dashboard - no data fetching to isolate the error
export default async function DashboardPage() {
  // Static test data
  const metrics = {
    newLeads: 6,
    leadsChange: 100,
    activeParticipants: 0,
    participantsChange: 0,
    mspClients: 2,
    clientsChange: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
  };

  const metricCards = [
    {
      title: "New Leads",
      value: metrics.newLeads,
      change: metrics.leadsChange
        ? { value: Math.abs(metrics.leadsChange), type: "increase" as const }
        : undefined,
      icon: Users,
    },
    {
      title: "Active Participants",
      value: metrics.activeParticipants,
      icon: GraduationCap,
      iconColor: "text-[#5A7247]",
      iconBg: "bg-[#EFF4EB]",
    },
    {
      title: "MSP Clients",
      value: metrics.mspClients,
      icon: Building2,
    },
    {
      title: "Monthly Revenue",
      value: "$0",
      icon: DollarSign,
      iconColor: "text-[#5A7247]",
      iconBg: "bg-[#EFF4EB]",
    },
  ];

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
        {metricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#DDDDDD]">
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A]">Recent Activity</h2>
            <Link href="/activity" className="text-sm text-[#C9A84C] hover:underline">
              View all
            </Link>
          </div>
          <div className="p-8 text-center text-[#888888]">
            <p>No recent activity</p>
            <p className="text-sm mt-1">Activity will appear here as you work</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Travis Alerts */}
          <div className="bg-white rounded-xl border border-[#DDDDDD]">
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#C9A84C]" />
                <h2 className="font-semibold text-[#1A1A1A]">Travis Alerts</h2>
              </div>
              <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-semibold rounded-full">
                0
              </span>
            </div>
            <div className="p-6 text-center text-[#888888]">
              <Bot className="h-8 w-8 mx-auto mb-2 text-[#5A7247]" />
              <p className="text-sm">All participants are on track!</p>
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
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-[#DDDDDD]">
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5A7247]" />
                <h2 className="font-semibold text-[#1A1A1A]">Upcoming Events</h2>
              </div>
            </div>
            <div className="p-6 text-center text-[#888888]">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-[#888888]" />
              <p className="text-sm">No upcoming events</p>
              <Link
                href="/events-admin/new"
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Create an event
              </Link>
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
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}
