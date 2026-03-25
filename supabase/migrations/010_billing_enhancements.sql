-- ============================================================================
-- Migration: Billing System Enhancements
-- Adds recurring billing config, enhanced invoice fields, revenue history,
-- and billing events audit log for production-ready billing system
-- ============================================================================

-- ============================================================================
-- 1. RECURRING BILLING CONFIG ON MSP_CLIENTS
-- ============================================================================

-- Enable/disable billing for client
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS billing_enabled boolean DEFAULT false;

-- Day of month to generate recurring invoices (1-28)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS billing_day_of_month integer DEFAULT 1;

-- Auto-generate invoices each month
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS auto_invoice_enabled boolean DEFAULT false;

-- Stripe subscription ID for recurring billing
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Last time an invoice was auto-generated
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS last_invoice_generated_at timestamptz;

-- ============================================================================
-- 2. ENHANCED INVOICE FIELDS
-- ============================================================================

-- Store line items as JSONB array: [{description, amount, quantity}]
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS line_items jsonb DEFAULT '[]';

-- Track when reminders were sent
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

-- Count of reminders sent (for escalation)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_count integer DEFAULT 0;

-- Customer-visible notes
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notes text;

-- Internal admin notes (not shown to customer)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS internal_notes text;

-- ============================================================================
-- 3. REVENUE HISTORY TABLE
-- For accurate historical revenue charts instead of calculated data
-- ============================================================================

CREATE TABLE IF NOT EXISTS revenue_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source of revenue: 'billing', 'donations', 'events'
  source text NOT NULL,

  -- Month/year in '2026-03' format for easy grouping
  month_year text NOT NULL,

  -- Total amount invoiced/donated in this period
  total_amount numeric NOT NULL DEFAULT 0,

  -- Amount actually collected/paid
  collected_amount numeric NOT NULL DEFAULT 0,

  -- Amount still outstanding
  outstanding_amount numeric NOT NULL DEFAULT 0,

  -- Number of invoices/donations in this period
  record_count integer DEFAULT 0,

  -- Additional metadata (breakdown by client, campaign, etc.)
  metadata jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Unique constraint on source + month
  UNIQUE(source, month_year)
);

-- Index for fast month lookups
CREATE INDEX IF NOT EXISTS idx_revenue_history_month ON revenue_history(month_year);
CREATE INDEX IF NOT EXISTS idx_revenue_history_source ON revenue_history(source);

-- ============================================================================
-- 4. BILLING EVENTS AUDIT LOG
-- Track all billing-related activities for audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS billing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to invoice (nullable for client-level events)
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,

  -- Reference to client
  client_id uuid REFERENCES msp_clients(id) ON DELETE SET NULL,

  -- Event type: 'created', 'sent', 'viewed', 'paid', 'reminder_sent',
  --             'voided', 'edited', 'recurring_enabled', 'recurring_disabled',
  --             'portal_accessed'
  event_type text NOT NULL,

  -- Human-readable description
  description text,

  -- Additional event data
  metadata jsonb,

  -- User who performed the action (nullable for system/webhook events)
  performed_by uuid,

  created_at timestamptz DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_billing_events_invoice ON billing_events(invoice_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_client ON billing_events(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_created ON billing_events(created_at DESC);

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE revenue_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

-- Revenue history policies
CREATE POLICY "Super admins and sales leads can view revenue history"
  ON revenue_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

CREATE POLICY "Super admins can manage revenue history"
  ON revenue_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Service role has full access to revenue history"
  ON revenue_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Billing events policies
CREATE POLICY "Super admins and sales leads can view billing events"
  ON billing_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

CREATE POLICY "Super admins and sales leads can create billing events"
  ON billing_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

CREATE POLICY "Service role has full access to billing events"
  ON billing_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6. HELPER FUNCTION: Update revenue history from invoices
-- ============================================================================

CREATE OR REPLACE FUNCTION update_revenue_history_from_invoice()
RETURNS trigger AS $$
DECLARE
  v_month_year text;
BEGIN
  -- Get the month/year from the invoice
  v_month_year := to_char(COALESCE(NEW.paid_at, NEW.created_at), 'YYYY-MM');

  -- Upsert into revenue_history
  INSERT INTO revenue_history (source, month_year, total_amount, collected_amount, outstanding_amount, record_count)
  VALUES (
    'billing',
    v_month_year,
    CASE WHEN NEW.status IN ('open', 'paid') THEN NEW.amount ELSE 0 END,
    CASE WHEN NEW.status = 'paid' THEN NEW.amount ELSE 0 END,
    CASE WHEN NEW.status = 'open' THEN NEW.amount ELSE 0 END,
    1
  )
  ON CONFLICT (source, month_year) DO UPDATE SET
    total_amount = revenue_history.total_amount +
      CASE WHEN NEW.status IN ('open', 'paid') THEN NEW.amount ELSE 0 END -
      CASE WHEN OLD IS NOT NULL AND OLD.status IN ('open', 'paid') THEN OLD.amount ELSE 0 END,
    collected_amount = revenue_history.collected_amount +
      CASE WHEN NEW.status = 'paid' THEN NEW.amount ELSE 0 END -
      CASE WHEN OLD IS NOT NULL AND OLD.status = 'paid' THEN OLD.amount ELSE 0 END,
    outstanding_amount = revenue_history.outstanding_amount +
      CASE WHEN NEW.status = 'open' THEN NEW.amount ELSE 0 END -
      CASE WHEN OLD IS NOT NULL AND OLD.status = 'open' THEN OLD.amount ELSE 0 END,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Trigger commented out - will use application-level updates for better control
-- CREATE TRIGGER invoice_revenue_history_trigger
--   AFTER INSERT OR UPDATE ON invoices
--   FOR EACH ROW
--   EXECUTE FUNCTION update_revenue_history_from_invoice();
