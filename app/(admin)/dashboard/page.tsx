export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Activity,
  ArrowRight,
} from "lucide-react";
import {
  getDashboardMetrics,
  getRecentActivity,
  getUpcomingEvents,
  getTravisAlerts,
} from "@/lib/actions/dashboard";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel
  const [metricsResult, activityResult, eventsResult, alertsResult] =
    await Promise.all([
      getDashboardMetrics(),
      getRecentActivity(5),
      getUpcomingEvents(3),
      getTravisAlerts(),
    ]);

  const metrics = metricsResult.data;
  const activities = activityResult.data || [];
  const events = eventsResult.data || [];
  const alerts = alertsResult.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#555555]">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Leads */}
        <div className="bg-white rounded-xl p-5 border border-[#DDDDDD] hover:shadow-md hover:border-t-[3px] hover:border-t-[#C9A84C] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#888888]">New Leads</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">
                {metrics?.newLeads || 0}
              </p>
              {metrics?.leadsChange != null && metrics.leadsChange !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {metrics.leadsChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      metrics.leadsChange > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {Math.abs(metrics.leadsChange)}%
                  </span>
                  <span className="text-xs text-[#888888]">vs last month</span>
                </div>
              )}
            </div>
            <div className="p-2 bg-[#FBF6E9] rounded-lg">
              <Users className="h-5 w-5 text-[#C9A84C]" />
            </div>
          </div>
        </div>

        {/* Active Participants */}
        <div className="bg-white rounded-xl p-5 border border-[#DDDDDD] hover:shadow-md hover:border-t-[3px] hover:border-t-[#5A7247] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#888888]">Active Participants</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">
                {metrics?.activeParticipants || 0}
              </p>
              <p className="text-xs text-[#888888] mt-2">Enrolled & active</p>
            </div>
            <div className="p-2 bg-[#EFF4EB] rounded-lg">
              <GraduationCap className="h-5 w-5 text-[#5A7247]" />
            </div>
          </div>
        </div>

        {/* MSP Clients */}
        <div className="bg-white rounded-xl p-5 border border-[#DDDDDD] hover:shadow-md hover:border-t-[3px] hover:border-t-[#C9A84C] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#888888]">MSP Clients</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">
                {metrics?.mspClients || 0}
              </p>
              <p className="text-xs text-[#888888] mt-2">Active pipeline</p>
            </div>
            <div className="p-2 bg-[#FBF6E9] rounded-lg">
              <Building2 className="h-5 w-5 text-[#C9A84C]" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl p-5 border border-[#DDDDDD] hover:shadow-md hover:border-t-[3px] hover:border-t-[#5A7247] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#888888]">Monthly Revenue</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">
                {formatCurrency(metrics?.monthlyRevenue || 0)}
              </p>
              <p className="text-xs text-[#888888] mt-2">From active clients</p>
            </div>
            <div className="p-2 bg-[#EFF4EB] rounded-lg">
              <DollarSign className="h-5 w-5 text-[#5A7247]" />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Travis Alerts */}
        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#C9A84C]" />
              <h2 className="font-semibold text-[#1A1A1A]">Travis Alerts</h2>
            </div>
            {alerts.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {alerts.length} needs attention
              </span>
            )}
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-[#888888]">
                <p className="text-sm">No alerts at this time</p>
              </div>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <Link
                  key={alert.id}
                  href={`/program-management/participants/${alert.participant_id}`}
                  className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {alert.participant_name}
                      </p>
                      <p className="text-xs text-[#888888] truncate">
                        {alert.issue}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {alerts.length > 3 && (
            <div className="p-3 border-t border-[#DDDDDD]">
              <Link
                href="/travis"
                className="text-sm text-[#C9A84C] hover:underline flex items-center justify-center gap-1"
              >
                View all alerts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
          <div className="p-4 border-b border-[#DDDDDD] flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#5A7247]" />
            <h2 className="font-semibold text-[#1A1A1A]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-[#888888]">
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <p className="text-sm text-[#1A1A1A]">{activity.description}</p>
                  <p className="text-xs text-[#888888] mt-1">
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#C9A84C]" />
              <h2 className="font-semibold text-[#1A1A1A]">Upcoming Events</h2>
            </div>
            <Link
              href="/events-admin"
              className="text-sm text-[#C9A84C] hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {events.length === 0 ? (
              <div className="p-6 text-center text-[#888888]">
                <p className="text-sm">No upcoming events</p>
              </div>
            ) : (
              events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events-admin/${event.id}`}
                  className="block p-4 hover:bg-[#FAFAF8] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-[#888888] mt-1">
                        {formatEventDate(event.start_datetime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#5A7247]">
                        {event.tickets_sold}/{event.capacity}
                      </p>
                      <p className="text-xs text-[#888888]">sold</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/leads/new"
          className="bg-white rounded-xl p-4 border border-[#DDDDDD] hover:shadow-md hover:border-[#C9A84C] transition-all text-center"
        >
          <Users className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1A1A1A]">Add Lead</p>
        </Link>
        <Link
          href="/program-management/participants"
          className="bg-white rounded-xl p-4 border border-[#DDDDDD] hover:shadow-md hover:border-[#5A7247] transition-all text-center"
        >
          <GraduationCap className="h-6 w-6 text-[#5A7247] mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1A1A1A]">Participants</p>
        </Link>
        <Link
          href="/clients/new"
          className="bg-white rounded-xl p-4 border border-[#DDDDDD] hover:shadow-md hover:border-[#C9A84C] transition-all text-center"
        >
          <Building2 className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1A1A1A]">New Client</p>
        </Link>
        <Link
          href="/events-admin/new"
          className="bg-white rounded-xl p-4 border border-[#DDDDDD] hover:shadow-md hover:border-[#5A7247] transition-all text-center"
        >
          <Calendar className="h-6 w-6 text-[#5A7247] mx-auto mb-2" />
          <p className="text-sm font-medium text-[#1A1A1A]">Create Event</p>
        </Link>
      </div>
    </div>
  );
}
