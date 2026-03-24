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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateLeadStatus, deleteLead, convertLeadToParticipant, convertLeadToClient, updateLead } from "@/lib/actions/leads";
import type { Lead, LeadStatus } from "@/types/database";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  performed_by: string | null;
  metadata: Record<string, unknown> | null;
}

interface LeadDetailViewProps {
  lead: Lead;
  activities: Activity[];
}

export function LeadDetailView({ lead, activities }: LeadDetailViewProps) {
  const router = useRouter();
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);

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
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                    lead.lead_type
                  )}`}
                >
                  {lead.lead_type}
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

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD]">
        <nav className="flex gap-6">
          {(["overview", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#888888] hover:text-[#555555]"
              }`}
            >
              {tab}
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
                      <p className="text-sm text-[#1A1A1A]">{lead.email}</p>
                    </div>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Phone className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Phone</p>
                        <p className="text-sm text-[#1A1A1A]">{lead.phone}</p>
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
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Calendar className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Created</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Interests (for MSP leads) */}
              {lead.lead_type === "msp" && lead.service_interests && lead.service_interests.length > 0 && (
                <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                  <h2 className="font-semibold text-[#1A1A1A] mb-4">Services Interested In</h2>
                  <div className="flex flex-wrap gap-2">
                    {lead.service_interests.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-[#EFF4EB] text-[#5A7247] text-sm rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Notes</h2>
                {lead.notes && (
                  <pre className="text-sm text-[#555555] mb-4 p-3 bg-[#FAFAF8] rounded-lg whitespace-pre-wrap font-sans">
                    {lead.notes}
                  </pre>
                )}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || isUpdating}>
                    {isUpdating ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </div>
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
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Lead
                </a>
              )}
              <a
                href={`mailto:${lead.email}`}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              <button
                onClick={() => {
                  const textarea = document.querySelector("textarea");
                  textarea?.focus();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
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
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
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
            <p className="text-sm text-[#555555]">{lead.source || "Website"}</p>
            {lead.utm_campaign && (
              <p className="text-xs text-[#888888] mt-1">Campaign: {lead.utm_campaign}</p>
            )}
          </div>

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
