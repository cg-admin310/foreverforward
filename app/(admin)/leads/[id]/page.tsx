"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/badge";
import { Textarea } from "@/components/ui/textarea";

// Sample lead data - would come from Supabase
const sampleLead = {
  id: "1",
  first_name: "Marcus",
  last_name: "Johnson",
  email: "marcus.j@email.com",
  phone: "(323) 555-0123",
  organization: null,
  lead_type: "program",
  status: "new",
  source: "website",
  program_interest: "father_forward",
  service_interests: null,
  ai_classification: {
    lead_type: "program",
    program_interest: "father_forward",
    priority_score: 85,
    reasoning:
      "Strong interest in Father Forward program. Mentioned having two children and wanting to improve tech skills. Good fit for upcoming cohort.",
  },
  assigned_to: "TJ Wilform",
  notes: "Called to inquire about program start dates. Very motivated.",
  created_at: "2026-03-22T10:30:00Z",
  updated_at: "2026-03-22T10:30:00Z",
};

const activities = [
  {
    id: 1,
    type: "created",
    message: "Lead created from website enrollment form",
    user: "System",
    time: "Mar 22, 2026 at 10:30 AM",
    icon: UserPlus,
  },
  {
    id: 2,
    type: "ai",
    message: "AI classified lead as Father Forward program interest with 85% priority",
    user: "Travis AI",
    time: "Mar 22, 2026 at 10:30 AM",
    icon: Bot,
  },
  {
    id: 3,
    type: "assigned",
    message: "Lead assigned to TJ Wilform",
    user: "System",
    time: "Mar 22, 2026 at 10:31 AM",
    icon: User,
  },
];

const emails = [
  {
    id: 1,
    subject: "Welcome to Forever Forward",
    status: "sent",
    sent_at: "Mar 22, 2026 at 10:32 AM",
  },
];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "emails">("overview");

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
      script_to_screen: "From Script to Screen",
      stories_future: "Stories from My Future",
      lula: "LULA",
    };
    return programs[slug] || slug;
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
              {sampleLead.first_name.charAt(0)}
              {sampleLead.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {sampleLead.first_name} {sampleLead.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                    sampleLead.lead_type
                  )}`}
                >
                  {sampleLead.lead_type}
                </span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    sampleLead.status
                  )}`}
                >
                  {sampleLead.status}
                </span>
                {sampleLead.program_interest && (
                  <span className="text-sm text-[#555555]">
                    Interest: {getProgramName(sampleLead.program_interest)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {sampleLead.lead_type === "program" && (
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Convert to Participant
              </Button>
            )}
            {sampleLead.lead_type === "msp" && (
              <Button size="sm">
                <Building2 className="h-4 w-4 mr-2" />
                Convert to Client
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD]">
        <nav className="flex gap-6">
          {(["overview", "activity", "emails"] as const).map((tab) => (
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
                      <p className="text-sm text-[#1A1A1A]">{sampleLead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Phone className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Phone</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleLead.phone}</p>
                    </div>
                  </div>
                  {sampleLead.organization && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Building2 className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Organization</p>
                        <p className="text-sm text-[#1A1A1A]">{sampleLead.organization}</p>
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
                        {new Date(sampleLead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* AI Classification */}
              {sampleLead.ai_classification && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-[#DDDDDD] p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="h-5 w-5 text-[#C9A84C]" />
                    <h2 className="font-semibold text-[#1A1A1A]">AI Classification</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#888888]">Priority Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-[#DDDDDD] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A84C] rounded-full"
                            style={{ width: `${sampleLead.ai_classification.priority_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#C9A84C]">
                          {sampleLead.ai_classification.priority_score}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#888888] mb-1">AI Analysis</p>
                      <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                        {sampleLead.ai_classification.reasoning}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Notes</h2>
                {sampleLead.notes && (
                  <p className="text-sm text-[#555555] mb-4 p-3 bg-[#FAFAF8] rounded-lg">
                    {sampleLead.notes}
                  </p>
                )}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button size="sm" disabled={!newNote.trim()}>
                    Add Note
                  </Button>
                </div>
              </motion.div>
            </>
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
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "ai"
                          ? "bg-[#FBF6E9] text-[#C9A84C]"
                          : "bg-[#EFF4EB] text-[#5A7247]"
                      }`}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1A1A1A]">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#888888]">{activity.user}</span>
                        <span className="text-xs text-[#DDDDDD]">•</span>
                        <span className="text-xs text-[#888888]">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "emails" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A]">Email History</h2>
                <Button size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
              {emails.length > 0 ? (
                <div className="divide-y divide-[#DDDDDD]">
                  {emails.map((email) => (
                    <div key={email.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FBF6E9]">
                          <Mail className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{email.subject}</p>
                          <p className="text-xs text-[#888888]">{email.sent_at}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {email.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Mail className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                  <p className="text-sm text-[#888888]">No emails sent yet</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Phone className="h-4 w-4" />
                Call Lead
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <MessageSquare className="h-4 w-4" />
                Add Note
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Calendar className="h-4 w-4" />
                Schedule Follow-up
              </button>
            </div>
          </motion.div>

          {/* Status Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Update Status</h3>
            <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </motion.div>

          {/* Assignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Assignment</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                TW
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{sampleLead.assigned_to}</p>
                <p className="text-xs text-[#888888]">Case Worker</p>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-red-200 p-4"
          >
            <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
            <Button variant="outline" size="sm" className="w-full border-red-300 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Lead
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
