"use client";

import {
  Calendar,
  CreditCard,
  Mail,
  Phone,
  Ticket,
  User,
  FileText,
  AlertCircle,
  UtensilsCrossed,
  Accessibility,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  item_name: string;
  item_type: "ticket" | "addon";
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  ticket_quantity: number | null;
  ticket_type: string | null;
  total_paid: number | null;
  payment_status: string | null;
  payment_method: string | null;
  payment_date: string | null;
  payment_notes: string | null;
  stripe_payment_intent_id: string | null;
  dietary_restrictions: string | null;
  accessibility_needs: string | null;
  checked_in: boolean | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  qr_code_token: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  refunded_at: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: Attendee;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  attendee,
}: OrderDetailsDialogProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "refunded":
        return "text-purple-600 bg-purple-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Attendee Info */}
          <div className="bg-[#FAFAF8] rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Attendee Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#888888]" />
                <span>
                  {attendee.first_name} {attendee.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#888888]" />
                <span>{attendee.email}</span>
              </div>
              {attendee.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#888888]" />
                  <span>{attendee.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#888888]" />
                <span>Registered {formatDate(attendee.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Dietary & Accessibility */}
          {(attendee.dietary_restrictions || attendee.accessibility_needs) && (
            <div className="bg-amber-50 rounded-lg p-4 space-y-3 border border-amber-200">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Special Requirements
              </h3>
              {attendee.dietary_restrictions && (
                <div className="flex items-start gap-2 text-sm text-amber-700">
                  <UtensilsCrossed className="h-4 w-4 mt-0.5" />
                  <span>
                    <strong>Dietary:</strong> {attendee.dietary_restrictions}
                  </span>
                </div>
              )}
              {attendee.accessibility_needs && (
                <div className="flex items-start gap-2 text-sm text-amber-700">
                  <Accessibility className="h-4 w-4 mt-0.5" />
                  <span>
                    <strong>Accessibility:</strong> {attendee.accessibility_needs}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Order Items</h3>
            <div className="border border-[#DDDDDD] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAF8]">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Item</th>
                    <th className="text-center px-4 py-2 font-medium">Qty</th>
                    <th className="text-right px-4 py-2 font-medium">Price</th>
                    <th className="text-right px-4 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDDDDD]">
                  {attendee.order_items && attendee.order_items.length > 0 ? (
                    attendee.order_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-[#888888]" />
                            <span>{item.item_name}</span>
                            {item.item_type === "addon" && (
                              <span className="text-xs bg-[#FBF6E9] text-[#C9A84C] px-1.5 py-0.5 rounded">
                                Add-on
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          ${item.total_price.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-[#888888]" />
                          <span>
                            {attendee.ticket_type === "general"
                              ? "General Admission"
                              : attendee.ticket_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {attendee.ticket_quantity || 1}
                      </td>
                      <td className="px-4 py-2 text-right">
                        $
                        {(
                          (attendee.total_paid ?? 0) / (attendee.ticket_quantity || 1)
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        ${(attendee.total_paid ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-[#FAFAF8] font-semibold">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right">
                      Total
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${(attendee.total_paid ?? 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Payment Details</h3>
            <div className="bg-[#FAFAF8] rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#888888]">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                    attendee.payment_status ?? "pending"
                  )}`}
                >
                  {(attendee.payment_status ?? "pending").charAt(0).toUpperCase() +
                    (attendee.payment_status ?? "pending").slice(1)}
                </span>
              </div>
              {attendee.payment_method && (
                <div className="flex items-center justify-between">
                  <span className="text-[#888888]">Method</span>
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {attendee.payment_method}
                  </span>
                </div>
              )}
              {attendee.payment_date && (
                <div className="flex items-center justify-between">
                  <span className="text-[#888888]">Payment Date</span>
                  <span>{formatDate(attendee.payment_date)}</span>
                </div>
              )}
              {attendee.stripe_payment_intent_id && (
                <div className="flex items-center justify-between">
                  <span className="text-[#888888]">Stripe Reference</span>
                  <span className="font-mono text-xs">
                    {attendee.stripe_payment_intent_id.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Info */}
          {attendee.refund_amount && attendee.refund_amount > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-red-600">Refund Details</h3>
              <div className="bg-red-50 rounded-lg p-4 space-y-2 text-sm border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Refund Amount</span>
                  <span className="font-semibold text-red-700">
                    ${attendee.refund_amount.toFixed(2)}
                  </span>
                </div>
                {attendee.refunded_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-red-700">Refunded At</span>
                    <span>{formatDate(attendee.refunded_at)}</span>
                  </div>
                )}
                {attendee.refund_reason && (
                  <div className="pt-2 border-t border-red-200">
                    <span className="text-red-700 font-medium">Reason:</span>
                    <p className="mt-1 text-red-700">{attendee.refund_reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {attendee.payment_notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Admin Notes
              </h3>
              <div className="bg-[#FBF6E9] rounded-lg p-4 text-sm text-[#555555] border border-[#C9A84C]/20">
                {attendee.payment_notes}
              </div>
            </div>
          )}

          {/* Check-in History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Check-in Status</h3>
            <div className="bg-[#FAFAF8] rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#888888]">Status</span>
                <span>
                  {attendee.checked_out_at
                    ? "Checked Out"
                    : attendee.checked_in
                    ? "Checked In"
                    : "Not Arrived"}
                </span>
              </div>
              {attendee.checked_in_at && (
                <div className="flex items-center justify-between">
                  <span className="text-[#888888]">Checked In</span>
                  <span>{formatDate(attendee.checked_in_at)}</span>
                </div>
              )}
              {attendee.checked_out_at && (
                <div className="flex items-center justify-between">
                  <span className="text-[#888888]">Checked Out</span>
                  <span>{formatDate(attendee.checked_out_at)}</span>
                </div>
              )}
              {attendee.qr_code_token && (
                <div className="flex items-center justify-between pt-2 border-t border-[#DDDDDD]">
                  <span className="text-[#888888]">QR Token</span>
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                    {attendee.qr_code_token}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
