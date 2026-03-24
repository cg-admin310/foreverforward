"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { updatePaymentNotes } from "@/lib/actions/event-attendees";

interface Attendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  payment_notes: string | null;
}

interface PaymentNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: Attendee;
  onUpdate: (attendeeId: string, notes: string) => void;
}

export function PaymentNotesDialog({
  open,
  onOpenChange,
  attendee,
  onUpdate,
}: PaymentNotesDialogProps) {
  const [notes, setNotes] = useState(attendee.payment_notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updatePaymentNotes(attendee.id, notes);
    if (result.success) {
      onUpdate(attendee.id, notes);
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Notes</DialogTitle>
          <DialogDescription>
            Add notes about {attendee.first_name} {attendee.last_name}&apos;s payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter payment notes, special circumstances, or admin comments..."
              rows={5}
            />
            <p className="text-xs text-[#888888]">
              These notes are only visible to admin users.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#C9A84C] hover:bg-[#A68A2E] text-black"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
