"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Bot,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Participant, ProgramType, ParticipantStatus } from "@/types/database";

interface ParticipantsTableProps {
  initialParticipants: Participant[];
  total: number;
  currentPage: number;
  totalPages: number;
  currentProgram?: string;
  currentStatus?: string;
  currentSearch?: string;
}

const programs = [
  { value: "all", label: "All Programs" },
  { value: "father_forward", label: "Father Forward" },
  { value: "tech_ready_youth", label: "Tech-Ready Youth" },
  { value: "making_moments", label: "Making Moments" },
  { value: "from_script_to_screen", label: "From Script to Screen" },
  { value: "stories_from_my_future", label: "Stories from My Future" },
  { value: "lula", label: "LULA" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "applicant", label: "Applicant" },
  { value: "enrolled", label: "Enrolled" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "withdrawn", label: "Withdrawn" },
];

export function ParticipantsTable({
  initialParticipants,
  total,
  currentPage,
  totalPages,
  currentProgram,
  currentStatus,
  currentSearch,
}: ParticipantsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(currentSearch || "");
  const [programFilter, setProgramFilter] = useState(currentProgram || "all");
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

    router.push(`/program-management/participants?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery });
  };

  const handleProgramChange = (value: string) => {
    setProgramFilter(value);
    updateFilters({ program: value, status: statusFilter, search: searchQuery });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    updateFilters({ program: programFilter, status: value, search: searchQuery });
  };

  const getStatusColor = (status: ParticipantStatus) => {
    switch (status) {
      case "applicant":
        return "bg-gray-100 text-gray-700";
      case "enrolled":
        return "bg-blue-100 text-blue-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "on_hold":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "withdrawn":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgramName = (slug: ProgramType) => {
    const program = programs.find((p) => p.value === slug);
    return program?.label || slug;
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={programFilter}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {programs.map((program) => (
                <option key={program.value} value={program.value}>
                  {program.label}
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
        {initialParticipants.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              No participants found
            </h3>
            <p className="text-[#888888]">
              {currentSearch || currentProgram || currentStatus
                ? "Try adjusting your filters or search query"
                : "No participants enrolled yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Participant
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Program
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Progress
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Case Worker
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                      Alerts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                      onClick={() =>
                        router.push(`/program-management/participants/${participant.id}`)
                      }
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                            {participant.first_name.charAt(0)}
                            {participant.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A]">
                              {participant.first_name} {participant.last_name}
                            </p>
                            <p className="text-sm text-[#888888]">{participant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#555555]">
                          {getProgramName(participant.program)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#5A7247] rounded-full"
                              style={{
                                width: `${participant.progress_percentage || 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#888888]">
                            {participant.current_week
                              ? `Week ${participant.current_week}/8`
                              : `${participant.progress_percentage || 0}%`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            participant.status
                          )}`}
                        >
                          {participant.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {participant.assigned_case_worker ? (
                          <span className="text-sm text-[#555555]">
                            Assigned
                          </span>
                        ) : (
                          <span className="text-sm text-[#888888]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {participant.travis_escalation_flags &&
                          participant.travis_escalation_flags.length > 0 && (
                            <div className="flex items-center gap-1 text-[#C9A84C]">
                              <Bot className="h-4 w-4" />
                              <span className="text-xs">Travis</span>
                            </div>
                          )}
                        {participant.status === "on_hold" && (
                          <div className="flex items-center gap-1 text-red-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs">On Hold</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
              <p className="text-sm text-[#888888]">
                Showing {initialParticipants.length} of {total} participants
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", String(currentPage - 1));
                    router.push(`/program-management/participants?${params.toString()}`);
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
                    router.push(`/program-management/participants?${params.toString()}`);
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
