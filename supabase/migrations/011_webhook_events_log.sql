-- ============================================================================
-- Migration: Webhook Events Log
-- Track all incoming Stripe webhooks for debugging and audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Stripe event ID (unique identifier from Stripe)
  stripe_event_id text UNIQUE NOT NULL,

  -- Event type (e.g., 'invoice.paid', 'checkout.session.completed')
  event_type text NOT NULL,

  -- Processing status: 'received', 'processing', 'completed', 'failed'
  status text NOT NULL DEFAULT 'received',

  -- Related entity IDs for cross-referencing
  stripe_invoice_id text,
  stripe_customer_id text,
  stripe_payment_intent_id text,

  -- Internal reference IDs
  client_id uuid REFERENCES msp_clients(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,

  -- Full event payload (for debugging)
  payload jsonb,

  -- Error details if processing failed
  error_message text,
  error_details jsonb,

  -- Processing metrics
  processing_started_at timestamptz,
  processing_completed_at timestamptz,
  processing_duration_ms integer,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_invoice_id ON webhook_events(stripe_invoice_id);

-- Enable RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only super admins can view webhook events (sensitive data)
CREATE POLICY "Super admins can view webhook events"
  ON webhook_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Service role has full access (for webhook handler)
CREATE POLICY "Service role has full access to webhook events"
  ON webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Cleanup: Auto-delete old webhook events after 90 days
-- ============================================================================

-- Note: This can be run as a scheduled job or cron
-- DELETE FROM webhook_events WHERE created_at < now() - interval '90 days';
