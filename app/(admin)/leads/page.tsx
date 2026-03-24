"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/shared/badge";

// Sample data
const sampleLeads = [
  {
    id: "1",
    first_name: "Marcus",
    last_name: "Johnson",
    email: "marcus.j@email.com",
    phone: "(323) 555-0123",
    organization: null,
    lead_type: "program",
    status: "new",
    program_interest: "father_forward",
    created_at: "2026-03-22T10:30:00Z",
    assigned_to: "TJ Wilform",
  },
  {
    id: "2",
    first_name: "Sarah",
    last_name: "Chen",
    email: "schen@hopecenter.org",
    phone: "(310) 555-0456",
    organization: "Hope Community Center",
    lead_type: "msp",
    status: "qualified",
    program_interest: null,
    created_at: "2026-03-21T14:15:00Z",
    assigned_to: "TJ Wilform",
  },
  {
    id: "3",
    first_name: "James",
    last_name: "Williams",
    email: "jwilliams@gmail.com",
    phone: "(213) 555-0789",
    organization: null,
    lead_type: "program",
    status: "contacted",
    program_interest: "tech_ready_youth",
    created_at: "2026-03-20T09:00:00Z",
    assigned_to: null,
  },
  {
    id: "4",
    first_name: "Linda",
    last_name: "Rodriguez",
    email: "lrodriguez@lausd.net",
    phone: "(323) 555-0321",
    organization: "LAUSD - Crenshaw High",
    lead_type: "msp",
    status: "new",
    program_interest: null,
    created_at: "2026-03-19T16:45:00Z",
    assigned_to: null,
  },
  {
    id: "5",
    first_name: "Anthony",
    last_name: "Brown",
    email: "abrown@email.com",
    phone: "(310) 555-0654",
    organization: null,
    lead_type: "volunteer",
    status: "new",
    program_interest: null,
    created_at: "2026-03-19T11:30:00Z",
    assigned_to: null,
  },
];

const leadTypes = [
  { value: "all", label: "All Types" },
  { value: "program", label: "Program" },
  { value: "msp", label: "MSP" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partner", label: "Partner" },
  { value: "donation", label: "Donation" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = sampleLeads.filter((lead) => {
    const matchesSearch =
      `${lead.first_name} ${lead.last_name} ${lead.email} ${lead.organization || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || lead.lead_type === typeFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "qualified":
        return "bg-green-100 text-green-700";
      case "converted":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "lost":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "program":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "msp":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "volunteer":
        return "bg-purple-100 text-purple-700";
      case "partner":
        return "bg-blue-100 text-blue-700";
      case "donation":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Leads</h1>
          <p className="text-[#555555]">
            Manage incoming leads from all sources
          </p>
        </div>
        <Button asChild>
          <Link href="/leads/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Leads", value: sampleLeads.length, color: "text-[#1A1A1A]" },
          { label: "New", value: sampleLeads.filter((l) => l.status === "new").length, color: "text-blue-600" },
          { label: "Contacted", value: sampleLeads.filter((l) => l.status === "contacted").length, color: "text-yellow-600" },
          { label: "Qualified", value: sampleLeads.filter((l) => l.status === "qualified").length, color: "text-green-600" },
          { label: "Converted", value: sampleLeads.filter((l) => l.status === "converted").length, color: "text-[#5A7247]" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
          >
            <p className="text-sm text-[#888888]">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {leadTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Assigned
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Created
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                  onClick={() => window.location.href = `/leads/${lead.id}`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                        {lead.first_name.charAt(0)}
                        {lead.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {lead.first_name} {lead.last_name}
                        </p>
                        {lead.organization && (
                          <p className="text-sm text-[#888888]">
                            {lead.organization}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-[#555555] flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </p>
                      <p className="text-sm text-[#888888] flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                        lead.lead_type
                      )}`}
                    >
                      {lead.lead_type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {lead.assigned_to ? (
                      <span className="text-sm text-[#555555]">
                        {lead.assigned_to}
                      </span>
                    ) : (
                      <span className="text-sm text-[#888888]">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#888888]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-[#888888]" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            Showing {filteredLeads.length} of {sampleLeads.length} leads
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
  );
}
