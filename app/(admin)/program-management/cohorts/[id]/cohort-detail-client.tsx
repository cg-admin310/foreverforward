"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  Edit,
  Save,
  X,
  GraduationCap,
  Clock,
  CheckCircle,
  Play,
  User,
  Mail,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CohortWithStats, updateCohort } from "@/lib/actions/cohorts";
import { getProgramDisplayName, PROGRAM_OPTIONS } from "@/lib/utils/programs";
import { ProgramType } from "@/types/database";

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  progress_percentage: number | null;
  current_week: number | null;
}

interface CohortDetailClientProps {
  cohort: CohortWithStats;
  participants: Participant[];
}

export function CohortDetailClient({ cohort, participants }: CohortDetailClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: cohort.name,
    program: cohort.program,
    start_date: cohort.start_date.split("T")[0],
    end_date: cohort.end_date?.split("T")[0] || "",
    max_participants: cohort.max_participants || 15,
    total_weeks: cohort.total_weeks || 8,
  });

  // Calculate cohort status
  const getCohortStatus = (): "active" | "upcoming" | "completed" => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = cohort.end_date ? new Date(cohort.end_date) : null;

    if (startDate > now) return "upcoming";
    if (endDate && endDate < now) return "completed";
    return "active";
  };

  const status = getCohortStatus();

  const getCurrentWeek = () => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    if (startDate > now) return 0;

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceStart = Math.floor((now.getTime() - startDate.getTime()) / msPerWeek) + 1;
    return Math.min(weeksSinceStart, cohort.total_weeks || 8);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "active":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "enrolled":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "withdrawn":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return Play;
      case "upcoming":
        return Clock;
      case "completed":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon();
  const currentWeek = getCurrentWeek();
  const totalWeeks = cohort.total_weeks || 8;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateCohort(cohort.id, {
        name: formData.name,
        program: formData.program,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        max_participants: formData.max_participants,
        total_weeks: formData.total_weeks,
      });

      if (result.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert(result.error || "Failed to update cohort");
      }
    } catch (error) {
      console.error("Error updating cohort:", error);
      alert("Failed to update cohort");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: cohort.name,
      program: cohort.program,
      start_date: cohort.start_date.split("T")[0],
      end_date: cohort.end_date?.split("T")[0] || "",
      max_participants: cohort.max_participants || 15,
      total_weeks: cohort.total_weeks || 8,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/program-management/cohorts"
            className="inline-flex items-center gap-1 text-sm text-[#888888] hover:text-[#C9A84C] mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cohorts
          </Link>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-2xl font-bold h-auto py-1"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{cohort.name}</h1>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status}
            </span>
          </div>
          <p className="text-[#555555] mt-1">{getProgramDisplayName(cohort.program)}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Cohort
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cohort Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-6"
          >
            <h2 className="font-semibold text-[#1A1A1A] mb-4">Cohort Details</h2>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => setFormData({ ...formData, program: value as ProgramType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAM_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Capacity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 15 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (weeks)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.total_weeks}
                      onChange={(e) => setFormData({ ...formData, total_weeks: parseInt(e.target.value) || 8 })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FBF6E9] rounded-lg">
                    <Calendar className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888888]">Duration</p>
                    <p className="font-medium text-[#1A1A1A]">
                      {new Date(cohort.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {cohort.end_date
                        ? new Date(cohort.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Ongoing"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EFF4EB] rounded-lg">
                    <Users className="h-5 w-5 text-[#5A7247]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888888]">Capacity</p>
                    <p className="font-medium text-[#1A1A1A]">
                      {cohort.enrolled_count} / {cohort.max_participants || 15} enrolled
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#888888]">Program Length</p>
                    <p className="font-medium text-[#1A1A1A]">{totalWeeks} weeks</p>
                  </div>
                </div>

                {cohort.case_worker_name && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-[#888888]">Case Worker</p>
                      <p className="font-medium text-[#1A1A1A]">{cohort.case_worker_name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress (for active cohorts) */}
            {status === "active" && !isEditing && (
              <div className="mt-6 pt-6 border-t border-[#DDDDDD]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#888888]">Cohort Progress</span>
                  <span className="text-sm font-medium text-[#555555]">
                    Week {currentWeek} of {totalWeeks}
                  </span>
                </div>
                <div className="h-3 bg-[#DDDDDD] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5A7247] rounded-full transition-all"
                    style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Participants List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden"
          >
            <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">
                Participants ({participants.length})
              </h2>
              <Link href="/program-management/participants">
                <Button variant="outline" size="sm">
                  Manage All
                </Button>
              </Link>
            </div>

            {participants.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-[#DDDDDD] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1A1A1A] mb-2">No participants yet</h3>
                <p className="text-sm text-[#888888] mb-4">
                  Enroll participants to this cohort from the participants page
                </p>
                <Link href="/program-management/participants">
                  <Button>View Participants</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAFAF8]">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                        Participant
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                        Progress
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold">
                              {participant.first_name.charAt(0)}
                              {participant.last_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[#1A1A1A]">
                                {participant.first_name} {participant.last_name}
                              </p>
                              <p className="text-xs text-[#888888]">{participant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(participant.status)}`}
                          >
                            {participant.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#5A7247] rounded-full"
                                style={{ width: `${participant.progress_percentage || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-[#888888]">
                              {participant.progress_percentage || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/program-management/participants/${participant.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <button className="p-2 rounded-lg hover:bg-[#F5F3EF]">
                              <Mail className="h-4 w-4 text-[#888888]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Enrolled</span>
                <span className="font-semibold text-[#1A1A1A]">{cohort.enrolled_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Active</span>
                <span className="font-semibold text-green-600">{cohort.active_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Completed</span>
                <span className="font-semibold text-[#5A7247]">{cohort.completed_count}</span>
              </div>
              {cohort.enrolled_count > 0 && (
                <div className="pt-3 border-t border-[#DDDDDD]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#888888]">Completion Rate</span>
                    <span className="font-semibold text-[#C9A84C]">
                      {Math.round((cohort.completed_count / cohort.enrolled_count) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Actions</h3>
            <div className="space-y-2">
              <Link href="/program-management/participants" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Add Participants
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Cohort
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              {status === "completed" && (
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Generate Certificates
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
