-- Migration: Create invoices table for MSP billing
-- This table syncs with Stripe invoices for local tracking and reporting

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES msp_clients(id) ON DELETE SET NULL,
  stripe_invoice_id text UNIQUE NOT NULL,
  stripe_customer_id text,
  number text,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'draft', -- draft, open, paid, uncollectible, void, failed
  invoice_type text DEFAULT 'one-time', -- one-time, recurring
  description text,
  due_date timestamptz,
  sent_at timestamptz,
  paid_at timestamptz,
  stripe_payment_intent_id text,
  hosted_invoice_url text,
  pdf_url text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Super admins and sales leads can view all invoices
CREATE POLICY "Admins can view all invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

-- Super admins and sales leads can create invoices
CREATE POLICY "Admins can create invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

-- Super admins and sales leads can update invoices
CREATE POLICY "Admins can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'sales_lead')
    )
  );

-- Super admins can delete invoices
CREATE POLICY "Super admins can delete invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Service role bypasses RLS (for webhook handlers)
CREATE POLICY "Service role full access"
  ON invoices FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
