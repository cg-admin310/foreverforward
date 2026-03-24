"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle,
  Clock,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    slug: "father_forward",
    name: "Father Forward",
    audience: "Fathers",
    enrolled: 24,
    active_cohort: "Cohort 12",
    cohort_week: 6,
    completion_rate: 87,
    color: "bg-[#C9A84C]",
  },
  {
    slug: "tech_ready_youth",
    name: "Tech-Ready Youth",
    audience: "Youth 16+",
    enrolled: 18,
    active_cohort: "Cohort 8",
    cohort_week: 4,
    completion_rate: 92,
    color: "bg-[#5A7247]",
  },
  {
    slug: "making_moments",
    name: "Making Moments",
    audience: "Families",
    enrolled: 45,
    active_cohort: null,
    cohort_week: null,
    completion_rate: null,
    color: "bg-blue-500",
  },
  {
    slug: "script_to_screen",
    name: "From Script to Screen",
    audience: "Students",
    enrolled: 12,
    active_cohort: "Phase 2",
    cohort_week: null,
    completion_rate: 100,
    color: "bg-purple-500",
  },
  {
    slug: "stories_future",
    name: "Stories from My Future",
    audience: "Kids",
    enrolled: 8,
    active_cohort: null,
    cohort_week: null,
    completion_rate: null,
    color: "bg-pink-500",
  },
  {
    slug: "lula",
    name: "LULA",
    audience: "Youth",
    enrolled: 156,
    active_cohort: null,
    cohort_week: null,
    completion_rate: null,
    color: "bg-orange-500",
  },
];

const recentApplications = [
  {
    id: 1,
    name: "Marcus Johnson",
    program: "Father Forward",
    applied: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    name: "James Williams",
    program: "Tech-Ready Youth",
    applied: "5 hours ago",
    status: "approved",
  },
  {
    id: 3,
    name: "DeShawn Mitchell",
    program: "Father Forward",
    applied: "1 day ago",
    status: "pending",
  },
];

const upcomingCohorts = [
  {
    id: 1,
    program: "Father Forward",
    cohort: "Cohort 13",
    start_date: "Apr 15, 2026",
    enrolled: 8,
    capacity: 15,
  },
  {
    id: 2,
    program: "Tech-Ready Youth",
    cohort: "Cohort 9",
    start_date: "May 1, 2026",
    enrolled: 5,
    capacity: 20,
  },
];

export default function ProgramsPage() {
  const totalEnrolled = programs.reduce((sum, p) => sum + p.enrolled, 0);
  const activePrograms = programs.filter((p) => p.active_cohort).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Programs</h1>
          <p className="text-[#555555]">
            Manage workforce development programs and participants
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/program-management/cohorts">Manage Cohorts</Link>
          </Button>
          <Button asChild>
            <Link href="/program-management/participants">
              <Users className="h-4 w-4 mr-2" />
              View Participants
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Enrolled",
            value: totalEnrolled,
            icon: Users,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Active Programs",
            value: activePrograms,
            icon: GraduationCap,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Pending Applications",
            value: 5,
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "This Month Graduates",
            value: 12,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
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

      {/* Programs Grid */}
      <div>
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Programs Overview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program, index) => (
            <motion.div
              key={program.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all group"
            >
              <div className={`h-2 ${program.color}`} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{program.name}</h3>
                    <p className="text-sm text-[#888888]">{program.audience}</p>
                  </div>
                  <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-sm font-semibold rounded-full">
                    {program.enrolled}
                  </span>
                </div>

                {program.active_cohort && (
                  <div className="mb-3 p-2 bg-[#FAFAF8] rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#555555]">{program.active_cohort}</span>
                      {program.cohort_week && (
                        <span className="text-[#888888]">Week {program.cohort_week}/8</span>
                      )}
                    </div>
                    {program.cohort_week && (
                      <div className="mt-2 h-1.5 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A7247] rounded-full transition-all"
                          style={{ width: `${(program.cohort_week / 8) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {program.completion_rate !== null && (
                  <div className="flex items-center gap-2 text-sm text-[#888888]">
                    <TrendingUp className="h-4 w-4 text-[#5A7247]" />
                    <span>{program.completion_rate}% completion rate</span>
                  </div>
                )}

                <Link
                  href={`/programs/participants?program=${program.slug}`}
                  className="mt-3 flex items-center gap-1 text-sm text-[#C9A84C] group-hover:underline"
                >
                  View Participants
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A]">Recent Applications</h2>
            <Link href="/leads?type=program" className="text-sm text-[#C9A84C] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {recentApplications.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#1A1A1A]">{app.name}</p>
                    <p className="text-xs text-[#888888]">
                      {app.program} • {app.applied}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    app.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Cohorts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-[#DDDDDD]"
        >
          <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
            <h2 className="font-semibold text-[#1A1A1A]">Upcoming Cohorts</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/program-management/cohorts/new">
                <Plus className="h-4 w-4 mr-1" />
                New Cohort
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-[#DDDDDD]">
            {upcomingCohorts.map((cohort) => (
              <div key={cohort.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm text-[#1A1A1A]">{cohort.cohort}</p>
                    <p className="text-xs text-[#888888]">{cohort.program}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#888888]">
                    <Calendar className="h-4 w-4" />
                    {cohort.start_date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full"
                      style={{ width: `${(cohort.enrolled / cohort.capacity) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#888888]">
                    {cohort.enrolled}/{cohort.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
