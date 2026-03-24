"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  sent_date: string | null;
  paid_date: string | null;
  type: "recurring" | "one-time";
}

const sampleInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2026-0042",
    client: "LA Youth Services",
    amount: 3200,
    status: "paid",
    due_date: "2026-03-01",
    sent_date: "2026-02-15",
    paid_date: "2026-02-28",
    type: "recurring",
  },
  {
    id: "2",
    number: "INV-2026-0043",
    client: "Watts Community Center",
    amount: 1800,
    status: "paid",
    due_date: "2026-03-01",
    sent_date: "2026-02-15",
    paid_date: "2026-03-01",
    type: "recurring",
  },
  {
    id: "3",
    number: "INV-2026-0044",
    client: "Community Health Partners",
    amount: 2200,
    status: "sent",
    due_date: "2026-04-01",
    sent_date: "2026-03-15",
    paid_date: null,
    type: "recurring",
  },
  {
    id: "4",
    number: "INV-2026-0045",
    client: "Hope Community Center",
    amount: 5000,
    status: "draft",
    due_date: "2026-04-15",
    sent_date: null,
    paid_date: null,
    type: "one-time",
  },
  {
    id: "5",
    number: "INV-2026-0046",
    client: "New Horizons Charter",
    amount: 8500,
    status: "overdue",
    due_date: "2026-03-10",
    sent_date: "2026-02-25",
    paid_date: null,
    type: "one-time",
  },
];

const stats = {
  mrr: 7200,
  collected_this_month: 5000,
  outstanding: 15700,
  overdue: 8500,
};

const revenueData = [
  { month: "Oct", revenue: 5800 },
  { month: "Nov", revenue: 6200 },
  { month: "Dec", revenue: 6500 },
  { month: "Jan", revenue: 6800 },
  { month: "Feb", revenue: 7000 },
  { month: "Mar", revenue: 7200 },
];

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredInvoices = sampleInvoices.filter((invoice) => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return Clock;
      case "sent":
        return Send;
      case "paid":
        return CheckCircle;
      case "overdue":
        return AlertTriangle;
      case "cancelled":
        return XCircle;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-600";
      case "cancelled":
        return "bg-gray-200 text-gray-600";
    }
  };

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
            value: `$${stats.collected_this_month.toLocaleString()}`,
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
          {revenueData.map((item, index) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-[#C9A84C] to-[#E8D48B] rounded-t-lg transition-all hover:from-[#5A7247] hover:to-[#7A9A63]"
                  style={{ height: `${(item.revenue / 8000) * 160}px` }}
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
          <div className="flex gap-2">
            {["all", "draft", "sent", "paid", "overdue"].map((status) => (
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
              {filteredInvoices.map((invoice) => {
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
                          <p className="font-medium text-sm text-[#1A1A1A]">{invoice.number}</p>
                          <p className="text-xs text-[#888888] capitalize">{invoice.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#888888]" />
                        <span className="text-sm text-[#555555]">{invoice.client}</span>
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
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="View">
                          <Eye className="h-4 w-4 text-[#888888]" />
                        </button>
                        {invoice.status === "draft" && (
                          <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Send">
                            <Send className="h-4 w-4 text-[#888888]" />
                          </button>
                        )}
                        {invoice.status === "overdue" && (
                          <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Send Reminder">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Download">
                          <Download className="h-4 w-4 text-[#888888]" />
                        </button>
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
            Showing {filteredInvoices.length} of {sampleInvoices.length} invoices
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Client
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option>Select client...</option>
                  <option value="1">Hope Community Center</option>
                  <option value="2">LA Youth Services</option>
                  <option value="3">Watts Community Center</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Invoice Type
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option value="recurring">Recurring (Monthly)</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                  <Input placeholder="0.00" className="pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Due Date
                </label>
                <Input type="date" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  rows={3}
                  placeholder="Invoice description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowInvoiceModal(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="flex-1">
                Save Draft
              </Button>
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Create & Send
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
