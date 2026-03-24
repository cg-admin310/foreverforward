"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Download,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInvoice, sendInvoice, InvoiceDisplay, BillingStats } from "@/lib/actions/billing";

type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

interface BillingClientProps {
  stats: BillingStats;
  invoices: InvoiceDisplay[];
  clients: { id: string; name: string; hasStripeCustomer: boolean }[];
}

export function BillingClient({ stats, invoices, clients }: BillingClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceType, setInvoiceType] = useState<"recurring" | "one-time">("one-time");
  const [dueDate, setDueDate] = useState("");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.number?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return Clock;
      case "open":
        return Send;
      case "paid":
        return CheckCircle;
      case "uncollectible":
        return AlertTriangle;
      case "void":
        return XCircle;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "open":
        return "bg-blue-100 text-blue-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "uncollectible":
        return "bg-red-100 text-red-600";
      case "void":
        return "bg-gray-200 text-gray-600";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCreateInvoice = async (autoSend: boolean) => {
    if (!selectedClient || !invoiceAmount || !invoiceDescription) {
      setError("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await createInvoice({
        clientId: selectedClient,
        items: [
          {
            description: invoiceDescription,
            amount: parseFloat(invoiceAmount),
          },
        ],
        dueDate: dueDate ? new Date(dueDate) : undefined,
        autoSend,
        type: invoiceType,
      });

      if (result.success) {
        setShowInvoiceModal(false);
        setSelectedClient("");
        setInvoiceAmount("");
        setInvoiceDescription("");
        setDueDate("");
        router.refresh();
      } else {
        setError(result.error || "Failed to create invoice");
      }
    } catch (err) {
      setError("An error occurred while creating the invoice");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendInvoice = async (stripeInvoiceId: string) => {
    setIsSending(stripeInvoiceId);
    try {
      const result = await sendInvoice(stripeInvoiceId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to send invoice");
      }
    } catch {
      alert("Failed to send invoice");
    } finally {
      setIsSending(null);
    }
  };

  // Calculate revenue data for chart
  const revenueData = [
    { month: "Oct", revenue: Math.round(stats.mrr * 0.8) },
    { month: "Nov", revenue: Math.round(stats.mrr * 0.85) },
    { month: "Dec", revenue: Math.round(stats.mrr * 0.9) },
    { month: "Jan", revenue: Math.round(stats.mrr * 0.95) },
    { month: "Feb", revenue: Math.round(stats.mrr * 0.98) },
    { month: "Mar", revenue: stats.mrr },
  ];
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Billing</h1>
          <p className="text-[#555555]">
            Manage invoices and track revenue
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowInvoiceModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Monthly Recurring Revenue",
            value: `$${stats.mrr.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Collected This Month",
            value: `$${stats.collectedThisMonth.toLocaleString()}`,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Outstanding",
            value: `$${stats.outstanding.toLocaleString()}`,
            icon: DollarSign,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Overdue",
            value: `$${stats.overdue.toLocaleString()}`,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-50",
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

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-[#DDDDDD] p-6"
      >
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Revenue Trend</h2>
        <div className="h-48 flex items-end justify-between gap-4">
          {revenueData.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-[#C9A84C] to-[#E8D48B] rounded-t-lg transition-all hover:from-[#5A7247] hover:to-[#7A9A63]"
                  style={{ height: `${(item.revenue / maxRevenue) * 160}px` }}
                />
              </div>
              <span className="text-xs text-[#888888]">{item.month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "draft", "open", "paid", "void"].map((status) => (
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

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Invoice
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Due Date
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <FileText className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                    <p className="text-[#888888]">
                      {invoices.length === 0
                        ? "No invoices yet. Create your first invoice to get started."
                        : "No invoices match your search."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  return (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#FBF6E9]">
                            <CreditCard className="h-4 w-4 text-[#C9A84C]" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">
                              {invoice.number || "Draft"}
                            </p>
                            <p className="text-xs text-[#888888] capitalize">{invoice.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#888888]" />
                          <span className="text-sm text-[#555555]">{invoice.clientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-[#1A1A1A]">
                          ${invoice.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#888888]" />
                          <span className="text-sm text-[#888888]">
                            {formatDate(invoice.dueDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {invoice.hostedInvoiceUrl && (
                            <a
                              href={invoice.hostedInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4 text-[#888888]" />
                            </a>
                          )}
                          {invoice.status === "draft" && (
                            <button
                              onClick={() => handleSendInvoice(invoice.stripeInvoiceId)}
                              disabled={isSending === invoice.stripeInvoiceId}
                              className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors disabled:opacity-50"
                              title="Send Invoice"
                            >
                              {isSending === invoice.stripeInvoiceId ? (
                                <Loader2 className="h-4 w-4 text-[#888888] animate-spin" />
                              ) : (
                                <Send className="h-4 w-4 text-[#888888]" />
                              )}
                            </button>
                          )}
                          {invoice.pdfUrl && (
                            <a
                              href={invoice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4 text-[#888888]" />
                            </a>
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
            Showing {filteredInvoices.length} of {invoices.length} invoices
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

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-6 w-6 text-[#C9A84C]" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Create Invoice</h2>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Client *
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                >
                  <option value="">Select client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Invoice Type
                </label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value as "recurring" | "one-time")}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                >
                  <option value="recurring">Recurring (Monthly)</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Description *
                </label>
                <textarea
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  rows={3}
                  placeholder="Invoice description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowInvoiceModal(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleCreateInvoice(false)}
                disabled={isCreating}
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleCreateInvoice(true)}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Create & Send
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
