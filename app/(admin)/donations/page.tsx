"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  Download,
  User,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Donor {
  id: string;
  name: string;
  email: string;
  total_given: number;
  donation_count: number;
  last_donation: string;
  type: "one-time" | "recurring";
  recurring_amount: number | null;
  acknowledged: boolean;
}

const sampleDonors: Donor[] = [
  {
    id: "1",
    name: "Michael Thompson",
    email: "mthompson@email.com",
    total_given: 2400,
    donation_count: 12,
    last_donation: "2026-03-15",
    type: "recurring",
    recurring_amount: 200,
    acknowledged: true,
  },
  {
    id: "2",
    name: "Angela Davis",
    email: "adavis@email.com",
    total_given: 500,
    donation_count: 1,
    last_donation: "2026-03-10",
    type: "one-time",
    recurring_amount: null,
    acknowledged: true,
  },
  {
    id: "3",
    name: "Robert Kim",
    email: "rkim@email.com",
    total_given: 1200,
    donation_count: 6,
    last_donation: "2026-03-01",
    type: "recurring",
    recurring_amount: 100,
    acknowledged: true,
  },
  {
    id: "4",
    name: "Patricia Wells",
    email: "pwells@email.com",
    total_given: 250,
    donation_count: 1,
    last_donation: "2026-03-18",
    type: "one-time",
    recurring_amount: null,
    acknowledged: false,
  },
  {
    id: "5",
    name: "James Williams",
    email: "jwilliams@email.com",
    total_given: 600,
    donation_count: 3,
    last_donation: "2026-02-28",
    type: "one-time",
    recurring_amount: null,
    acknowledged: true,
  },
];

const stats = {
  total_this_month: 3200,
  total_this_year: 28500,
  recurring_donors: sampleDonors.filter((d) => d.type === "recurring").length,
  pending_acknowledgments: sampleDonors.filter((d) => !d.acknowledged).length,
};

const recentDonations = [
  { id: 1, donor: "Patricia Wells", amount: 250, date: "Mar 18, 2026", type: "one-time" },
  { id: 2, donor: "Michael Thompson", amount: 200, date: "Mar 15, 2026", type: "recurring" },
  { id: 3, donor: "Angela Davis", amount: 500, date: "Mar 10, 2026", type: "one-time" },
  { id: 4, donor: "Robert Kim", amount: 100, date: "Mar 1, 2026", type: "recurring" },
];

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDonors = sampleDonors.filter((donor) => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || donor.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Donations</h1>
          <p className="text-[#555555]">
            Manage donors and track contributions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Gift className="h-4 w-4 mr-2" />
            Record Donation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "This Month",
            value: `$${stats.total_this_month.toLocaleString()}`,
            icon: DollarSign,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Year to Date",
            value: `$${stats.total_this_year.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Recurring Donors",
            value: stats.recurring_donors,
            icon: RefreshCw,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending Thanks",
            value: stats.pending_acknowledgments,
            icon: Heart,
            color: "text-pink-600",
            bg: "bg-pink-50",
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
              <div className="flex gap-2">
                {["all", "one-time", "recurring"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                      typeFilter === type
                        ? "bg-[#C9A84C] text-[#1A1A1A]"
                        : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
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
                      Total Given
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Last Donation
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonors.map((donor) => (
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
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{donor.name}</p>
                            <p className="text-xs text-[#888888]">{donor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#5A7247]">
                          ${donor.total_given.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#888888]">{donor.donation_count} gifts</p>
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
                          {donor.type}
                          {donor.recurring_amount && ` ($${donor.recurring_amount}/mo)`}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#888888]">
                          {new Date(donor.last_donation).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {!donor.acknowledged && (
                            <Button size="sm" variant="outline">
                              <Send className="h-4 w-4 mr-1" />
                              Thank
                            </Button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                            <Mail className="h-4 w-4 text-[#888888]" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Showing {filteredDonors.length} of {sampleDonors.length} donors
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

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD]">
            <h2 className="font-semibold text-[#1A1A1A]">Recent Donations</h2>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-[#1A1A1A]">{donation.donor}</span>
                  <span className="font-semibold text-[#5A7247]">
                    ${donation.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888]">{donation.date}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      donation.type === "recurring"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {donation.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#DDDDDD]">
            <Button variant="ghost" className="w-full text-sm text-[#C9A84C]">
              View All Donations
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
