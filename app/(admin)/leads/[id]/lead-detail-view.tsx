"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  Send,
  Bot,
  MessageSquare,
  Clock,
  DollarSign,
  Users,
  Monitor,
  AlertTriangle,
  Zap,
  TrendingUp,
  Shield,
  Cloud,
  Server,
  Wifi,
  Target,
  CheckCircle2,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateLeadStatus, deleteLead, convertLeadToParticipant, convertLeadToClient, updateLead } from "@/lib/actions/leads";
import type { Lead, LeadStatus, ProgramAssessmentData, EnhancedITAssessmentData, BarrierType, SupportNeedType, ReadinessLevel, ProgramType, AILeadClassification } from "@/types/database";
import { ScoreGauge, ValueDisplay, InsightCard, ServiceTagPills } from "@/components/admin/crm";
import { triggerClassification } from "@/lib/ai/classify-lead";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  performed_by: string | null;
  metadata: Record<string, unknown> | null;
}

interface AIClassificationExtended extends Partial<AILeadClassification> {
  current_challenges?: string[];
  company_size?: string;
}

interface LeadDetailViewProps {
  lead: Lead;
  activities: Activity[];
}

export function LeadDetailView({ lead, activities }: LeadDetailViewProps) {
  const router = useRouter();
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "assessment" | "activity">("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);

  // Parse AI classification data
  const aiData: AIClassificationExtended = (lead.ai_classification as AIClassificationExtended) || {};

  // Parse assessment data based on lead type
  const programAssessment = lead.lead_type === "program"
    ? (lead.assessment_data as ProgramAssessmentData | null)
    : null;
  const itAssessment = lead.lead_type === "msp"
    ? (lead.assessment_data as EnhancedITAssessmentData | null)
    : null;

  const hasAssessmentData = (lead.lead_type === "msp" && (itAssessment || Object.keys(aiData).length > 0)) ||
    (lead.lead_type === "program" && (programAssessment || lead.recommended_programs?.length));

  const priorityScore = lead.priority_score ?? aiData.priority_score ?? 0;
  const estimatedValue = lead.estimated_value ?? aiData.estimated_value ?? 0;
  const fitScore = lead.fit_score ?? aiData.fit_score ?? 0;
  const readinessLevel = lead.readiness_level ?? aiData.readiness_level;
  const barriers = lead.barriers ?? aiData.barriers_identified ?? [];
  const supportNeeds = lead.support_needs ?? aiData.support_needs ?? [];
  const recommendedPrograms = lead.recommended_programs ?? aiData.recommended_programs ?? [];

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

  const getProgramName = (slug: string | null) => {
    if (!slug) return null;
    const programs: Record<string, string> = {
      father_forward: "Father Forward",
      tech_ready_youth: "Tech-Ready Youth",
      making_moments: "Making Moments",
      from_script_to_screen: "From Script to Screen",
      stories_from_my_future: "Stories from My Future",
      lula: "LULA",
    };
    return programs[slug] || slug;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead_created":
        return UserPlus;
      case "lead_updated":
        return Edit;
      case "status_change":
        return Clock;
      case "note_added":
        return MessageSquare;
      case "email_sent":
        return Send;
      case "ai_classification":
        return Bot;
      default:
        return User;
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setIsUpdating(true);
    try {
      const result = await updateLeadStatus(lead.id, newStatus);
      if (result.success) {
        setCurrentStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteLead(lead.id);
      if (result.success) {
        router.push("/leads");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertToParticipant = async () => {
    if (!confirm("Convert this lead to a program participant?")) {
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertLeadToParticipant(lead.id);
      if (result.success && result.data) {
        router.push(`/program-management/participants/${result.data.participantId}`);
      }
    } catch (error) {
      console.error("Error converting to participant:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertToClient = async () => {
    if (!confirm("Convert this lead to an MSP client?")) {
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertLeadToClient(lead.id);
      if (result.success && result.data) {
        router.push(`/clients/${result.data.clientId}`);
      }
    } catch (error) {
      console.error("Error converting to client:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsUpdating(true);
    try {
      const existingNotes = lead.notes || "";
      const timestamp = new Date().toLocaleString();
      const updatedNotes = existingNotes
        ? `${existingNotes}\n\n[${timestamp}]\n${newNote}`
        : `[${timestamp}]\n${newNote}`;

      const result = await updateLead(lead.id, { notes: updatedNotes });
      if (result.success) {
        setNewNote("");
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Generate insights from AI data
  const getInsights = () => {
    const insights: Array<{ type: "pain_point" | "recommendation" | "opportunity" | "urgent"; title: string; description: string }> = [];

    if (aiData.pain_points) {
      aiData.pain_points.forEach((point) => {
        insights.push({
          type: "pain_point",
          title: "Pain Point Identified",
          description: point,
        });
      });
    }

    if (aiData.current_challenges) {
      aiData.current_challenges.forEach((challenge) => {
        insights.push({
          type: "pain_point",
          title: "Current Challenge",
          description: challenge,
        });
      });
    }

    if (aiData.recommended_package) {
      insights.push({
        type: "recommendation",
        title: "Recommended Solution",
        description: `${aiData.recommended_package} package would best fit their needs and budget.`,
      });
    }

    if (aiData.urgency_level === "high" || aiData.urgency_level === "critical") {
      insights.push({
        type: "urgent",
        title: "High Priority Lead",
        description: "This lead has urgent IT needs that should be addressed promptly.",
      });
    }

    if (priorityScore >= 70) {
      insights.push({
        type: "opportunity",
        title: "High-Value Opportunity",
        description: `Strong fit for services with estimated ${formatCurrency(estimatedValue)}/month potential.`,
      });
    }

    return insights;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Show assessment tab for MSP and Program leads
  const tabs = (lead.lead_type === "msp" || lead.lead_type === "program")
    ? (["overview", "assessment", "activity"] as const)
    : (["overview", "activity"] as const);

  // Handle AI classification trigger
  const handleRunClassification = async () => {
    setIsClassifying(true);
    try {
      const result = await triggerClassification(lead.id);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Classification failed:", result.error);
      }
    } catch (error) {
      console.error("Error running classification:", error);
    } finally {
      setIsClassifying(false);
    }
  };

  // Format barriers and support needs for display
  const formatBarrier = (barrier: BarrierType): string => {
    const mapping: Record<string, string> = {
      transportation: "Transportation",
      childcare: "Childcare",
      housing: "Housing",
      legal: "Legal Issues",
      health: "Health",
      financial: "Financial",
      time: "Time Constraints",
      technology: "Technology Access",
      education: "Education",
      language: "Language Barrier",
      other: "Other",
    };
    return mapping[barrier] || barrier;
  };

  const formatSupportNeed = (need: SupportNeedType): string => {
    const mapping: Record<string, string> = {
      job_training: "Job Training",
      certification: "Certification",
      mentorship: "Mentorship",
      counseling: "Counseling",
      financial_aid: "Financial Aid",
      childcare_support: "Childcare Support",
      transportation_help: "Transportation Help",
      resume_help: "Resume Assistance",
      interview_prep: "Interview Prep",
      networking: "Networking",
      housing_support: "Housing Support",
      legal_aid: "Legal Aid",
      technology_access: "Technology Access",
      other: "Other",
    };
    return mapping[need] || need;
  };

  const formatProgramName = (program: ProgramType): string => {
    const mapping: Record<string, string> = {
      father_forward: "Father Forward",
      tech_ready_youth: "Tech-Ready Youth",
      making_moments: "Making Moments",
      from_script_to_screen: "From Script to Screen",
      stories_from_my_future: "Stories from My Future",
      lula: "LULA",
    };
    return mapping[program] || program;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/leads"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-bold text-2xl">
              {lead.first_name.charAt(0)}
              {lead.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {lead.first_name} {lead.last_name}
              </h1>
              {lead.organization && (
                <p className="text-[#555555] mt-0.5">{lead.organization}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                    lead.lead_type
                  )}`}
                >
                  {lead.lead_type === "msp" ? "IT Services" : lead.lead_type}
                </span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  {currentStatus}
                </span>
                {lead.program_interest && (
                  <span className="text-sm text-[#555555]">
                    Interest: {getProgramName(lead.program_interest)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/leads/${lead.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            {lead.lead_type === "program" && currentStatus !== "converted" && (
              <Button size="sm" onClick={handleConvertToParticipant} disabled={isConverting}>
                <UserPlus className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert to Participant"}
              </Button>
            )}
            {lead.lead_type === "msp" && currentStatus !== "converted" && (
              <Button size="sm" onClick={handleConvertToClient} disabled={isConverting}>
                <Building2 className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert to Client"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* MSP Lead: Score Cards Row */}
      {lead.lead_type === "msp" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Priority Score */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5 flex items-center gap-4">
            <ScoreGauge score={priorityScore} size="sm" />
            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Priority Score</p>
              <p className="text-sm text-[#555555] mt-1">Lead quality rating</p>
            </div>
          </div>

          {/* Estimated Value */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[#FBF6E9]">
                <DollarSign className="h-4 w-4 text-[#C9A84C]" />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Estimated Value</p>
            </div>
            <ValueDisplay
              monthlyValue={estimatedValue}
              confidence={priorityScore >= 70 ? "high" : priorityScore >= 40 ? "medium" : "low"}
              size="sm"
            />
          </div>

          {/* Infrastructure - Users */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[#EFF4EB]">
                <Users className="h-4 w-4 text-[#5A7247]" />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Users</p>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {aiData.infrastructure_summary?.users ?? "—"}
            </p>
            <p className="text-xs text-[#888888] mt-1">Estimated user count</p>
          </div>

          {/* Infrastructure - Devices */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Monitor className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Devices</p>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {aiData.infrastructure_summary?.devices ?? "—"}
            </p>
            <p className="text-xs text-[#888888] mt-1">Workstations & servers</p>
          </div>
        </div>
      )}

      {/* Program Lead: Score Cards Row */}
      {lead.lead_type === "program" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fit Score */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5 flex items-center gap-4">
            <ScoreGauge score={fitScore} size="sm" />
            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Fit Score</p>
              <p className="text-sm text-[#555555] mt-1">Program compatibility</p>
            </div>
          </div>

          {/* Priority Score */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[#FBF6E9]">
                <Target className="h-4 w-4 text-[#C9A84C]" />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Priority</p>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{priorityScore}</p>
            <p className="text-xs text-[#888888] mt-1">Lead priority score</p>
          </div>

          {/* Readiness Level */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${
                readinessLevel === "high" ? "bg-green-50" :
                readinessLevel === "medium" ? "bg-yellow-50" : "bg-red-50"
              }`}>
                <CheckCircle2 className={`h-4 w-4 ${
                  readinessLevel === "high" ? "text-green-600" :
                  readinessLevel === "medium" ? "text-yellow-600" : "text-red-600"
                }`} />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Readiness</p>
            </div>
            <p className="text-lg font-bold text-[#1A1A1A] capitalize">{readinessLevel || "—"}</p>
            <p className="text-xs text-[#888888] mt-1">Program readiness</p>
          </div>

          {/* Barriers Count */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-xs text-[#888888] uppercase tracking-wide font-medium">Barriers</p>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{barriers.length}</p>
            <p className="text-xs text-[#888888] mt-1">Identified barriers</p>
          </div>
        </div>
      )}

      {/* Program Lead: Recommended Programs */}
      {lead.lead_type === "program" && recommendedPrograms.length > 0 && (
        <div className="bg-gradient-to-r from-[#FBF6E9] to-[#EFF4EB] rounded-xl border border-[#E8D48B] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-semibold text-[#1A1A1A]">Recommended Programs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendedPrograms.slice(0, 3).map((program, index) => (
              <div
                key={program}
                className={`p-4 rounded-lg bg-white border ${
                  index === 0 ? "border-[#C9A84C] ring-2 ring-[#C9A84C]/20" : "border-[#DDDDDD]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    index === 0 ? "bg-[#FBF6E9] text-[#C9A84C]" : "bg-gray-100 text-gray-600"
                  }`}>
                    {index === 0 ? "Best Match" : `Option ${index + 1}`}
                  </span>
                </div>
                <p className="font-semibold text-[#1A1A1A]">{formatProgramName(program)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MSP Lead: AI Insights */}
      {lead.lead_type === "msp" && hasAssessmentData && getInsights().length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-[#C9A84C]" />
            <h2 className="font-semibold text-[#1A1A1A]">AI Assessment Insights</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {getInsights().slice(0, 4).map((insight, index) => (
              <InsightCard key={index} {...insight} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD]">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#888888] hover:text-[#555555]"
              }`}
            >
              {tab === "assessment" ? "Assessment Details" : tab}
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
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Mail className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Email</p>
                      <a href={`mailto:${lead.email}`} className="text-sm text-[#1A1A1A] hover:text-[#C9A84C] transition-colors">
                        {lead.email}
                      </a>
                    </div>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Phone className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Phone</p>
                        <a href={`tel:${lead.phone}`} className="text-sm text-[#1A1A1A] hover:text-[#C9A84C] transition-colors">
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {lead.organization && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Building2 className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Organization</p>
                        <p className="text-sm text-[#1A1A1A]">{lead.organization}</p>
                      </div>
                    </div>
                  )}
                  {lead.title && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <User className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Title</p>
                        <p className="text-sm text-[#1A1A1A]">{lead.title}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Calendar className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Created</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {new Date(lead.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Interests (for MSP leads) */}
              {lead.lead_type === "msp" && lead.service_interests && lead.service_interests.length > 0 && (
                <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                  <h2 className="font-semibold text-[#1A1A1A] mb-4">Services Interested In</h2>
                  <ServiceTagPills services={lead.service_interests} />
                </div>
              )}

              {/* Notes */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Notes</h2>
                {lead.notes && (
                  <pre className="text-sm text-[#555555] mb-4 p-4 bg-[#FAFAF8] rounded-lg whitespace-pre-wrap font-sans border border-[#DDDDDD]">
                    {lead.notes}
                  </pre>
                )}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || isUpdating}>
                    {isUpdating ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "assessment" && (lead.lead_type === "msp" || lead.lead_type === "program") && (
            <>
              {/* AI Classification Actions */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-[#C9A84C]" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">AI Classification</p>
                    <p className="text-xs text-[#888888]">
                      {aiData.classified_at
                        ? `Last run: ${new Date(aiData.classified_at).toLocaleString()}`
                        : "Not yet classified"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunClassification}
                  disabled={isClassifying}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isClassifying ? "Classifying..." : "Run AI Classification"}
                </Button>
              </div>

              {/* Program Assessment Content */}
              {lead.lead_type === "program" && (
                <>
                  {programAssessment ? (
                    <>
                      {/* Personal Info */}
                      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                        <h2 className="font-semibold text-[#1A1A1A] mb-4">Personal Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#FBF6E9]">
                              <User className="h-4 w-4 text-[#C9A84C]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#888888]">Is Father</p>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {programAssessment.isFather ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                          {programAssessment.numberOfChildren && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[#FBF6E9]">
                                <Users className="h-4 w-4 text-[#C9A84C]" />
                              </div>
                              <div>
                                <p className="text-xs text-[#888888]">Children</p>
                                <p className="text-sm font-medium text-[#1A1A1A]">
                                  {programAssessment.numberOfChildren}
                                  {programAssessment.childrenAges?.length
                                    ? ` (Ages: ${programAssessment.childrenAges.join(", ")})`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#FBF6E9]">
                              <Building2 className="h-4 w-4 text-[#C9A84C]" />
                            </div>
                            <div>
                              <p className="text-xs text-[#888888]">Employment</p>
                              <p className="text-sm font-medium text-[#1A1A1A] capitalize">
                                {programAssessment.currentEmploymentStatus?.replace(/_/g, " ") || "Not specified"}
                              </p>
                            </div>
                          </div>
                          {programAssessment.highestEducation && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[#FBF6E9]">
                                <Target className="h-4 w-4 text-[#C9A84C]" />
                              </div>
                              <div>
                                <p className="text-xs text-[#888888]">Education</p>
                                <p className="text-sm font-medium text-[#1A1A1A] capitalize">
                                  {programAssessment.highestEducation?.replace(/_/g, " ")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Barriers */}
                      {barriers.length > 0 && (
                        <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <h2 className="font-semibold text-[#1A1A1A]">Identified Barriers</h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {barriers.map((barrier) => (
                              <span
                                key={barrier}
                                className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full"
                              >
                                {formatBarrier(barrier as BarrierType)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Support Needs */}
                      {supportNeeds.length > 0 && (
                        <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-[#5A7247]" />
                            <h2 className="font-semibold text-[#1A1A1A]">Support Needs</h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {supportNeeds.map((need) => (
                              <span
                                key={need}
                                className="px-3 py-1.5 bg-[#EFF4EB] text-[#5A7247] text-sm rounded-full"
                              >
                                {formatSupportNeed(need as SupportNeedType)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Goals & Availability */}
                      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                        <h2 className="font-semibold text-[#1A1A1A] mb-4">Goals & Availability</h2>
                        <div className="space-y-4">
                          {programAssessment.primaryGoal && (
                            <div>
                              <p className="text-xs text-[#888888] uppercase tracking-wide mb-1">Primary Goal</p>
                              <p className="text-sm text-[#1A1A1A] capitalize">
                                {programAssessment.primaryGoal.replace(/_/g, " ")}
                              </p>
                            </div>
                          )}
                          {programAssessment.sixMonthVision && (
                            <div>
                              <p className="text-xs text-[#888888] uppercase tracking-wide mb-1">6-Month Vision</p>
                              <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                                &ldquo;{programAssessment.sixMonthVision}&rdquo;
                              </p>
                            </div>
                          )}
                          {programAssessment.whatBroughtYouHere && (
                            <div>
                              <p className="text-xs text-[#888888] uppercase tracking-wide mb-1">What Brought Them Here</p>
                              <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                                &ldquo;{programAssessment.whatBroughtYouHere}&rdquo;
                              </p>
                            </div>
                          )}
                          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#DDDDDD]">
                            <div>
                              <p className="text-xs text-[#888888]">Schedule</p>
                              <p className="text-sm font-medium text-[#1A1A1A] capitalize">
                                {programAssessment.preferredSchedule?.replace(/_/g, " ") || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#888888]">Transportation</p>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {programAssessment.hasReliableTransportation ? "Yes" : "No / Needs Help"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#888888]">Childcare Needs</p>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {programAssessment.hasChildcareNeeds ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      {aiData.reasoning && (
                        <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Bot className="h-5 w-5 text-[#C9A84C]" />
                            <h2 className="font-semibold text-[#1A1A1A]">AI Analysis</h2>
                          </div>
                          <p className="text-sm text-[#555555] leading-relaxed">{aiData.reasoning}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center">
                      <Bot className="h-12 w-12 text-[#DDDDDD] mx-auto mb-3" />
                      <h3 className="font-semibold text-[#1A1A1A] mb-2">No Assessment Data</h3>
                      <p className="text-sm text-[#888888] max-w-md mx-auto">
                        This lead has not completed a program assessment. Assessment data will appear here once they complete the assessment form at /get-involved/assess.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* MSP Assessment Content */}
              {lead.lead_type === "msp" && (
                hasAssessmentData ? (
                  <>
                    {/* Infrastructure Summary */}
                  <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                    <h2 className="font-semibold text-[#1A1A1A] mb-4">Infrastructure Summary</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-[#FAFAF8] rounded-lg text-center">
                        <Users className="h-6 w-6 text-[#5A7247] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {aiData.infrastructure_summary?.users ?? "—"}
                        </p>
                        <p className="text-xs text-[#888888]">Users</p>
                      </div>
                      <div className="p-4 bg-[#FAFAF8] rounded-lg text-center">
                        <Monitor className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {aiData.infrastructure_summary?.devices ?? "—"}
                        </p>
                        <p className="text-xs text-[#888888]">Devices</p>
                      </div>
                      <div className="p-4 bg-[#FAFAF8] rounded-lg text-center">
                        <Server className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {aiData.infrastructure_summary?.servers ?? "—"}
                        </p>
                        <p className="text-xs text-[#888888]">Servers</p>
                      </div>
                      <div className="p-4 bg-[#FAFAF8] rounded-lg text-center">
                        <MapPin className="h-6 w-6 text-[#C9A84C] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {aiData.infrastructure_summary?.locations ?? "—"}
                        </p>
                        <p className="text-xs text-[#888888]">Locations</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Classification Reasoning */}
                  {aiData.reasoning && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Bot className="h-5 w-5 text-[#C9A84C]" />
                        <h2 className="font-semibold text-[#1A1A1A]">AI Analysis</h2>
                      </div>
                      <p className="text-sm text-[#555555] leading-relaxed">{aiData.reasoning}</p>
                    </div>
                  )}

                  {/* Pain Points */}
                  {aiData.pain_points && aiData.pain_points.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h2 className="font-semibold text-[#1A1A1A]">Identified Pain Points</h2>
                      </div>
                      <ul className="space-y-3">
                        {aiData.pain_points.map((point, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <div className="p-1 bg-red-100 rounded mt-0.5">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                            </div>
                            <span className="text-[#555555]">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Compliance & Security (Enhanced Fields) */}
                  {(lead.compliance_requirements?.length || lead.disaster_recovery_status || itAssessment) && (
                    <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="h-5 w-5 text-[#5A7247]" />
                        <h2 className="font-semibold text-[#1A1A1A]">Compliance & Security</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Compliance Requirements */}
                        <div>
                          <p className="text-xs text-[#888888] uppercase tracking-wide mb-2">Compliance Requirements</p>
                          {(lead.compliance_requirements || itAssessment?.complianceRequirements)?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {(lead.compliance_requirements || itAssessment?.complianceRequirements)?.map((req) => (
                                <span
                                  key={req}
                                  className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full uppercase"
                                >
                                  {req === "pci_dss" ? "PCI-DSS" : req.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-[#888888]">None specified</p>
                          )}
                        </div>

                        {/* Disaster Recovery */}
                        <div>
                          <p className="text-xs text-[#888888] uppercase tracking-wide mb-2">Disaster Recovery</p>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            (lead.disaster_recovery_status || itAssessment?.disasterRecoveryStatus) === "has_plan"
                              ? "bg-green-100 text-green-700"
                              : (lead.disaster_recovery_status || itAssessment?.disasterRecoveryStatus) === "partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {(lead.disaster_recovery_status || itAssessment?.disasterRecoveryStatus) === "has_plan"
                              ? "Has DR Plan"
                              : (lead.disaster_recovery_status || itAssessment?.disasterRecoveryStatus) === "partial"
                              ? "Partial Coverage"
                              : "No DR Plan"}
                          </span>
                          {itAssessment?.currentBackupSolution && (
                            <p className="text-xs text-[#555555] mt-2">
                              Current: {itAssessment.currentBackupSolution}
                            </p>
                          )}
                        </div>

                        {/* Growth Projections */}
                        {(lead.growth_projection_users || itAssessment?.growthProjectionUsers) && (
                          <div>
                            <p className="text-xs text-[#888888] uppercase tracking-wide mb-2">Expected Growth (12 mo)</p>
                            <p className="text-lg font-semibold text-[#5A7247]">
                              +{lead.growth_projection_users || itAssessment?.growthProjectionUsers} users
                            </p>
                          </div>
                        )}

                        {/* Office Locations & Remote */}
                        <div>
                          <p className="text-xs text-[#888888] uppercase tracking-wide mb-2">Locations & Remote</p>
                          <div className="flex gap-4">
                            {(lead.office_count || itAssessment?.officeCount) && (
                              <div className="text-center">
                                <p className="text-lg font-semibold text-[#1A1A1A]">
                                  {lead.office_count || itAssessment?.officeCount}
                                </p>
                                <p className="text-xs text-[#888888]">Offices</p>
                              </div>
                            )}
                            {(lead.remote_worker_percent !== null || itAssessment?.remoteWorkerPercent) && (
                              <div className="text-center">
                                <p className="text-lg font-semibold text-[#1A1A1A]">
                                  {lead.remote_worker_percent ?? itAssessment?.remoteWorkerPercent}%
                                </p>
                                <p className="text-xs text-[#888888]">Remote</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stakeholder Concerns */}
                      {itAssessment?.stakeholderConcerns?.length && (
                        <div className="mt-6 pt-4 border-t border-[#DDDDDD]">
                          <p className="text-xs text-[#888888] uppercase tracking-wide mb-2">Stakeholder Concerns</p>
                          <div className="flex flex-wrap gap-2">
                            {itAssessment.stakeholderConcerns.map((concern) => (
                              <span
                                key={concern}
                                className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full"
                              >
                                {concern}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommended Package */}
                  {aiData.recommended_package && (
                    <div className="bg-gradient-to-r from-[#FBF6E9] to-[#EFF4EB] rounded-xl border border-[#E8D48B] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-[#C9A84C]" />
                        <h2 className="font-semibold text-[#1A1A1A]">Recommended Solution</h2>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#1A1A1A]">{aiData.recommended_package}</p>
                          <p className="text-sm text-[#555555] mt-1">
                            Estimated at {formatCurrency(estimatedValue)}/month
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            aiData.urgency_level === "high" || aiData.urgency_level === "critical"
                              ? "bg-red-100 text-red-700"
                              : aiData.urgency_level === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {aiData.urgency_level || "Normal"} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center">
                  <Bot className="h-12 w-12 text-[#DDDDDD] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">No Assessment Data</h3>
                  <p className="text-sm text-[#888888] max-w-md mx-auto">
                    This lead has not completed an IT assessment. Assessment data will appear here once the lead fills out the assessment form.
                  </p>
                </div>
              )
              )}
            </>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-xl border border-[#DDDDDD]">
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Activity Timeline</h2>
              </div>
              {activities.length > 0 ? (
                <div className="divide-y divide-[#DDDDDD]">
                  {activities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.activity_type);
                    return (
                      <div key={activity.id} className="p-4 flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            activity.activity_type.includes("ai")
                              ? "bg-[#FBF6E9] text-[#C9A84C]"
                              : "bg-[#EFF4EB] text-[#5A7247]"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#1A1A1A]">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#888888]">
                              {activity.performed_by || "System"}
                            </span>
                            <span className="text-xs text-[#DDDDDD]">•</span>
                            <span className="text-xs text-[#888888]">
                              {new Date(activity.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                  <p className="text-sm text-[#888888]">No activity recorded yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#555555] hover:bg-[#EFF4EB] hover:text-[#5A7247] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Lead
                </a>
              )}
              <a
                href={`mailto:${lead.email}`}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#555555] hover:bg-[#FBF6E9] hover:text-[#C9A84C] transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setTimeout(() => {
                    const textarea = document.querySelector("textarea");
                    textarea?.focus();
                  }, 100);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Update Status</h3>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              disabled={isUpdating}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C]"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Lead Source */}
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Lead Source</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#888888]" />
                <span className="text-[#555555]">{lead.source || "Website"}</span>
              </div>
              {lead.utm_campaign && (
                <p className="text-xs text-[#888888] pl-6">Campaign: {lead.utm_campaign}</p>
              )}
              {lead.utm_source && (
                <p className="text-xs text-[#888888] pl-6">Source: {lead.utm_source}</p>
              )}
              {lead.referral_source && (
                <p className="text-xs text-[#888888] pl-6">Referral: {lead.referral_source}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
              <h3 className="font-semibold text-[#1A1A1A] mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-[#F5F3EF] text-[#555555] text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-4">
            <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Lead"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
