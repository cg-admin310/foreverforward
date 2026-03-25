"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Bell,
  Ban,
  Download,
  Edit2,
  ExternalLink,
  Calendar,
  Clock,
  Building,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  sendInvoice,
  sendInvoiceReminder,
  voidInvoice,
  updateInvoice,
  addInvoiceLineItem,
  removeInvoiceLineItem,
} from "@/lib/actions/billing";
import { InvoiceDisplay } from "@/lib/actions/billing";

// =============================================================================
// TYPES
// =============================================================================

interface InvoiceDetailData {
  invoice: InvoiceDisplay & {
    lineItems: { description: string; amount: number; quantity?: number; stripe_line_item_id?: string }[];
    notes: string | null;
    internalNotes: string | null;
    reminderCount: number;
    reminderSentAt: string | null;
  };
  client: { id: string; name: string; email: string };
  billingEvents: { eventType: string; description: string; createdAt: string }[];
}

interface Props {
  initialData: InvoiceDetailData;
}

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    draft: { bg: "bg-gray-100", text: "text-gray-700", icon: <Edit2 className="h-3 w-3" /> },
    open: { bg: "bg-blue-100", text: "text-blue-700", icon: <Clock className="h-3 w-3" /> },
    paid: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
    uncollectible: { bg: "bg-red-100", text: "text-red-700", icon: <AlertCircle className="h-3 w-3" /> },
    void: { bg: "bg-gray-100", text: "text-gray-500", icon: <XCircle className="h-3 w-3" /> },
  };

  const { bg, text, icon } = config[status] || config.draft;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium", bg, text)}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function InvoiceDetailClient({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const { invoice, client, billingEvents } = data;

  // Calculate if overdue
  const isOverdue = invoice.status === "open" && invoice.dueDate && new Date(invoice.dueDate) < new Date();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format datetime
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Handle send invoice
  const handleSend = () => {
    startTransition(async () => {
      const result = await sendInvoice(invoice.stripeInvoiceId);
      if (result.success) {
        router.refresh();
      }
    });
  };

  // Handle send reminder
  const handleSendReminder = () => {
    startTransition(async () => {
      const result = await sendInvoiceReminder(invoice.id);
      if (result.success) {
        router.refresh();
      }
    });
  };

  // Handle void invoice
  const handleVoid = () => {
    if (!confirm("Are you sure you want to void this invoice? This action cannot be undone.")) {
      return;
    }
    startTransition(async () => {
      const result = await voidInvoice(invoice.stripeInvoiceId);
      if (result.success) {
        router.refresh();
      }
    });
  };

  // Handle add line item
  const handleAddLineItem = (description: string, amount: number) => {
    startTransition(async () => {
      const result = await addInvoiceLineItem({
        invoiceId: invoice.id,
        description,
        amount,
      });
      if (result.success) {
        router.refresh();
        setShowAddItemModal(false);
      }
    });
  };

  // Handle remove line item
  const handleRemoveLineItem = (lineItemId: string) => {
    if (!confirm("Are you sure you want to remove this line item?")) {
      return;
    }
    startTransition(async () => {
      const result = await removeInvoiceLineItem({
        invoiceId: invoice.id,
        lineItemId,
      });
      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/billing"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-brand-black">
                Invoice {invoice.number || invoice.stripeInvoiceId.slice(-8)}
              </h1>
              <StatusBadge status={invoice.status} />
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  <AlertCircle className="h-3 w-3" />
                  Overdue
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Created {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {invoice.status === "draft" && (
            <button
              onClick={handleSend}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-black rounded-lg font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send Invoice
            </button>
          )}

          {invoice.status === "open" && (
            <button
              onClick={handleSendReminder}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Bell className="h-4 w-4" />
              Send Reminder
            </button>
          )}

          {(invoice.status === "draft" || invoice.status === "open") && (
            <button
              onClick={handleVoid}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Ban className="h-4 w-4" />
              Void
            </button>
          )}

          {invoice.pdfUrl && (
            <a
              href={invoice.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          )}

          {invoice.hostedInvoiceUrl && (
            <a
              href={invoice.hostedInvoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View in Stripe
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Invoice Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-brand-black">Invoice Details</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-gold-bg">
                  <Building className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bill To</p>
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-lg font-medium text-brand-black hover:text-brand-gold transition-colors"
                  >
                    {client.name}
                  </Link>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    {client.email}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-3xl font-bold text-brand-black">
                  {formatCurrency(invoice.amount)}
                </span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Due Date
                  </p>
                  <p className={cn("font-medium mt-1", isOverdue ? "text-red-600" : "text-brand-black")}>
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sent</p>
                  <p className="font-medium mt-1 text-brand-black">
                    {formatDate(invoice.sentAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="font-medium mt-1 text-brand-black">
                    {formatDate(invoice.paidAt)}
                  </p>
                </div>
              </div>

              {/* Reminder Info */}
              {invoice.reminderCount > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>{invoice.reminderCount}</strong> reminder{invoice.reminderCount > 1 ? "s" : ""} sent
                    {invoice.reminderSentAt && (
                      <span className="text-yellow-600">
                        {" "}(last: {formatDate(invoice.reminderSentAt)})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-brand-black">Line Items</h2>
              {invoice.status === "draft" && (
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="text-sm text-brand-gold hover:underline font-medium"
                >
                  + Add Item
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-200">
              {invoice.lineItems && invoice.lineItems.length > 0 ? (
                invoice.lineItems.map((item, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-brand-black">{item.description}</p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                      {invoice.status === "draft" && item.stripe_line_item_id && (
                        <button
                          onClick={() => handleRemoveLineItem(item.stripe_line_item_id!)}
                          disabled={isPending}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No line items yet
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          {/* Notes Card */}
          {(invoice.notes || invoice.internalNotes || invoice.status === "draft") && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-brand-black">Notes</h2>
              </div>

              <div className="p-6 space-y-4">
                {invoice.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Customer Notes</p>
                    <p className="text-gray-700">{invoice.notes}</p>
                  </div>
                )}
                {invoice.internalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Internal Notes</p>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-200">
                      {invoice.internalNotes}
                    </p>
                  </div>
                )}
                {!invoice.notes && !invoice.internalNotes && (
                  <p className="text-gray-500 text-center py-4">No notes</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-brand-black mb-4">Quick Info</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium text-brand-black">
                  {invoice.type === "recurring" ? "Recurring" : "One-time"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Invoice #</dt>
                <dd className="font-mono text-sm">{invoice.number || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Stripe ID</dt>
                <dd className="font-mono text-xs text-gray-500 truncate max-w-[140px]" title={invoice.stripeInvoiceId}>
                  {invoice.stripeInvoiceId.slice(-12)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-brand-black">Activity</h3>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              {billingEvents && billingEvents.length > 0 ? (
                <div className="space-y-4">
                  {billingEvents.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-gold mt-2" />
                      <div>
                        <p className="text-sm text-gray-700">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Line Item Modal */}
      {showAddItemModal && (
        <AddLineItemModal
          onClose={() => setShowAddItemModal(false)}
          onAdd={handleAddLineItem}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// =============================================================================
// ADD LINE ITEM MODAL
// =============================================================================

function AddLineItemModal({
  onClose,
  onAdd,
  isPending,
}: {
  onClose: () => void;
  onAdd: (description: string, amount: number) => void;
  isPending: boolean;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (description && !isNaN(amountNum) && amountNum > 0) {
      onAdd(description, amountNum);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-brand-black mb-4">Add Line Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              placeholder="Monthly IT Support"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              placeholder="500.00"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !description || !amount}
              className="px-4 py-2 bg-brand-gold text-brand-black rounded-lg font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
