"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  Mail,
  Bot,
  Clock,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  MousePointer,
  X,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Email, EmailStatus } from "@/types/database";
import {
  EmailStats,
  RecipientOption,
  sendEmailAction,
  deleteEmail,
  sendEmailDirect,
  createEmailDraft,
  getRecipients,
} from "@/lib/actions/emails";

// =============================================================================
// TYPES
// =============================================================================

interface EmailsClientProps {
  initialEmails: Email[];
  initialTotal: number;
  stats: EmailStats;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function EmailsClient({
  initialEmails,
  initialTotal,
  stats,
}: EmailsClientProps) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmailStatus | "all">("all");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter emails client-side for immediate feedback
  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.recipient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipient_email.toLowerCase().includes(searchQuery.toLowerCase());
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
      case "delivered":
        return Check;
      case "opened":
        return Eye;
      case "clicked":
        return MousePointer;
      case "bounced":
      case "failed":
        return AlertCircle;
      default:
        return Mail;
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
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "opened":
        return "bg-green-100 text-green-700";
      case "clicked":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "bounced":
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSendEmail = async (emailId: string) => {
    startTransition(async () => {
      const result = await sendEmailAction(emailId);
      if (result.success && result.data) {
        setEmails((prev) =>
          prev.map((e) => (e.id === emailId ? result.data! : e))
        );
      }
    });
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    startTransition(async () => {
      const result = await deleteEmail(emailId);
      if (result.success) {
        setEmails((prev) => prev.filter((e) => e.id !== emailId));
      }
    });
  };

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(email);
    setShowViewModal(true);
  };

  const handleEmailCreated = (email: Email) => {
    setEmails((prev) => [email, ...prev]);
    setShowComposeModal(false);
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Sent This Month",
            value: stats.sentThisMonth,
            icon: Send,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Open Rate",
            value: `${stats.openRate}%`,
            icon: Eye,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Click Rate",
            value: `${stats.clickRate}%`,
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
          {
            label: "Drafts",
            value: stats.drafts,
            icon: Mail,
            color: "text-gray-600",
            bg: "bg-gray-100",
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
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
                  {stat.value}
                </p>
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
          <div className="flex gap-2 flex-wrap">
            {(["all", "draft", "scheduled", "sent", "opened", "clicked"] as const).map(
              (status) => (
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
              )
            )}
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
                  Type
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
              {filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Mail className="h-12 w-12 mx-auto text-[#DDDDDD] mb-3" />
                    <p className="text-[#888888]">No emails found</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowComposeModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Compose your first email
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => {
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
                            <p className="font-medium text-sm text-[#1A1A1A] line-clamp-1">
                              {email.subject}
                            </p>
                            {email.ai_generated && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#5A7247]">
                                <Bot className="h-3 w-3" />
                                AI Generated
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1A1A1A]">
                          {email.recipient_name || "Unknown"}
                        </p>
                        <p className="text-xs text-[#888888]">
                          {email.recipient_email}
                        </p>
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
                        {email.recipient_type ? (
                          <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded-full capitalize">
                            {email.recipient_type}
                          </span>
                        ) : (
                          <span className="text-xs text-[#888888]">One-off</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#888888]">
                          {email.sent_at
                            ? new Date(email.sent_at).toLocaleDateString()
                            : email.scheduled_for
                            ? `Scheduled: ${new Date(
                                email.scheduled_for
                              ).toLocaleDateString()}`
                            : new Date(email.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewEmail(email)}
                            className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-[#888888]" />
                          </button>
                          {email.status === "draft" && (
                            <>
                              <button
                                onClick={() => handleSendEmail(email.id)}
                                disabled={isPending}
                                className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                                title="Send"
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 text-[#888888] animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 text-[#888888]" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteEmail(email.id)}
                                disabled={isPending}
                                className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-[#888888]" />
                              </button>
                            </>
                          )}
                          {email.status === "scheduled" && (
                            <button
                              onClick={() => handleDeleteEmail(email.id)}
                              disabled={isPending}
                              className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                              title="Cancel"
                            >
                              <Trash2 className="h-4 w-4 text-[#888888]" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            Showing {filteredEmails.length} of {initialTotal} emails
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
      <AnimatePresence>
        {showComposeModal && (
          <ComposeModal
            onClose={() => setShowComposeModal(false)}
            onEmailCreated={handleEmailCreated}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedEmail && (
          <ViewEmailModal
            email={selectedEmail}
            onClose={() => {
              setShowViewModal(false);
              setSelectedEmail(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// COMPOSE MODAL
// =============================================================================

function ComposeModal({
  onClose,
  onEmailCreated,
}: {
  onClose: () => void;
  onEmailCreated: (email: Email) => void;
}) {
  const [recipients, setRecipients] = useState<RecipientOption[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientOption | null>(null);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(true);
  const [error, setError] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [useManual, setUseManual] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async (search?: string) => {
    setIsLoadingRecipients(true);
    const result = await getRecipients({ search });
    if (result.success && result.data) {
      setRecipients(result.data);
    }
    setIsLoadingRecipients(false);
  };

  const handleSend = async (asDraft: boolean = false) => {
    const recipientEmail = useManual ? manualEmail : selectedRecipient?.email;
    const recipientName = useManual ? manualName : selectedRecipient?.name;

    if (!recipientEmail) {
      setError("Please select or enter a recipient");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    if (!body.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (asDraft) {
        const result = await createEmailDraft({
          recipientEmail,
          recipientName,
          recipientType: selectedRecipient?.type,
          recipientId: selectedRecipient?.id,
          subject,
          body,
        });

        if (result.success && result.data) {
          onEmailCreated(result.data);
        } else {
          setError(result.error || "Failed to save draft");
        }
      } else {
        const result = await sendEmailDirect({
          recipientEmail,
          recipientName,
          recipientType: selectedRecipient?.type,
          recipientId: selectedRecipient?.id,
          subject,
          body,
        });

        if (result.success && result.data) {
          onEmailCreated(result.data);
        } else {
          setError(result.error || "Failed to send email");
        }
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      (r.organization || "").toLowerCase().includes(recipientSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#C9A84C]" />
            <h2 className="text-xl font-bold text-[#1A1A1A]">Compose Email</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#888888]" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Recipient Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[#555555]">
                Recipient
              </label>
              <button
                onClick={() => setUseManual(!useManual)}
                className="text-xs text-[#C9A84C] hover:underline"
              >
                {useManual ? "Select from contacts" : "Enter manually"}
              </button>
            </div>

            {useManual ? (
              <div className="space-y-2">
                <Input
                  placeholder="Email address..."
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                />
                <Input
                  placeholder="Name (optional)..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <Input
                  placeholder="Search contacts..."
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="mb-2"
                />
                {selectedRecipient && (
                  <div className="flex items-center justify-between p-2 bg-[#FBF6E9] rounded-lg mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {selectedRecipient.name}
                      </p>
                      <p className="text-xs text-[#888888]">
                        {selectedRecipient.email}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedRecipient(null)}
                      className="p-1 hover:bg-[#E8D48B] rounded"
                    >
                      <X className="h-4 w-4 text-[#888888]" />
                    </button>
                  </div>
                )}
                {!selectedRecipient && (
                  <div className="max-h-40 overflow-y-auto border border-[#DDDDDD] rounded-lg">
                    {isLoadingRecipients ? (
                      <div className="p-4 text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#888888]" />
                      </div>
                    ) : filteredRecipients.length === 0 ? (
                      <div className="p-4 text-center text-sm text-[#888888]">
                        No contacts found
                      </div>
                    ) : (
                      filteredRecipients.slice(0, 10).map((recipient) => (
                        <button
                          key={`${recipient.type}-${recipient.id}`}
                          onClick={() => setSelectedRecipient(recipient)}
                          className="w-full p-3 text-left hover:bg-[#FAFAF8] border-b border-[#DDDDDD] last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">
                                {recipient.name}
                              </p>
                              <p className="text-xs text-[#888888]">
                                {recipient.email}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded capitalize">
                              {recipient.type}
                            </span>
                          </div>
                          {recipient.organization && (
                            <p className="text-xs text-[#555555] mt-1">
                              {recipient.organization}
                            </p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Subject
            </label>
            <Input
              placeholder="Email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-[#555555]">Message</label>
              <Button variant="outline" size="sm" disabled>
                <Bot className="h-4 w-4 mr-2" />
                Compose with AI
              </Button>
            </div>
            <Textarea
              placeholder="Write your message..."
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* AI Info */}
          <div className="p-4 bg-[#FBF6E9] rounded-lg">
            <div className="flex items-start gap-2">
              <Bot className="h-5 w-5 text-[#C9A84C] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  AI-Powered Composition
                </p>
                <p className="text-xs text-[#555555] mt-1">
                  Click &quot;Compose with AI&quot; to have Claude draft an email based on
                  the recipient&apos;s context, pipeline stage, and recent activities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSend(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Save Draft
          </Button>
          <Button
            className="flex-1"
            onClick={() => handleSend(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// VIEW EMAIL MODAL
// =============================================================================

function ViewEmailModal({
  email,
  onClose,
}: {
  email: Email;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#C9A84C]" />
            <h2 className="text-xl font-bold text-[#1A1A1A]">View Email</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#888888]" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="p-4 bg-[#FAFAF8] rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">To:</span>
              <span className="text-sm text-[#1A1A1A]">
                {email.recipient_name || "Unknown"} &lt;{email.recipient_email}&gt;
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Subject:</span>
              <span className="text-sm font-medium text-[#1A1A1A]">
                {email.subject}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Status:</span>
              <span className="text-sm text-[#1A1A1A] capitalize">
                {email.status}
              </span>
            </div>
            {email.sent_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Sent:</span>
                <span className="text-sm text-[#1A1A1A]">
                  {new Date(email.sent_at).toLocaleString()}
                </span>
              </div>
            )}
            {email.opened_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Opened:</span>
                <span className="text-sm text-[#5A7247]">
                  {new Date(email.opened_at).toLocaleString()}
                </span>
              </div>
            )}
            {email.ai_generated && (
              <div className="flex items-center gap-1 text-sm text-[#5A7247]">
                <Bot className="h-4 w-4" />
                AI Generated
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-4 border border-[#DDDDDD] rounded-lg">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: email.body.includes("<")
                  ? email.body
                  : `<p>${email.body.replace(/\n/g, "</p><p>")}</p>`,
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
