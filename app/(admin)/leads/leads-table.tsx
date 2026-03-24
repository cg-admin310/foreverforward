"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lead } from "@/types/database";

interface LeadsTableProps {
  initialLeads: Lead[];
  total: number;
  currentPage: number;
  totalPages: number;
  currentType?: string;
  currentStatus?: string;
  currentSearch?: string;
}

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

export function LeadsTable({
  initialLeads,
  total,
  currentPage,
  totalPages,
  currentType,
  currentStatus,
  currentSearch,
}: LeadsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(currentSearch || "");
  const [typeFilter, setTypeFilter] = useState(currentType || "all");
  const [statusFilter, setStatusFilter] = useState(currentStatus || "all");

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/leads?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    updateFilters({ type: value, status: statusFilter, search: searchQuery });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    updateFilters({ type: typeFilter, status: value, search: searchQuery });
  };

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
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
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
              onChange={(e) => handleTypeChange(e.target.value)}
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
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        {initialLeads.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No leads found</h3>
            <p className="text-[#888888] mb-4">
              {currentSearch || currentType || currentStatus
                ? "Try adjusting your filters or search query"
                : "Start by adding your first lead or wait for form submissions"}
            </p>
            <Button asChild>
              <Link href="/leads/new">Add Lead</Link>
            </Button>
          </div>
        ) : (
          <>
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
                      Source
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
                  {initialLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                      onClick={() => router.push(`/leads/${lead.id}`)}
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
                          {lead.phone && (
                            <p className="text-sm text-[#888888] flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </p>
                          )}
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
                        <span className="text-sm text-[#888888] capitalize">
                          {lead.source?.replace(/_/g, " ") || "Website"}
                        </span>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Showing {initialLeads.length} of {total} leads
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage - 1));
                    router.push(`/leads?${params.toString()}`);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 bg-[#C9A84C] text-[#1A1A1A] rounded text-sm font-medium">
                  {currentPage}
                </span>
                {totalPages > 1 && (
                  <span className="text-sm text-[#888888]">of {totalPages}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage + 1));
                    router.push(`/leads?${params.toString()}`);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
