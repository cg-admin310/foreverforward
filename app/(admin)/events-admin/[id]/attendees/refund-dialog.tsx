"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { processFullRefund } from "@/lib/actions/event-attendees";

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  total_paid: number | null;
  stripe_payment_intent_id: string | null;
}

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: Attendee;
  onRefund: (attendeeId: string, amount: number) => void;
}

export function RefundDialog({
  open,
  onOpenChange,
  attendee,
  onRefund,
}: RefundDialogProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for the refund");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await processFullRefund(attendee.id, reason);

    if (result.success) {
      onRefund(attendee.id, attendee.total_paid ?? 0);
      onOpenChange(false);
      setReason("");
    } else {
      setError(result.error || "Failed to process refund");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Process Refund
          </DialogTitle>
          <DialogDescription>
            You are about to refund {attendee.first_name} {attendee.last_name}&apos;s
            payment. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Refund Amount */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-red-700 font-medium">Refund Amount</span>
              <span className="text-2xl font-bold text-red-600">
                ${(attendee.total_paid ?? 0).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-red-600 mt-2">
              Full refund will be issued to the original payment method
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Refund <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this refund..."
              rows={3}
            />
            <p className="text-xs text-[#888888]">
              This will be recorded in the attendee&apos;s order history
            </p>
          </div>

          {/* Warning */}
          {!attendee.stripe_payment_intent_id && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              <strong>Note:</strong> No Stripe payment ID found. This will only
              update the database record. You may need to process the refund
              manually through Stripe.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setReason("");
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Process Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
