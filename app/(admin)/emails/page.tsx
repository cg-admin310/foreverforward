"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Search,
  Mail,
  Bot,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
  MousePointer,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EmailStatus = "draft" | "scheduled" | "sent" | "opened" | "clicked";

interface Email {
  id: string;
  subject: string;
  recipient_name: string;
  recipient_email: string;
  status: EmailStatus;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  campaign: string | null;
}

const sampleEmails: Email[] = [
  {
    id: "1",
    subject: "Welcome to Forever Forward",
    recipient_name: "Marcus Johnson",
    recipient_email: "marcus.j@email.com",
    status: "opened",
    sent_at: "2026-03-22T10:30:00Z",
    opened_at: "2026-03-22T11:15:00Z",
    clicked_at: null,
    campaign: "Program Welcome",
  },
  {
    id: "2",
    subject: "Your IT Assessment is Ready",
    recipient_name: "Sarah Chen",
    recipient_email: "schen@hopecenter.org",
    status: "clicked",
    sent_at: "2026-03-18T14:00:00Z",
    opened_at: "2026-03-18T14:30:00Z",
    clicked_at: "2026-03-18T14:32:00Z",
    campaign: "MSP Nurture",
  },
  {
    id: "3",
    subject: "Follow-up: Father Forward Program",
    recipient_name: "Anthony Brown",
    recipient_email: "abrown@email.com",
    status: "sent",
    sent_at: "2026-03-21T09:00:00Z",
    opened_at: null,
    clicked_at: null,
    campaign: null,
  },
  {
    id: "4",
    subject: "Proposal: Managed IT Services",
    recipient_name: "Michael Thompson",
    recipient_email: "mthompson@yea.org",
    status: "scheduled",
    sent_at: null,
    opened_at: null,
    clicked_at: null,
    campaign: "MSP Nurture",
  },
  {
    id: "5",
    subject: "Week 6 Check-in Reminder",
    recipient_name: "DeShawn Mitchell",
    recipient_email: "dmitchell@email.com",
    status: "draft",
    sent_at: null,
    opened_at: null,
    clicked_at: null,
    campaign: null,
  },
];

const stats = {
  sent_this_month: 156,
  open_rate: 42,
  click_rate: 18,
  scheduled: 3,
};

export default function EmailsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showComposeModal, setShowComposeModal] = useState(false);

  const filteredEmails = sampleEmails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: EmailStatus) => {
    switch (status) {
      case "draft":
        return Mail;
      case "scheduled":
        return Clock;
      case "sent":
        return Send;
      case "opened":
        return Eye;
      case "clicked":
        return MousePointer;
    }
  };

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "sent":
        return "bg-yellow-100 text-yellow-700";
      case "opened":
        return "bg-green-100 text-green-700";
      case "clicked":
        return "bg-[#EFF4EB] text-[#5A7247]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Email Engine</h1>
          <p className="text-[#555555]">
            AI-powered email composition and campaign management
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Sequences
          </Button>
          <Button onClick={() => setShowComposeModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose Email
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Sent This Month",
            value: stats.sent_this_month,
            icon: Send,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Open Rate",
            value: `${stats.open_rate}%`,
            icon: Eye,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Click Rate",
            value: `${stats.click_rate}%`,
            icon: MousePointer,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50",
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

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "draft", "scheduled", "sent", "opened", "clicked"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Recipient
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Campaign
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => {
                const StatusIcon = getStatusIcon(email.status);
                return (
                  <motion.tr
                    key={email.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FBF6E9]">
                          <Mail className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#1A1A1A]">{email.subject}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#1A1A1A]">{email.recipient_name}</p>
                      <p className="text-xs text-[#888888]">{email.recipient_email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                          email.status
                        )}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {email.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {email.campaign ? (
                        <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded-full">
                          {email.campaign}
                        </span>
                      ) : (
                        <span className="text-xs text-[#888888]">One-off</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#888888]">
                        {email.sent_at
                          ? new Date(email.sent_at).toLocaleDateString()
                          : "Not sent"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="View">
                          <Eye className="h-4 w-4 text-[#888888]" />
                        </button>
                        {email.status === "draft" && (
                          <>
                            <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Send">
                              <Send className="h-4 w-4 text-[#888888]" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4 text-[#888888]" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            Showing {filteredEmails.length} of {sampleEmails.length} emails
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

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-6">
              <Mail className="h-6 w-6 text-[#C9A84C]" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Compose Email</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Recipient
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option>Select recipient...</option>
                  <option value="lead-1">Marcus Johnson (Lead)</option>
                  <option value="lead-2">Sarah Chen (Client)</option>
                  <option value="participant-1">James Williams (Participant)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Subject
                </label>
                <Input placeholder="Email subject..." />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-[#555555]">
                    Message
                  </label>
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    Compose with AI
                  </Button>
                </div>
                <Textarea placeholder="Write your message..." rows={8} />
              </div>

              <div className="p-4 bg-[#FBF6E9] rounded-lg">
                <div className="flex items-start gap-2">
                  <Bot className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">AI-Powered Composition</p>
                    <p className="text-xs text-[#555555] mt-1">
                      Click "Compose with AI" to have Claude draft an email based on the recipient's context, pipeline stage, and recent activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowComposeModal(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
