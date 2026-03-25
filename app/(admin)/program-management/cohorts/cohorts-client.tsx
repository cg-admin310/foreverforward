"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CohortWithStats, CohortStats, createCohort, deleteCohort } from "@/lib/actions/cohorts";
import { getProgramDisplayName, PROGRAM_OPTIONS } from "@/lib/utils/programs";
import { ProgramType } from "@/types/database";

interface CohortsClientProps {
  cohorts: CohortWithStats[];
  stats: CohortStats;
}

export function CohortsClient({ cohorts, stats }: CohortsClientProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "completed">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<CohortWithStats | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for create
  const [formData, setFormData] = useState({
    name: "",
    program: "father_forward" as ProgramType,
    start_date: "",
    end_date: "",
    max_participants: 15,
    total_weeks: 8,
  });

  const filteredCohorts = cohorts.filter((cohort) => {
    if (statusFilter === "all") return true;

    // Calculate status based on dates
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = cohort.end_date ? new Date(cohort.end_date) : null;

    let status: "active" | "upcoming" | "completed";
    if (startDate > now) {
      status = "upcoming";
    } else if (endDate && endDate < now) {
      status = "completed";
    } else {
      status = "active";
    }

    return status === statusFilter;
  });

  const getCohortStatus = (cohort: CohortWithStats): "active" | "upcoming" | "completed" => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = cohort.end_date ? new Date(cohort.end_date) : null;

    if (startDate > now) return "upcoming";
    if (endDate && endDate < now) return "completed";
    return "active";
  };

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
      case "making_moments":
        return "bg-pink-500";
      case "from_script_to_screen":
        return "bg-purple-500";
      case "stories_from_my_future":
        return "bg-cyan-500";
      case "lula":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCreateCohort = async () => {
    setIsSubmitting(true);
    try {
      const result = await createCohort({
        name: formData.name,
        program: formData.program,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        max_participants: formData.max_participants,
        total_weeks: formData.total_weeks,
      });

      if (result.success) {
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          program: "father_forward",
          start_date: "",
          end_date: "",
          max_participants: 15,
          total_weeks: 8,
        });
        router.refresh();
      } else {
        alert(result.error || "Failed to create cohort");
      }
    } catch (error) {
      console.error("Error creating cohort:", error);
      alert("Failed to create cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCohort = async () => {
    if (!selectedCohort) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCohort(selectedCohort.id);

      if (result.success) {
        setIsDeleteDialogOpen(false);
        setSelectedCohort(null);
        router.refresh();
      } else {
        alert(result.error || "Failed to delete cohort");
      }
    } catch (error) {
      console.error("Error deleting cohort:", error);
      alert("Failed to delete cohort");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate current week for active cohorts
  const getCurrentWeek = (cohort: CohortWithStats) => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    if (startDate > now) return 0;

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksSinceStart = Math.floor((now.getTime() - startDate.getTime()) / msPerWeek) + 1;
    return Math.min(weeksSinceStart, cohort.total_weeks || 8);
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Cohort
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Cohorts",
            value: stats.activeCohorts,
            icon: Play,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Upcoming",
            value: stats.upcomingCohorts,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Enrolled",
            value: stats.totalEnrolled,
            icon: Users,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Completed",
            value: stats.completedCohorts,
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
        {filteredCohorts.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-[#DDDDDD] p-12 text-center">
            <GraduationCap className="h-12 w-12 text-[#DDDDDD] mx-auto mb-4" />
            <h3 className="font-semibold text-[#1A1A1A] mb-2">No cohorts found</h3>
            <p className="text-sm text-[#888888] mb-4">
              {statusFilter === "all"
                ? "Create your first cohort to get started"
                : `No ${statusFilter} cohorts at this time`}
            </p>
            {statusFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Cohort
              </Button>
            )}
          </div>
        ) : (
          filteredCohorts.map((cohort, index) => {
            const status = getCohortStatus(cohort);
            const StatusIcon = getStatusIcon(status);
            const currentWeek = getCurrentWeek(cohort);
            const totalWeeks = cohort.total_weeks || 8;

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
                      <p className="text-sm text-[#888888]">{getProgramDisplayName(cohort.program)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded hover:bg-[#FAFAF8]">
                          <MoreVertical className="h-4 w-4 text-[#888888]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/program-management/cohorts/${cohort.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedCohort(cohort);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                      {cohort.end_date
                        ? new Date(cohort.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Ongoing"}
                    </span>
                  </div>

                  {/* Progress */}
                  {status === "active" && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#888888]">Progress</span>
                        <span className="text-[#555555]">
                          Week {currentWeek}/{totalWeeks}
                        </span>
                      </div>
                      <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A7247] rounded-full"
                          style={{
                            width: `${(currentWeek / totalWeeks) * 100}%`,
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
                        {cohort.enrolled_count}/{cohort.max_participants || 15}
                      </span>
                    </div>
                    <div className="h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C] rounded-full"
                        style={{ width: `${(cohort.enrolled_count / (cohort.max_participants || 15)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Completion Rate (for completed cohorts) */}
                  {status === "completed" && cohort.completed_count > 0 && (
                    <div className="p-2 bg-[#FAFAF8] rounded-lg mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#888888]">Completion Rate</span>
                        <span className="font-semibold text-[#5A7247]">
                          {Math.round((cohort.completed_count / cohort.enrolled_count) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-[#888888] mt-1">
                        {cohort.completed_count} of {cohort.enrolled_count} participants graduated
                      </p>
                    </div>
                  )}

                  {/* Case Worker */}
                  {cohort.case_worker_name && (
                    <div className="flex items-center gap-2 text-sm text-[#888888] mb-3">
                      <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold">
                        {cohort.case_worker_name
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                      </div>
                      <span>{cohort.case_worker_name}</span>
                    </div>
                  )}

                  <Link
                    href={`/program-management/cohorts/${cohort.id}`}
                    className="flex items-center gap-1 text-sm text-[#C9A84C] group-hover:underline"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Cohort Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Cohort</DialogTitle>
            <DialogDescription>
              Create a new cohort for a program. Participants can be enrolled after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cohort Name</Label>
              <Input
                id="name"
                placeholder="e.g., Cohort 14"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select
                value={formData.program}
                onValueChange={(value) => setFormData({ ...formData, program: value as ProgramType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
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
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Capacity</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 15 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_weeks">Duration (weeks)</Label>
                <Input
                  id="total_weeks"
                  type="number"
                  min="1"
                  value={formData.total_weeks}
                  onChange={(e) => setFormData({ ...formData, total_weeks: parseInt(e.target.value) || 8 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCohort}
              disabled={isSubmitting || !formData.name || !formData.start_date}
            >
              {isSubmitting ? "Creating..." : "Create Cohort"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cohort</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCohort?.name}"? This action cannot be undone.
              {selectedCohort && selectedCohort.enrolled_count > 0 && (
                <span className="block mt-2 text-red-600">
                  Warning: This cohort has {selectedCohort.enrolled_count} enrolled participant(s).
                  You must remove all participants before deleting.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCohort}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Cohort"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
