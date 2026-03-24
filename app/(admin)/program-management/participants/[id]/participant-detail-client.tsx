"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit,
  Bot,
  MessageSquare,
  FileText,
  CheckCircle,
  Award,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Participant,
  Checkin,
  Activity,
  Document,
  TravisConversation,
  Cohort,
  User,
} from "@/types/database";
import { addCheckin } from "@/lib/actions/participants";

interface ParticipantDetailClientProps {
  participant: Participant;
  checkins: Checkin[];
  activities: Activity[];
  documents: Document[];
  travisConversations: TravisConversation[];
  cohort: Cohort | null;
  caseWorker: User | null;
}

type TabType =
  | "overview"
  | "path_forward"
  | "checkins"
  | "travis"
  | "certifications"
  | "documents"
  | "activity";

const programNames: Record<string, string> = {
  father_forward: "Father Forward",
  tech_ready_youth: "Tech-Ready Youth",
  making_moments: "Making Moments",
  from_script_to_screen: "From Script to Screen",
  stories_from_my_future: "Stories from My Future",
  lula: "LULA",
};

export function ParticipantDetailClient({
  participant,
  checkins,
  activities,
  documents,
  travisConversations,
  cohort,
  caseWorker,
}: ParticipantDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [newCheckinNotes, setNewCheckinNotes] = useState("");
  const [checkinType, setCheckinType] = useState("weekly");
  const [moodRating, setMoodRating] = useState<number>(3);
  const [engagementRating, setEngagementRating] = useState<number>(3);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [localCheckins, setLocalCheckins] = useState<Checkin[]>(checkins);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "enrolled":
        return "bg-green-100 text-green-700";
      case "on_hold":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "withdrawn":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "path_forward", label: "Path Forward" },
    { key: "checkins", label: "Check-ins" },
    { key: "travis", label: "Travis AI" },
    { key: "certifications", label: "Certifications" },
    { key: "documents", label: "Documents" },
    { key: "activity", label: "Activity" },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return formatDate(dateString);
  };

  // Parse path forward plan from JSON
  const pathForwardPlan = participant.path_forward_plan as {
    career_goal?: string;
    short_term_goals?: { goal: string; completed: boolean }[];
    long_term_goals?: { goal: string; completed: boolean }[];
    barriers?: string[];
    support_plan?: string;
  } | null;

  // Handle check-in submission
  const handleSubmitCheckin = async () => {
    if (!newCheckinNotes.trim()) {
      setCheckinError("Please enter check-in notes");
      return;
    }

    setIsSubmittingCheckin(true);
    setCheckinError(null);

    const result = await addCheckin(participant.id, {
      checkinType,
      notes: newCheckinNotes,
      moodRating,
      engagementRating,
    });

    if (result.success && result.data) {
      setLocalCheckins([result.data, ...localCheckins]);
      setNewCheckinNotes("");
      setCheckinType("weekly");
      setMoodRating(3);
      setEngagementRating(3);
    } else {
      setCheckinError(result.error || "Failed to save check-in");
    }

    setIsSubmittingCheckin(false);
  };

  // Get activity icon and color
  const getActivityStyle = (activityType: string) => {
    if (activityType.includes("travis") || activityType.includes("ai")) {
      return { bg: "bg-[#FBF6E9]", text: "text-[#C9A84C]", icon: Bot };
    }
    if (activityType.includes("certification") || activityType.includes("complete")) {
      return { bg: "bg-[#EFF4EB]", text: "text-[#5A7247]", icon: Award };
    }
    if (activityType.includes("check")) {
      return { bg: "bg-blue-50", text: "text-blue-600", icon: MessageSquare };
    }
    return { bg: "bg-blue-50", text: "text-blue-600", icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/program-management/participants"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participants
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-bold text-2xl">
              {participant.first_name.charAt(0)}
              {participant.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {participant.first_name} {participant.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-medium rounded-full">
                  {programNames[participant.program] || participant.program}
                </span>
                {cohort && (
                  <span className="text-sm text-[#555555]">{cohort.name}</span>
                )}
                <span className="text-[#888888]">•</span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    participant.status
                  )}`}
                >
                  {participant.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" onClick={() => setActiveTab("checkins")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Check-in
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1A1A1A]">Program Progress</span>
          <span className="text-sm text-[#888888]">
            Week {participant.current_week || 1} of 8
          </span>
        </div>
        <div className="h-3 bg-[#DDDDDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#5A7247] rounded-full transition-all"
            style={{ width: `${participant.progress_percentage || 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#888888]">
          <span>Enrolled: {formatDate(participant.enrolled_at)}</span>
          {cohort && <span>Cohort End: {formatDate(cohort.end_date)}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD] overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#888888] hover:text-[#555555]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Mail className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Email</p>
                      <p className="text-sm text-[#1A1A1A]">{participant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Phone className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Phone</p>
                      <p className="text-sm text-[#1A1A1A]">{participant.phone || "-"}</p>
                    </div>
                  </div>
                  {participant.address_line1 && (
                    <div className="sm:col-span-2 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Calendar className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Address</p>
                        <p className="text-sm text-[#1A1A1A]">
                          {participant.address_line1}
                          {participant.address_line2 && `, ${participant.address_line2}`}
                          <br />
                          {participant.city}, {participant.state} {participant.zip_code}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Goals & Barriers */}
              {(participant.goals || participant.barriers) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-[#DDDDDD] p-6"
                >
                  <h2 className="font-semibold text-[#1A1A1A] mb-4">Goals & Barriers</h2>
                  <div className="space-y-4">
                    {participant.goals && (
                      <div>
                        <p className="text-sm font-medium text-[#888888] mb-2">Goals</p>
                        <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                          {participant.goals}
                        </p>
                      </div>
                    )}
                    {participant.barriers && (
                      <div>
                        <p className="text-sm font-medium text-[#888888] mb-2">Barriers</p>
                        <p className="text-sm text-[#555555] bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                          {participant.barriers}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#DDDDDD]"
              >
                <div className="p-4 border-b border-[#DDDDDD]">
                  <h2 className="font-semibold text-[#1A1A1A]">Recent Activity</h2>
                </div>
                <div className="divide-y divide-[#DDDDDD]">
                  {activities.length > 0 ? (
                    activities.slice(0, 5).map((activity) => {
                      const style = getActivityStyle(activity.activity_type);
                      const Icon = style.icon;
                      return (
                        <div key={activity.id} className="p-4 flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm text-[#1A1A1A]">{activity.description}</p>
                            <p className="text-xs text-[#888888] mt-1">
                              {getRelativeTime(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-sm text-[#888888]">
                      No activity recorded yet
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "path_forward" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {pathForwardPlan ? (
                <>
                  {/* Career Goal */}
                  {pathForwardPlan.career_goal && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-[#C9A84C]" />
                        <h2 className="font-semibold text-[#1A1A1A]">Career Goal</h2>
                      </div>
                      <p className="text-lg font-medium text-[#1A1A1A]">
                        {pathForwardPlan.career_goal}
                      </p>
                    </div>
                  )}

                  {/* Short-term Goals */}
                  {pathForwardPlan.short_term_goals && pathForwardPlan.short_term_goals.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <h2 className="font-semibold text-[#1A1A1A] mb-4">Short-term Goals</h2>
                      <div className="space-y-3">
                        {pathForwardPlan.short_term_goals.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                item.completed ? "bg-[#5A7247]" : "bg-[#DDDDDD]"
                              }`}
                            >
                              {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                            <span
                              className={`text-sm ${
                                item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"
                              }`}
                            >
                              {item.goal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Long-term Goals */}
                  {pathForwardPlan.long_term_goals && pathForwardPlan.long_term_goals.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <h2 className="font-semibold text-[#1A1A1A] mb-4">Long-term Goals</h2>
                      <div className="space-y-3">
                        {pathForwardPlan.long_term_goals.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-lg"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                item.completed ? "bg-[#5A7247]" : "bg-[#DDDDDD]"
                              }`}
                            >
                              {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                            <span
                              className={`text-sm ${
                                item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"
                              }`}
                            >
                              {item.goal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Barriers & Support */}
                  {(pathForwardPlan.barriers || pathForwardPlan.support_plan) && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <h2 className="font-semibold text-[#1A1A1A] mb-4">Barriers & Support Plan</h2>
                      <div className="space-y-4">
                        {pathForwardPlan.barriers && pathForwardPlan.barriers.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-[#888888] mb-2">
                              Identified Barriers
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {pathForwardPlan.barriers.map((barrier, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full"
                                >
                                  {barrier}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {pathForwardPlan.support_plan && (
                          <div>
                            <p className="text-sm font-medium text-[#888888] mb-2">Support Plan</p>
                            <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                              {pathForwardPlan.support_plan}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center">
                  <Target className="h-12 w-12 text-[#DDDDDD] mx-auto mb-3" />
                  <h3 className="font-medium text-[#1A1A1A] mb-2">No Path Forward Plan Yet</h3>
                  <p className="text-sm text-[#888888] mb-4">
                    Create a personalized development plan for this participant.
                  </p>
                  <Button>Create Plan</Button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "checkins" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Add Check-in Form */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Add Check-in Note</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkin-type">Check-in Type</Label>
                      <Select value={checkinType} onValueChange={(value) => value && setCheckinType(value)}>
                        <SelectTrigger id="checkin-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="ad_hoc">Ad-hoc</SelectItem>
                          <SelectItem value="follow_up">Follow-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="mood">Mood (1-5)</Label>
                        <Input
                          id="mood"
                          type="number"
                          min={1}
                          max={5}
                          value={moodRating}
                          onChange={(e) => setMoodRating(parseInt(e.target.value) || 3)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="engagement">Engagement (1-5)</Label>
                        <Input
                          id="engagement"
                          type="number"
                          min={1}
                          max={5}
                          value={engagementRating}
                          onChange={(e) => setEngagementRating(parseInt(e.target.value) || 3)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="checkin-notes">Notes</Label>
                    <Textarea
                      id="checkin-notes"
                      placeholder="Record your check-in notes..."
                      value={newCheckinNotes}
                      onChange={(e) => setNewCheckinNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  {checkinError && (
                    <p className="text-sm text-red-600">{checkinError}</p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitCheckin}
                      disabled={isSubmittingCheckin || !newCheckinNotes.trim()}
                    >
                      {isSubmittingCheckin && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Check-in
                    </Button>
                  </div>
                </div>
              </div>

              {/* Check-in History */}
              <div className="bg-white rounded-xl border border-[#DDDDDD]">
                <div className="p-4 border-b border-[#DDDDDD]">
                  <h2 className="font-semibold text-[#1A1A1A]">Check-in History</h2>
                </div>
                <div className="divide-y divide-[#DDDDDD]">
                  {localCheckins.length > 0 ? (
                    localCheckins.map((checkin) => (
                      <div key={checkin.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#888888]" />
                            <span className="text-sm font-medium text-[#1A1A1A]">
                              {formatDateTime(checkin.created_at)}
                            </span>
                            <span className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded-full capitalize">
                              {checkin.checkin_type.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#888888]">
                            {checkin.mood_rating && (
                              <span>Mood: {checkin.mood_rating}/5</span>
                            )}
                            {checkin.engagement_rating && (
                              <span>• Engagement: {checkin.engagement_rating}/5</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-[#555555]">{checkin.notes}</p>
                        {checkin.action_items && checkin.action_items.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#DDDDDD]">
                            <p className="text-xs text-[#888888] mb-1">Action Items:</p>
                            <ul className="text-sm text-[#555555] list-disc list-inside">
                              {checkin.action_items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-[#888888]">
                      No check-ins recorded yet. Add one above.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "travis" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Travis Summary */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-[#C9A84C]" />
                  <h2 className="font-semibold text-[#1A1A1A]">Travis AI Summary</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Last Interaction</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {participant.travis_last_interaction
                        ? getRelativeTime(participant.travis_last_interaction)
                        : "No interactions yet"}
                    </p>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Total Conversations</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {travisConversations.length}
                    </p>
                  </div>
                </div>
                {participant.travis_conversation_summary && (
                  <div className="mt-4">
                    <p className="text-xs text-[#888888] mb-2">Conversation Summary</p>
                    <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                      {participant.travis_conversation_summary}
                    </p>
                  </div>
                )}
                {participant.travis_escalation_flags &&
                  participant.travis_escalation_flags.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 font-medium mb-2">Escalation Flags</p>
                      <div className="flex flex-wrap gap-2">
                        {participant.travis_escalation_flags.map((flag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Conversation History */}
              <div className="bg-white rounded-xl border border-[#DDDDDD]">
                <div className="p-4 border-b border-[#DDDDDD]">
                  <h2 className="font-semibold text-[#1A1A1A]">Conversation History</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {travisConversations.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {travisConversations.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === "user"
                                ? "bg-[#FBF6E9] text-[#1A1A1A]"
                                : "bg-[#FAFAF8] text-[#555555]"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-[#888888] mt-1">
                              {formatDateTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bot className="h-12 w-12 text-[#DDDDDD] mx-auto mb-3" />
                      <p className="text-sm text-[#888888]">No Travis conversations yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "certifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Certifications</h2>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {/* Google IT Support Certificate */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#C9A84C]" />
                      <span className="font-medium text-[#1A1A1A]">
                        Google IT Support Certificate
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        participant.google_it_cert_status === "passed"
                          ? "bg-green-100 text-green-700"
                          : participant.google_it_cert_status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {participant.google_it_cert_status?.replace("_", " ") || "Not Started"}
                    </span>
                  </div>
                  {participant.google_it_cert_status === "in_progress" && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A7247] rounded-full"
                          style={{ width: `${participant.progress_percentage || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#888888]">
                        {participant.progress_percentage || 0}%
                      </span>
                    </div>
                  )}
                  {participant.google_it_cert_date && (
                    <p className="text-sm text-[#888888] mt-2">
                      Certified: {formatDate(participant.google_it_cert_date)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A]">Documents</h2>
                <Button variant="outline" size="sm">
                  Upload Document
                </Button>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FBF6E9]">
                          <FileText className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#1A1A1A]">{doc.title}</p>
                          <p className="text-xs text-[#888888]">
                            {doc.document_type} • {formatDate(doc.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-[#888888]">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Activity Timeline</h2>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const style = getActivityStyle(activity.activity_type);
                    const Icon = style.icon;
                    return (
                      <div key={activity.id} className="p-4 flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-[#1A1A1A]">{activity.description}</p>
                          <p className="text-xs text-[#888888] mt-1">
                            {formatDateTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-sm text-[#888888]">
                    No activity recorded yet
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Worker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Case Worker</h3>
            {caseWorker ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                  {caseWorker.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{caseWorker.full_name}</p>
                  <p className="text-xs text-[#888888]">Case Worker</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#888888]">No case worker assigned</p>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Progress</span>
                <span className="text-sm font-semibold text-[#5A7247]">
                  {participant.progress_percentage || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Current Week</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {participant.current_week || 1} of 8
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Check-ins</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">{localCheckins.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Travis Interactions</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {travisConversations.length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Phone className="h-4 w-4" />
                Call Participant
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Award className="h-4 w-4" />
                Generate Certificate
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <FileText className="h-4 w-4" />
                Generate Progress Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
