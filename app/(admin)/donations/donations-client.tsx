"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  Download,
  Mail,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  Gift,
  ExternalLink,
  Users,
  Award,
  Star,
  Crown,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  markDonationAcknowledged,
  exportDonationsToCSV,
} from "@/lib/actions/donations";
import { Donation, DonorTier, ImpactMetric, DonationAllocation } from "@/types/database";

interface DonorSummary {
  id: string;
  name: string;
  email: string;
  totalGiven: number;
  donationCount: number;
  lastDonation: string;
  type: "one_time" | "recurring";
  recurringAmount: number | null;
  acknowledged: boolean;
  tier?: DonorTier;
}

interface DonorTierStats {
  founding: number;
  champion: number;
  supporter: number;
  friend: number;
  total: number;
}

interface DonationStats {
  totalThisMonth: number;
  totalThisYear: number;
  recurringDonors: number;
  pendingAcknowledgments: number;
  totalDonors?: number;
  averageDonation?: number;
}

interface PendingAction {
  type: "thank_you" | "impact_update" | "milestone" | "tier_upgrade";
  donorId?: string;
  donationId?: string;
  email: string;
  name: string;
  description: string;
  dueDate?: string;
}

interface DonationsClientProps {
  stats: DonationStats;
  donors: DonorSummary[];
  recentDonations: Donation[];
  tierStats?: DonorTierStats;
  impactMetrics?: ImpactMetric[];
  allocation?: DonationAllocation | null;
  pendingActions?: PendingAction[];
}

const tierConfig: Record<
  DonorTier,
  { label: string; color: string; bg: string; icon: typeof Crown; threshold: string }
> = {
  founding: {
    label: "Founding Partner",
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: Crown,
    threshold: "$10,000+/year",
  },
  champion: {
    label: "Champion",
    color: "text-[#C9A84C]",
    bg: "bg-[#FBF6E9]",
    icon: Award,
    threshold: "$2,500+/year",
  },
  supporter: {
    label: "Supporter",
    color: "text-[#5A7247]",
    bg: "bg-[#EFF4EB]",
    icon: Star,
    threshold: "$500+/year",
  },
  friend: {
    label: "Friend",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: Heart,
    threshold: "<$500/year",
  },
};

function calculateTier(ytdGiven: number): DonorTier {
  if (ytdGiven >= 10000) return "founding";
  if (ytdGiven >= 2500) return "champion";
  if (ytdGiven >= 500) return "supporter";
  return "friend";
}

