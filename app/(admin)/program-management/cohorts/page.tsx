"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  Users,
  GraduationCap,
  ChevronRight,
  Clock,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const cohorts = [
  {
    id: "1",
    name: "Cohort 12",
    program: "father_forward",
    program_name: "Father Forward",
    status: "active",
    start_date: "2026-02-10",
    end_date: "2026-04-05",
    current_week: 6,
    total_weeks: 8,
    enrolled: 12,
    capacity: 15,
    case_worker: "TJ Wilform",
    completion_rate: null,
    graduated: 0,
  },
  {
    id: "2",
    name: "Cohort 8",
    program: "tech_ready_youth",
    program_name: "Tech-Ready Youth",
    status: "active",
    start_date: "2026-02-24",
    end_date: "2026-04-19",
    current_week: 4,
    total_weeks: 8,
    enrolled: 18,
    capacity: 20,
    case_worker: "TJ Wilform",
    completion_rate: null,
    graduated: 0,
  },
  {
    id: "3",
    name: "Cohort 11",
    program: "father_forward",
    program_name: "Father Forward",
    status: "completed",
    start_date: "2025-12-01",
    end_date: "2026-01-26",
    current_week: 8,
    total_weeks: 8,
    enrolled: 15,
    capacity: 15,
    case_worker: "TJ Wilform",
    completion_rate: 87,
    graduated: 13,
  },
  {
    id: "4",
    name: "Cohort 13",
    program: "father_forward",
    program_name: "Father Forward",
    status: "upcoming",
    start_date: "2026-04-15",
    end_date: "2026-06-10",
    current_week: 0,
    total_weeks: 8,
    enrolled: 8,
    capacity: 15,
    case_worker: "TJ Wilform",
    completion_rate: null,
    graduated: 0,
  },
  {
    id: "5",
    name: "Cohort 9",
    program: "tech_ready_youth",
    program_name: "Tech-Ready Youth",
    status: "upcoming",
    start_date: "2026-05-01",
    end_date: "2026-06-26",
    current_week: 0,
    total_weeks: 8,
    enrolled: 5,
    capacity: 20,
    case_worker: null,
    completion_rate: null,
    graduated: 0,
  },
];

export default function CohortsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");

  const filteredCohorts = cohorts.filter(
    (cohort) => statusFilter === "all" || cohort.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-[#EFF4EB] text-[#5A7247]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Play;
      case "upcoming":
        return Clock;
      case "completed":
        return CheckCircle;
      default:
        return Pause;
    }
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case "father_forward":
        return "bg-[#C9A84C]";
      case "tech_ready_youth":
        return "bg-[#5A7247]";
      default:
        return "bg-gray-500";
    }
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
            <span className="text-sm text-[#1A1A1A]">Cohorts</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Cohorts</h1>
          <p className="text-[#555555]">Manage program cohorts and track progress</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Cohort
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Cohorts",
            value: cohorts.filter((c) => c.status === "active").length,
            icon: Play,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Upcoming",
            value: cohorts.filter((c) => c.status === "upcoming").length,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Enrolled",
            value: cohorts
              .filter((c) => c.status === "active" || c.status === "upcoming")
              .reduce((sum, c) => sum + c.enrolled, 0),
            icon: Users,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Completed",
            value: cohorts.filter((c) => c.status === "completed").length,
            icon: GraduationCap,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
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

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "active", "upcoming", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Cohorts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCohorts.map((cohort, index) => {
          const StatusIcon = getStatusIcon(cohort.status);
          return (
            <motion.div
              key={cohort.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all group"
            >
              <div className={`h-2 ${getProgramColor(cohort.program)}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{cohort.name}</h3>
                    <p className="text-sm text-[#888888]">{cohort.program_name}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      cohort.status
                    )}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cohort.status}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-[#888888] mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(cohort.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(cohort.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Progress */}
                {cohort.status === "active" && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#888888]">Progress</span>
                      <span className="text-[#555555]">
                        Week {cohort.current_week}/{cohort.total_weeks}
                      </span>
                    </div>
                    <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5A7247] rounded-full"
                        style={{
                          width: `${(cohort.current_week / cohort.total_weeks) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Enrollment */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#888888]">Enrollment</span>
                    <span className="text-[#555555]">
                      {cohort.enrolled}/{cohort.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full"
                      style={{ width: `${(cohort.enrolled / cohort.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Completion Rate (for completed cohorts) */}
                {cohort.status === "completed" && cohort.completion_rate !== null && (
                  <div className="p-2 bg-[#FAFAF8] rounded-lg mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#888888]">Completion Rate</span>
                      <span className="font-semibold text-[#5A7247]">
                        {cohort.completion_rate}%
                      </span>
                    </div>
                    <p className="text-xs text-[#888888] mt-1">
                      {cohort.graduated} of {cohort.enrolled} participants graduated
                    </p>
                  </div>
                )}

                {/* Case Worker */}
                {cohort.case_worker && (
                  <div className="flex items-center gap-2 text-sm text-[#888888] mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold">
                      {cohort.case_worker
                        .split(" ")
                        .map((n) => n.charAt(0))
                        .join("")}
                    </div>
                    <span>{cohort.case_worker}</span>
                  </div>
                )}

                <Link
                  href={`/programs/cohorts/${cohort.id}`}
                  className="flex items-center gap-1 text-sm text-[#C9A84C] group-hover:underline"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
