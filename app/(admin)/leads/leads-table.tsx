"use client";

import { useState, useCallback } from "react";
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
  CheckSquare,
  Square,
  Zap,
  Bot,
  Target,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lead, ProgramType, ReadinessLevel } from "@/types/database";

interface LeadsTableProps {
  initialLeads: Lead[];
  total: number;
  currentPage: number;
  totalPages: number;
  currentType?: string;
  currentStatus?: string;
  currentSearch?: string;
  currentAssessment?: string;
  currentReadiness?: string;
  currentBarriers?: string;
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

const assessmentFilters = [
  { value: "all", label: "All Assessments" },
  { value: "completed", label: "Has Assessment" },
  { value: "none", label: "No Assessment" },
];

const readinessFilters = [
  { value: "all", label: "All Readiness" },
  { value: "high", label: "High Readiness" },
  { value: "medium", label: "Medium Readiness" },
  { value: "low", label: "Low Readiness" },
];

const programNames: Record<string, string> = {
  father_forward: "Father Forward",
  tech_ready_youth: "Tech-Ready Youth",
  making_moments: "Making Moments",
  from_script_to_screen: "Script to Screen",
  stories_from_my_future: "Stories",
  lula: "LULA",
};

export function LeadsTable({
  initialLeads,
  total,
  currentPage,
  totalPages,
  currentType,
  currentStatus,
  currentSearch,
  currentAssessment,
  currentReadiness,
  currentBarriers,
}: LeadsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(currentSearch || "");
  const [typeFilter, setTypeFilter] = useState(currentType || "all");
  const [statusFilter, setStatusFilter] = useState(currentStatus || "all");
  const [assessmentFilter, setAssessmentFilter] = useState(currentAssessment || "all");
  const [readinessFilter, setReadinessFilter] = useState(currentReadiness || "all");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isRunningBulkAI, setIsRunningBulkAI] = useState(false);

