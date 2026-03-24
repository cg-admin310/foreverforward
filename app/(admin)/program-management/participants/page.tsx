"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  User,
  GraduationCap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bot,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sampleParticipants = [
  {
    id: "1",
    first_name: "Marcus",
    last_name: "Johnson",
    email: "marcus.j@email.com",
    phone: "(323) 555-0123",
    program: "father_forward",
    cohort: "Cohort 12",
    status: "active",
    current_week: 6,
    assigned_to: "TJ Wilform",
    travis_alert: false,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    first_name: "James",
    last_name: "Williams",
    email: "jwilliams@gmail.com",
    phone: "(213) 555-0789",
    program: "tech_ready_youth",
    cohort: "Cohort 8",
    status: "active",
    current_week: 4,
    assigned_to: "TJ Wilform",
    travis_alert: false,
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "3",
    first_name: "Anthony",
    last_name: "Brown",
    email: "abrown@email.com",
    phone: "(310) 555-0654",
    program: "father_forward",
    cohort: "Cohort 12",
    status: "active",
    current_week: 6,
    assigned_to: "TJ Wilform",
    travis_alert: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "4",
    first_name: "DeShawn",
    last_name: "Mitchell",
    email: "dmitchell@email.com",
    phone: "(323) 555-0987",
    program: "father_forward",
    cohort: "Cohort 12",
    status: "at_risk",
    current_week: 6,
    assigned_to: "TJ Wilform",
    travis_alert: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "5",
    first_name: "Kevin",
    last_name: "Davis",
    email: "kdavis@email.com",
    phone: "(310) 555-1234",
    program: "tech_ready_youth",
    cohort: "Cohort 8",
    status: "graduated",
    current_week: 8,
    assigned_to: null,
    travis_alert: false,
    created_at: "2026-01-01T10:00:00Z",
  },
];

const programs = [
  { value: "all", label: "All Programs" },
  { value: "father_forward", label: "Father Forward" },
  { value: "tech_ready_youth", label: "Tech-Ready Youth" },
  { value: "making_moments", label: "Making Moments" },
  { value: "script_to_screen", label: "From Script to Screen" },
  { value: "stories_future", label: "Stories from My Future" },
  { value: "lula", label: "LULA" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "applicant", label: "Applicant" },
  { value: "enrolled", label: "Enrolled" },
  { value: "active", label: "Active" },
  { value: "at_risk", label: "At Risk" },
  { value: "graduated", label: "Graduated" },
  { value: "dropped", label: "Dropped" },
];

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredParticipants = sampleParticipants.filter((participant) => {
    const matchesSearch = `${participant.first_name} ${participant.last_name} ${participant.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesProgram = programFilter === "all" || participant.program === programFilter;
    const matchesStatus = statusFilter === "all" || participant.status === statusFilter;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applicant":
        return "bg-gray-100 text-gray-700";
      case "enrolled":
        return "bg-blue-100 text-blue-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "at_risk":
        return "bg-red-100 text-red-600";
      case "graduated":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "dropped":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgramName = (slug: string) => {
    const program = programs.find((p) => p.value === slug);
    return program?.label || slug;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/program-management" className="text-sm text-[#888888] hover:text-[#C9A84C]">
              Programs
            </Link>
            <span className="text-[#888888]">/</span>
            <span className="text-sm text-[#1A1A1A]">Participants</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Participants</h1>
          <p className="text-[#555555]">Manage program participants and track progress</p>
        </div>
        <Button asChild>
          <Link href="/leads/new?type=program">Add Participant</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", value: sampleParticipants.length, color: "text-[#1A1A1A]" },
          {
            label: "Active",
            value: sampleParticipants.filter((p) => p.status === "active").length,
            color: "text-green-600",
          },
          {
            label: "At Risk",
            value: sampleParticipants.filter((p) => p.status === "at_risk").length,
            color: "text-red-600",
          },
          {
            label: "Graduated",
            value: sampleParticipants.filter((p) => p.status === "graduated").length,
            color: "text-[#5A7247]",
          },
          {
            label: "Travis Alerts",
            value: sampleParticipants.filter((p) => p.travis_alert).length,
            color: "text-[#C9A84C]",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-[#DDDDDD]">
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
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
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
                  Participant
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Program
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Cohort
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
              {filteredParticipants.map((participant) => (
                <motion.tr
                  key={participant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/programs/participants/${participant.id}`)
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
                    <span className="text-sm text-[#555555]">{participant.cohort}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A7247] rounded-full"
                          style={{ width: `${(participant.current_week / 8) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#888888]">
                        Week {participant.current_week}/8
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
                    {participant.assigned_to ? (
                      <span className="text-sm text-[#555555]">{participant.assigned_to}</span>
                    ) : (
                      <span className="text-sm text-[#888888]">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {participant.travis_alert && (
                      <div className="flex items-center gap-1 text-[#C9A84C]">
                        <Bot className="h-4 w-4" />
                        <span className="text-xs">Travis</span>
                      </div>
                    )}
                    {participant.status === "at_risk" && (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">At Risk</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            Showing {filteredParticipants.length} of {sampleParticipants.length} participants
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