export function DonationsClient({
  stats,
  donors,
  recentDonations,
  tierStats,
  impactMetrics,
  allocation,
  pendingActions,
}: DonationsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [isAcknowledging, setIsAcknowledging] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportDonationsToCSV();
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `donations-${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(result.error || "Failed to export donations");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export donations");
    } finally {
      setIsExporting(false);
    }
  };

  // Add tier to donors based on totalGiven
  const donorsWithTier = donors.map((donor) => ({
    ...donor,
    tier: donor.tier || calculateTier(donor.totalGiven),
  }));

  const filteredDonors = donorsWithTier.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || donor.type === typeFilter;
    const matchesTier = tierFilter === "all" || donor.tier === tierFilter;
    return matchesSearch && matchesType && matchesTier;
  });

  const handleAcknowledge = async (donorId: string) => {
    setIsAcknowledging(donorId);
    try {
      await markDonationAcknowledged(donorId);
      router.refresh();
    } catch (error) {
      console.error("Failed to acknowledge donation:", error);
    } finally {
      setIsAcknowledging(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayedActions = showAllActions
    ? pendingActions
    : pendingActions?.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Donations</h1>
          <p className="text-[#555555]">
            Manage donors, track contributions, and demonstrate impact
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/impact">
              <BarChart3 className="h-4 w-4 mr-2" />
              Impact Dashboard
            </Link>
          </Button>
          <Button asChild>
            <a href="/get-involved/donate" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Donate Page
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            label: "This Month",
            value: `$${stats.totalThisMonth.toLocaleString()}`,
            icon: DollarSign,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Year to Date",
            value: `$${stats.totalThisYear.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Recurring",
            value: stats.recurringDonors,
            icon: RefreshCw,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Donors",
            value: stats.totalDonors || donorsWithTier.length,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Avg Donation",
            value: `$${stats.averageDonation || 0}`,
            icon: BarChart3,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Pending Thanks",
            value: stats.pendingAcknowledgments,
            icon: Heart,
            color: "text-pink-600",
            bg: "bg-pink-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#888888]">{stat.label}</p>
                <p className="text-xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Donor Tiers & Allocation Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donor Tiers Pyramid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-[#DDDDDD] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">Donor Tiers</h2>
            <Users className="h-5 w-5 text-[#888888]" />
          </div>
          <div className="space-y-3">
            {(["founding", "champion", "supporter", "friend"] as DonorTier[]).map((tier) => {
              const config = tierConfig[tier];
              const count = tierStats?.[tier] || 0;
              const percentage = tierStats?.total
                ? Math.round((count / tierStats.total) * 100)
                : 0;
              const IconComponent = config.icon;

              return (
                <div key={tier} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <IconComponent className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1A1A1A]">
                        {config.label}
                      </span>
                      <span className="text-sm text-[#888888]">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.bg} transition-all`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#888888] mt-4 text-center">
            Total: {tierStats?.total || donorsWithTier.length} donors
          </p>
        </motion.div>

        {/* Fund Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-[#DDDDDD] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">Fund Allocation</h2>
            <PieChart className="h-5 w-5 text-[#888888]" />
          </div>
          {allocation ? (
            <div className="space-y-3">
              {[
                { label: "Programs", percent: allocation.programs_percent, color: "bg-[#5A7247]" },
                { label: "Operations", percent: allocation.operations_percent, color: "bg-[#C9A84C]" },
                { label: "Events", percent: allocation.events_percent, color: "bg-blue-500" },
                { label: "Admin", percent: allocation.admin_percent, color: "bg-gray-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#555555]">{item.label}</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <PieChart className="h-8 w-8 text-[#DDDDDD] mb-2" />
              <p className="text-sm text-[#888888]">No allocation data</p>
              <p className="text-xs text-[#888888]">Set up fund allocation to show donors</p>
            </div>
          )}
          <p className="text-xs text-[#888888] mt-4 text-center">
            {allocation ? `Period: ${formatDate(allocation.period_start)} - ${formatDate(allocation.period_end)}` : "Configure in settings"}
          </p>
        </motion.div>

        {/* Pending Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#DDDDDD] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">Pending Actions</h2>
            <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
          </div>
          {pendingActions && pendingActions.length > 0 ? (
            <>
              <div className="space-y-3">
                {displayedActions?.map((action, index) => {
                  const actionIcons = {
                    thank_you: { icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
                    impact_update: { icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
                    milestone: { icon: Award, color: "text-[#C9A84C]", bg: "bg-[#FBF6E9]" },
                    tier_upgrade: { icon: TrendingUp, color: "text-[#5A7247]", bg: "bg-[#EFF4EB]" },
                  };
                  const config = actionIcons[action.type];
                  const IconComponent = config.icon;

                  return (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#FAFAF8] transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <IconComponent className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">
                          {action.name}
                        </p>
                        <p className="text-xs text-[#888888] truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {pendingActions.length > 3 && (
                <button
                  onClick={() => setShowAllActions(!showAllActions)}
                  className="flex items-center justify-center w-full gap-1 mt-3 text-sm text-[#C9A84C] hover:underline"
                >
                  {showAllActions ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show all {pendingActions.length} <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-[#5A7247] mb-2" />
              <p className="text-sm text-[#888888]">All caught up!</p>
              <p className="text-xs text-[#888888]">No pending donor actions</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donors List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                <Input
                  placeholder="Search donors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Type filter */}
                {["all", "one_time", "recurring"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      typeFilter === type
                        ? "bg-[#C9A84C] text-[#1A1A1A]"
                        : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                    }`}
                  >
                    {type === "all" ? "All" : type === "one_time" ? "One-time" : "Recurring"}
                  </button>
                ))}
                {/* Tier filter */}
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-[#DDDDDD] bg-white text-[#555555] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="all">All Tiers</option>
                  <option value="founding">Founding</option>
                  <option value="champion">Champion</option>
                  <option value="supporter">Supporter</option>
                  <option value="friend">Friend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Donors Table */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Donor
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Tier
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Total Given
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Last Gift
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Gift className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                        <p className="text-[#888888]">
                          {donors.length === 0
                            ? "No donations yet. Share your donate page to get started!"
                            : "No donors match your search."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredDonors.map((donor) => {
                      const tierCfg = tierConfig[donor.tier];
                      const TierIcon = tierCfg.icon;

                      return (
                        <motion.tr
                          key={donor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                                {donor.name
                                  .split(" ")
                                  .map((n) => n.charAt(0))
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-[#1A1A1A]">{donor.name}</p>
                                <p className="text-xs text-[#888888]">{donor.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${tierCfg.bg} ${tierCfg.color}`}
                            >
                              <TierIcon className="h-3 w-3" />
                              {tierCfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-[#5A7247]">
                              ${donor.totalGiven.toLocaleString()}
                            </p>
                            <p className="text-xs text-[#888888]">
                              {donor.donationCount} gift{donor.donationCount !== 1 ? "s" : ""}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                donor.type === "recurring"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {donor.type === "recurring" && <RefreshCw className="h-3 w-3" />}
                              {donor.type === "recurring" ? "Recurring" : "One-time"}
                            </span>
                            {donor.recurringAmount && (
                              <p className="text-xs text-[#888888] mt-0.5">
                                ${donor.recurringAmount}/mo
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#888888]">
                              {formatDate(donor.lastDonation)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              {!donor.acknowledged && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAcknowledge(donor.id)}
                                  disabled={isAcknowledging === donor.id}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  {isAcknowledging === donor.id ? "..." : "Thank"}
                                </Button>
                              )}
                              <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                                <Mail className="h-4 w-4 text-[#888888]" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Showing {filteredDonors.length} of {donors.length} donors
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 bg-[#C9A84C] text-[#1A1A1A] rounded text-sm font-medium">
                  1
                </span>
                <Button variant="outline" size="sm" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD]"
          >
            <div className="p-4 border-b border-[#DDDDDD]">
              <h2 className="font-semibold text-[#1A1A1A]">Recent Donations</h2>
            </div>
            <div className="divide-y divide-[#DDDDDD]">
              {recentDonations.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                  <p className="text-sm text-[#888888]">No donations yet</p>
                </div>
              ) : (
                recentDonations.slice(0, 8).map((donation) => (
                  <div key={donation.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-[#1A1A1A]">
                        {donation.donor_first_name} {donation.donor_last_name}
                      </span>
                      <span className="font-semibold text-[#5A7247]">${donation.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#888888]">
                        {formatDate(donation.created_at)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          donation.frequency === "monthly"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {donation.frequency === "monthly" ? "recurring" : "one-time"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentDonations.length > 0 && (
              <div className="p-3 border-t border-[#DDDDDD]">
                <Button variant="ghost" className="w-full text-sm text-[#C9A84C]">
                  View All Donations
                </Button>
              </div>
            )}
          </motion.div>

          {/* Quick Impact Stats */}
          {impactMetrics && impactMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-xl p-6 text-white"
            >
              <h2 className="font-semibold mb-4">Impact at a Glance</h2>
              <div className="grid grid-cols-2 gap-4">
                {impactMetrics.filter((m) => m.metric_type === "program").slice(0, 4).map((metric) => (
                  <div key={metric.id}>
                    <p className="text-2xl font-bold text-[#C9A84C]">
                      {metric.metric_value.toLocaleString()}
                      {metric.metric_unit === "percentage" && "%"}
                    </p>
                    <p className="text-xs text-white/70 capitalize">
                      {metric.metric_name.replace(/_/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard/impact"
                className="inline-flex items-center gap-1 mt-4 text-sm text-[#C9A84C] hover:underline"
              >
                View Full Impact Report
                <ExternalLink className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
