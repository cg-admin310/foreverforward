-- ============================================================================
-- Migration: Enhanced Payment Tracking for Event Attendees
-- Description: Adds fields for payment method, notes, refunds, QR check-in
-- ============================================================================

-- Add new payment tracking columns to event_attendees
ALTER TABLE event_attendees
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_notes TEXT,
  ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS qr_code_token TEXT;

-- Add unique constraint for QR code token (allows NULLs)
ALTER TABLE event_attendees
  ADD CONSTRAINT event_attendees_qr_code_token_unique UNIQUE (qr_code_token);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_event_attendees_qr_token
  ON event_attendees(qr_code_token)
  WHERE qr_code_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_payment
  ON event_attendees(event_id, payment_status);

CREATE INDEX IF NOT EXISTS idx_event_attendees_payment_date
  ON event_attendees(payment_date)
  WHERE payment_date IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN event_attendees.payment_method IS 'Card brand and last 4 digits, e.g., "VISA **** 4242"';
COMMENT ON COLUMN event_attendees.payment_date IS 'Timestamp when payment was confirmed by Stripe webhook';
COMMENT ON COLUMN event_attendees.payment_notes IS 'Admin notes about payment issues or special circumstances';
COMMENT ON COLUMN event_attendees.refund_amount IS 'Amount refunded in dollars';
COMMENT ON COLUMN event_attendees.refund_reason IS 'Reason for refund provided by admin';
COMMENT ON COLUMN event_attendees.refunded_at IS 'Timestamp when refund was processed';
COMMENT ON COLUMN event_attendees.checked_out_at IS 'Timestamp when attendee left the event';
COMMENT ON COLUMN event_attendees.qr_code_token IS 'Unique token for QR code check-in';