  const updateFilters = useCallback((updates: Record<string, string>) => {
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
  }, [searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters: Record<string, string> = {
      type: typeFilter,
      status: statusFilter,
      assessment: assessmentFilter,
      readiness: readinessFilter,
      search: searchQuery,
    };
    newFilters[filterKey] = value;

    // Update local state
    switch (filterKey) {
      case "type": setTypeFilter(value); break;
      case "status": setStatusFilter(value); break;
      case "assessment": setAssessmentFilter(value); break;
      case "readiness": setReadinessFilter(value); break;
    }

    updateFilters(newFilters);
  };

  const toggleSelect = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeads(prev => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === initialLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(initialLeads.map(l => l.id)));
    }
  };

  const handleBulkClassify = async () => {
    if (selectedLeads.size === 0) return;

    setIsRunningBulkAI(true);
    try {
      // In a real implementation, this would call the bulk classify action
      // For now, we'll just simulate the action
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`AI classification queued for ${selectedLeads.size} leads`);
      setSelectedLeads(new Set());
    } catch (error) {
      console.error("Error running bulk classification:", error);
    } finally {
      setIsRunningBulkAI(false);
    }
  };

  const handleExport = () => {
    // In a real implementation, this would trigger a CSV/Excel export
    alert("Export functionality coming soon");
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

  const getReadinessColor = (level: ReadinessLevel | null | undefined) => {
    switch (level) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const hasAssessment = (lead: Lead) => {
    return !!(lead.assessment_data || lead.assessment_completed_at);
  };

  const hasBarriers = (lead: Lead) => {
    return lead.barriers && lead.barriers.length > 0;
  };

  const getScoreDisplay = (lead: Lead) => {
    if (lead.lead_type === "program") {
      return lead.fit_score || lead.priority_score || null;
    }
    return lead.priority_score || lead.estimated_value || null;
  };

  const getRecommendedProgram = (lead: Lead): string | null => {
    if (lead.recommended_programs && lead.recommended_programs.length > 0) {
      return programNames[lead.recommended_programs[0]] || lead.recommended_programs[0];
    }
    if (lead.program_interest) {
      return programNames[lead.program_interest] || lead.program_interest;
    }
    return null;
  };

  // Filter leads client-side for assessment and readiness filters
  let filteredLeads = initialLeads;

  if (assessmentFilter === "completed") {
    filteredLeads = filteredLeads.filter(hasAssessment);
  } else if (assessmentFilter === "none") {
    filteredLeads = filteredLeads.filter(l => !hasAssessment(l));
  }

  if (readinessFilter !== "all") {
    filteredLeads = filteredLeads.filter(l => l.readiness_level === readinessFilter);
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search and Primary Filters */}
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
            <div className="flex gap-3 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange("type", e.target.value)}
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
                onChange={(e) => handleFilterChange("status", e.target.value)}
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
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#DDDDDD]">
            <span className="text-sm text-[#888888]">Filter by:</span>
            <select
              value={assessmentFilter}
              onChange={(e) => handleFilterChange("assessment", e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {assessmentFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              value={readinessFilter}
              onChange={(e) => handleFilterChange("readiness", e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {readinessFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </form>
      </div>

      {/* Bulk Actions Bar (when items selected) */}
      {selectedLeads.size > 0 && (
        <div className="bg-[#FBF6E9] rounded-xl border border-[#E8D48B] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#1A1A1A]">
              {selectedLeads.size} lead{selectedLeads.size !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkClassify}
              disabled={isRunningBulkAI}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isRunningBulkAI ? "Processing..." : "Run AI Classification"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedLeads(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No leads found</h3>
            <p className="text-[#888888] mb-4">
              {currentSearch || currentType || currentStatus || assessmentFilter !== "all" || readinessFilter !== "all"
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
                    <th className="w-10 px-4 py-3">
                      <button
                        onClick={toggleSelectAll}
                        className="text-[#888888] hover:text-[#1A1A1A] transition-colors"
                      >
                        {selectedLeads.size === initialLeads.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-semibold text-[#555555]">
                      <div className="flex items-center justify-center gap-1">
                        <ClipboardCheck className="h-4 w-4" />
                        <span>Assessment</span>
                      </div>
                    </th>
                    <th className="text-center px-4 py-3 text-sm font-semibold text-[#555555]">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>Score</span>
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Program / Service
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
                  {filteredLeads.map((lead) => {
                    const assessed = hasAssessment(lead);
                    const barriers = hasBarriers(lead);
                    const score = getScoreDisplay(lead);
                    const recommendedProgram = getRecommendedProgram(lead);

                    return (
                      <tr
                        key={lead.id}
                        className={`border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer ${
                          selectedLeads.has(lead.id) ? "bg-[#FBF6E9]" : ""
                        }`}
                        onClick={() => router.push(`/leads/${lead.id}`)}
                      >
                        <td className="px-4 py-4" onClick={(e) => toggleSelect(lead.id, e)}>
                          {selectedLeads.has(lead.id) ? (
                            <CheckSquare className="h-4 w-4 text-[#C9A84C]" />
                          ) : (
                            <Square className="h-4 w-4 text-[#888888]" />
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                              {lead.first_name.charAt(0)}
                              {lead.last_name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[#1A1A1A]">
                                  {lead.first_name} {lead.last_name}
                                </p>
                                {barriers && (
                                  <span title="Has barriers">
                                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                                  </span>
                                )}
                              </div>
                              {lead.organization && (
                                <p className="text-sm text-[#888888]">
                                  {lead.organization}
                                </p>
                              )}
                              <p className="text-xs text-[#888888] flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </p>
                            </div>
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
                        <td className="px-4 py-4 text-center">
                          {assessed ? (
                            <div className="flex flex-col items-center gap-1">
                              <Bot className="h-4 w-4 text-[#C9A84C]" />
                              <span className={`text-xs font-medium ${getReadinessColor(lead.readiness_level)}`}>
                                {lead.readiness_level || "—"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#888888]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {score !== null ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="text-sm font-bold text-[#1A1A1A]">
                                {lead.lead_type === "msp" && lead.estimated_value ? (
                                  `$${(lead.estimated_value / 1000).toFixed(1)}k`
                                ) : (
                                  `${score}%`
                                )}
                              </span>
                              <span className="text-[10px] text-[#888888]">
                                {lead.lead_type === "program" ? "fit" : "value"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#888888]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {recommendedProgram ? (
                            <span className="inline-flex px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] rounded-full text-xs font-medium">
                              {recommendedProgram}
                            </span>
                          ) : lead.service_interests && lead.service_interests.length > 0 ? (
                            <span className="inline-flex px-2 py-1 bg-[#EFF4EB] text-[#5A7247] rounded-full text-xs font-medium">
                              {lead.service_interests[0].replace(/_/g, " ")}
                            </span>
                          ) : (
                            <span className="text-xs text-[#888888]">—</span>
                          )}
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Showing {filteredLeads.length} of {total} leads
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
