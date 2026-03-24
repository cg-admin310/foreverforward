"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Filter,
  QrCode,
  RefreshCw,
  MoreHorizontal,
  LogIn,
  LogOut,
  FileText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkInAttendee,
  checkOutAttendee,
  exportAttendeesToCSV,
} from "@/lib/actions/event-attendees";
import { PaymentNotesDialog } from "./payment-notes-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";
import { RefundDialog } from "./refund-dialog";
import { QRScannerDialog } from "./qr-scanner-dialog";

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
  event_id: string;
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

interface AttendeesViewProps {
  eventId: string;
  eventTitle: string;
  isFreeEvent: boolean;
  attendees: Attendee[];
  stats: {
    total: number;
    totalTickets: number;
    checkedIn: number;
    checkedOut: number;
    paid: number;
    pending: number;
    refunded: number;
    totalRevenue: number;
    totalRefunded: number;
  };
}

type FilterStatus = "all" | "paid" | "pending" | "refunded" | "failed";
type FilterCheckIn = "all" | "checked_in" | "not_checked_in" | "checked_out";

export function AttendeesView({
  eventId,
  eventTitle,
  isFreeEvent,
  attendees: initialAttendees,
  stats,
}: AttendeesViewProps) {
  const [attendees, setAttendees] = useState(initialAttendees);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [checkInFilter, setCheckInFilter] = useState<FilterCheckIn>("all");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Dialog states
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Filter attendees
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        attendee.first_name.toLowerCase().includes(searchLower) ||
        attendee.last_name.toLowerCase().includes(searchLower) ||
        attendee.email.toLowerCase().includes(searchLower) ||
        (attendee.phone && attendee.phone.includes(searchQuery));

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "paid" && attendee.payment_status === "paid") ||
        (statusFilter === "pending" && attendee.payment_status === "pending") ||
        (statusFilter === "refunded" &&
          (attendee.payment_status === "refunded" || attendee.payment_status === "partial_refund")) ||
        (statusFilter === "failed" && attendee.payment_status === "failed");

      // Check-in filter
      const matchesCheckIn =
        checkInFilter === "all" ||
        (checkInFilter === "checked_in" && attendee.checked_in && !attendee.checked_out_at) ||
        (checkInFilter === "not_checked_in" && !attendee.checked_in) ||
        (checkInFilter === "checked_out" && attendee.checked_out_at);

      return matchesSearch && matchesStatus && matchesCheckIn;
    });
  }, [attendees, searchQuery, statusFilter, checkInFilter]);

  // Handle check-in
  const handleCheckIn = async (attendeeId: string) => {
    setIsLoading(attendeeId);
    const result = await checkInAttendee(attendeeId);
    if (result.success && result.data) {
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === attendeeId
            ? { ...a, checked_in: true, checked_in_at: result.data!.checked_in_at }
            : a
        )
      );
    }
    setIsLoading(null);
  };

  // Handle check-out
  const handleCheckOut = async (attendeeId: string) => {
    setIsLoading(attendeeId);
    const result = await checkOutAttendee(attendeeId);
    if (result.success && result.data) {
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === attendeeId
            ? { ...a, checked_out_at: result.data!.checked_out_at }
            : a
        )
      );
    }
    setIsLoading(null);
  };

  // Handle export
  const handleExport = async () => {
    const result = await exportAttendeesToCSV(eventId);
    if (result.success && result.data) {
      // Create and download the CSV
      const blob = new Blob([result.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventTitle.replace(/[^a-z0-9]/gi, "_")}_attendees.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  // Handle notes update
  const handleNotesUpdate = (attendeeId: string, notes: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === attendeeId ? { ...a, payment_notes: notes } : a))
    );
  };

  // Handle refund
  const handleRefund = (attendeeId: string, amount: number) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              payment_status: "refunded",
              refund_amount: amount,
              refunded_at: new Date().toISOString(),
            }
          : a
      )
    );
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "refunded":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Refunded
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Get check-in badge
  const getCheckInBadge = (attendee: Attendee) => {
    if (attendee.checked_out_at) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
          <LogOut className="h-3 w-3" />
          Checked Out
        </span>
      );
    }
    if (attendee.checked_in) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
          <LogIn className="h-3 w-3" />
          Checked In
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Not Arrived
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FBF6E9]">
              <Users className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stats.total}</p>
              <p className="text-sm text-[#888888]">Registrations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EFF4EB]">
              <CheckCircle className="h-5 w-5 text-[#5A7247]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stats.checkedIn}</p>
              <p className="text-sm text-[#888888]">Checked In</p>
            </div>
          </div>
        </div>

        {!isFreeEvent && (
          <>
            <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#888888]">Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    ${stats.totalRefunded.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#888888]">Refunded</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as FilterStatus)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={checkInFilter}
              onValueChange={(v) => setCheckInFilter(v as FilterCheckIn)}
            >
              <SelectTrigger className="w-[160px]">
                <LogIn className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Check-in" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Check-in</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="not_checked_in">Not Arrived</SelectItem>
                <SelectItem value="checked_out">Checked Out</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowQRScanner(true)}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Scan QR
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Attendee
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Tickets
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Payment
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Check-in
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Registered
                </th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#555555]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDDDDD]">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-semibold">
                          {attendee.first_name.charAt(0)}
                          {attendee.last_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">
                            {attendee.first_name} {attendee.last_name}
                          </p>
                          <p className="text-sm text-[#888888]">{attendee.email}</p>
                          {attendee.payment_notes && (
                            <p className="text-xs text-[#C9A84C] mt-1 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Has notes
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {attendee.ticket_quantity || 1} ticket
                          {(attendee.ticket_quantity || 1) !== 1 ? "s" : ""}
                        </p>
                        {!isFreeEvent && (attendee.total_paid ?? 0) > 0 && (
                          <p className="text-sm text-[#888888]">
                            ${(attendee.total_paid ?? 0).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {getPaymentBadge(attendee.payment_status ?? "pending")}
                        {attendee.payment_method && (
                          <p className="text-xs text-[#888888] flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {attendee.payment_method}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{getCheckInBadge(attendee)}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#555555]">
                        {formatDate(attendee.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick check-in/out button */}
                        {attendee.payment_status === "paid" && (
                          <>
                            {!attendee.checked_in ? (
                              <Button
                                size="sm"
                                onClick={() => handleCheckIn(attendee.id)}
                                disabled={isLoading === attendee.id}
                                className="bg-[#5A7247] hover:bg-[#3D5030] text-white"
                              >
                                {isLoading === attendee.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <LogIn className="h-4 w-4" />
                                )}
                              </Button>
                            ) : !attendee.checked_out_at ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckOut(attendee.id)}
                                disabled={isLoading === attendee.id}
                              >
                                {isLoading === attendee.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <LogOut className="h-4 w-4" />
                                )}
                              </Button>
                            ) : null}
                          </>
                        )}

                        {/* More actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAttendee(attendee);
                                setShowOrderDialog(true);
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Order Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAttendee(attendee);
                                setShowNotesDialog(true);
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              {attendee.payment_notes ? "Edit Notes" : "Add Notes"}
                            </DropdownMenuItem>
                            {attendee.qr_code_token && (
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(attendee.qr_code_token!);
                                }}
                              >
                                <QrCode className="h-4 w-4 mr-2" />
                                Copy QR Token
                              </DropdownMenuItem>
                            )}
                            {!isFreeEvent &&
                              attendee.payment_status === "paid" &&
                              !attendee.refund_amount && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAttendee(attendee);
                                      setShowRefundDialog(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Process Refund
                                  </DropdownMenuItem>
                                </>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="h-12 w-12 text-[#DDDDDD] mx-auto mb-3" />
                    <p className="text-[#888888]">
                      {searchQuery || statusFilter !== "all" || checkInFilter !== "all"
                        ? "No attendees match your filters"
                        : "No registrations yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      {selectedAttendee && (
        <>
          <PaymentNotesDialog
            open={showNotesDialog}
            onOpenChange={setShowNotesDialog}
            attendee={selectedAttendee}
            onUpdate={handleNotesUpdate}
          />

          <OrderDetailsDialog
            open={showOrderDialog}
            onOpenChange={setShowOrderDialog}
            attendee={selectedAttendee}
          />

          <RefundDialog
            open={showRefundDialog}
            onOpenChange={setShowRefundDialog}
            attendee={selectedAttendee}
            onRefund={handleRefund}
          />
        </>
      )}

      <QRScannerDialog
        open={showQRScanner}
        onOpenChange={setShowQRScanner}
        eventId={eventId}
        onCheckIn={(attendeeId) => {
          const attendee = attendees.find((a) => a.id === attendeeId);
          if (attendee) {
            handleCheckIn(attendeeId);
          }
        }}
      />
    </div>
  );
}
