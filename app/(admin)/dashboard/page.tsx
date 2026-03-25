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
import {
  getDashboardMetrics,
  getRecentActivity,
  getUpcomingEvents,
  getTravisAlerts,
  type DashboardMetrics,
  type Activity,
  type UpcomingEvent,
  type TravisAlert,
} from "@/lib/actions/dashboard";

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } catch {
    return "Unknown";
  }
}

function formatCurrency(amount: number): string {
  try {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  } catch {
    return "$0";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "lead_created":
    case "lead_updated":
      return Users;
    case "participant_enrolled":
    case "participant_progress":
      return GraduationCap;
    case "client_created":
    case "proposal_sent":
      return FileText;
    case "payment_received":
      return DollarSign;
    case "escalation":
      return Bot;
    default:
      return FileText;
  }
}

// Default values to prevent crashes
const defaultMetrics: DashboardMetrics = {
  newLeads: 0,
  leadsChange: 0,
  activeParticipants: 0,
  participantsChange: 0,
  mspClients: 0,
  clientsChange: 0,
  monthlyRevenue: 0,
  revenueChange: 0,
};

export default async function DashboardPage() {
  // Fetch all dashboard data with individual error handling
  let metrics: DashboardMetrics = defaultMetrics;
  let activities: Activity[] = [];
  let events: UpcomingEvent[] = [];
  let alerts: TravisAlert[] = [];

  // Fetch metrics
  try {
    const result = await getDashboardMetrics();
    if (result.success && result.data) {
      metrics = result.data;
    }
  } catch (e) {
    console.error("Dashboard: metrics fetch failed:", e);
  }

  // Fetch activities
  try {
    const result = await getRecentActivity(5);
    if (result.success && result.data) {
      activities = result.data;
    }
  } catch (e) {
    console.error("Dashboard: activities fetch failed:", e);
  }

  // Fetch events
  try {
    const result = await getUpcomingEvents(3);
    if (result.success && result.data) {
      events = result.data;
    }
  } catch (e) {
    console.error("Dashboard: events fetch failed:", e);
  }

  // Fetch alerts
  try {
    const result = await getTravisAlerts();
    if (result.success && result.data) {
      alerts = result.data;
    }
  } catch (e) {
    console.error("Dashboard: alerts fetch failed:", e);
  }

  const metricCards = [
    {
      title: "New Leads",
      value: metrics.newLeads,
      change: metrics.leadsChange
        ? { value: Math.abs(metrics.leadsChange), type: metrics.leadsChange >= 0 ? "increase" as const : "decrease" as const }
        : undefined,
      icon: Users,
    },
    {
      title: "Active Participants",
      value: metrics.activeParticipants,
      change: metrics.participantsChange
        ? { value: Math.abs(metrics.participantsChange), type: metrics.participantsChange >= 0 ? "increase" as const : "decrease" as const }
        : undefined,
      icon: GraduationCap,
      iconColor: "text-[#5A7247]",
      iconBg: "bg-[#EFF4EB]",
    },
    {
      title: "MSP Clients",
      value: metrics.mspClients,
      change: metrics.clientsChange
        ? { value: Math.abs(metrics.clientsChange), type: metrics.clientsChange >= 0 ? "increase" as const : "decrease" as const }
        : undefined,
      icon: Building2,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(metrics.monthlyRevenue),
      change: metrics.revenueChange
        ? { value: Math.abs(metrics.revenueChange), type: metrics.revenueChange >= 0 ? "increase" as const : "decrease" as const }
        : undefined,
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
            <Link
              href="/activity"
              className="text-sm text-[#C9A84C] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-[#888888]">
                <p>No recent activity</p>
                <p className="text-sm mt-1">Activity will appear here as you work</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type);
                const isUrgent = activity.activity_type === "escalation";
                return (
                  <div
                    key={activity.id}
                    className={`p-4 flex items-start gap-3 hover:bg-[#FAFAF8] transition-colors ${
                      isUrgent ? "bg-red-50" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isUrgent
                          ? "bg-red-100 text-red-600"
                          : "bg-[#FBF6E9] text-[#C9A84C]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1A1A1A]">{activity.description}</p>
                      <p className="text-xs text-[#888888] mt-1">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                    {isUrgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        Action needed
                      </span>
                    )}
                  </div>
                );
              })
            )}
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
                {alerts.length}
              </span>
            </div>
            <div className="divide-y divide-[#DDDDDD]">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-[#888888]">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-[#5A7247]" />
                  <p className="text-sm">All participants are on track!</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/program-management/participants/${alert.participant_id}`}
                    className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[#1A1A1A]">
                        {alert.participant_name}
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
                    <p className="text-xs text-[#888888] mt-1">
                      {formatTimeAgo(alert.created_at)}
                    </p>
                  </Link>
                ))
              )}
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
            <div className="divide-y divide-[#DDDDDD]">
              {events.length === 0 ? (
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
              ) : (
                events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events-admin/${event.id}`}
                    className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                  >
                    <p className="font-medium text-sm text-[#1A1A1A]">
                      {event.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#888888]">
                        {new Date(event.start_datetime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-[#555555]">
                        {event.tickets_sold || 0} registered
                      </span>
                    </div>
                  </Link>
                ))
              )}
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
