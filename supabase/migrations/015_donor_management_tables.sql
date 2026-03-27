-- ============================================================================
-- Migration 015: Donor Management Tables
-- Description: Add tables for donor profiles, impact metrics, and donation allocations
-- ============================================================================

-- ============================================================================
-- DONOR PROFILES
-- Track donor information and engagement history
-- ============================================================================

CREATE TABLE IF NOT EXISTS donor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info (linked to donations table)
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',

  -- Donor classification
  donor_tier TEXT CHECK (donor_tier IN ('supporter', 'champion', 'visionary', 'legacy')) DEFAULT 'supporter',
  lifetime_giving DECIMAL(12,2) DEFAULT 0,
  first_donation_date TIMESTAMPTZ,
  last_donation_date TIMESTAMPTZ,
  donation_count INTEGER DEFAULT 0,

  -- Engagement
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'mail')) DEFAULT 'email',
  newsletter_subscribed BOOLEAN DEFAULT true,
  anonymous_giving BOOLEAN DEFAULT false,

  -- Stripe integration
  stripe_customer_id TEXT UNIQUE,

  -- Metadata
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_donor_profiles_email ON donor_profiles(email);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_tier ON donor_profiles(donor_tier);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_stripe ON donor_profiles(stripe_customer_id);

-- ============================================================================
-- IMPACT METRICS
-- Track and display organizational impact data
-- ============================================================================

CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metric identification
  metric_key TEXT UNIQUE NOT NULL,
  metric_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('programs', 'services', 'community', 'financial')) NOT NULL,

  -- Values
  current_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_value DECIMAL(12,2),
  previous_value DECIMAL(12,2),

  -- Display
  display_format TEXT DEFAULT 'number', -- number, currency, percentage
  suffix TEXT, -- e.g., '+', '%', ' families'
  description TEXT,

  -- Tracking
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Visibility
  is_public BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default impact metrics
INSERT INTO impact_metrics (metric_key, metric_name, category, current_value, target_value, display_format, suffix, description, display_order) VALUES
  ('fathers_trained', 'Fathers Trained', 'programs', 0, 500, 'number', '+', 'Number of fathers who have completed our workforce development programs', 1),
  ('youth_served', 'Youth Served', 'programs', 0, 1000, 'number', '+', 'Young people who have participated in our youth programs', 2),
  ('job_placements', 'Job Placements', 'programs', 0, 250, 'number', NULL, 'Program graduates placed in tech careers', 3),
  ('nonprofits_served', 'Nonprofits Served', 'services', 0, 100, 'number', NULL, 'Nonprofit organizations receiving our IT services', 4),
  ('families_impacted', 'Families Impacted', 'community', 0, 2500, 'number', '+', 'Families positively affected by our programs and events', 5),
  ('community_events', 'Community Events', 'community', 0, 50, 'number', NULL, 'Family-focused events hosted including Movies on the Menu', 6),
  ('total_donations', 'Total Raised', 'financial', 0, 500000, 'currency', NULL, 'Total donations received to support our mission', 7),
  ('certification_rate', 'Certification Rate', 'programs', 85, 95, 'percentage', '%', 'Percentage of program participants earning certifications', 8)
ON CONFLICT (metric_key) DO NOTHING;

-- ============================================================================
-- DONATION ALLOCATIONS
-- Track how donations are allocated across programs/initiatives
-- ============================================================================

CREATE TABLE IF NOT EXISTS donation_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to donation
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,

  -- Allocation details
  allocation_type TEXT CHECK (allocation_type IN ('program', 'operations', 'services', 'events', 'general')) NOT NULL,
  program_type TEXT, -- father_forward, tech_ready_youth, etc.

  -- Amount
  amount DECIMAL(12,2) NOT NULL,
  percentage DECIMAL(5,2), -- What % of the donation this represents

  -- Description
  description TEXT,

  -- Status
  status TEXT CHECK (status IN ('pending', 'allocated', 'spent', 'reported')) DEFAULT 'pending',
  allocated_at TIMESTAMPTZ,
  spent_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for allocation queries
CREATE INDEX IF NOT EXISTS idx_donation_allocations_donation ON donation_allocations(donation_id);
CREATE INDEX IF NOT EXISTS idx_donation_allocations_type ON donation_allocations(allocation_type);
CREATE INDEX IF NOT EXISTS idx_donation_allocations_program ON donation_allocations(program_type);

-- ============================================================================
-- DONATION IMPACT REPORTS
-- Track impact reports sent to donors
-- ============================================================================

CREATE TABLE IF NOT EXISTS donation_impact_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to donor
  donor_profile_id UUID REFERENCES donor_profiles(id) ON DELETE CASCADE,

  -- Report details
  report_type TEXT CHECK (report_type IN ('quarterly', 'annual', 'milestone', 'thank_you')) NOT NULL,
  report_period TEXT, -- e.g., 'Q1 2024', '2024'

  -- Content
  title TEXT NOT NULL,
  summary TEXT,
  metrics JSONB, -- Snapshot of relevant metrics at time of report
  stories JSONB, -- Success stories/testimonials included

  -- Delivery
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for report queries
CREATE INDEX IF NOT EXISTS idx_impact_reports_donor ON donation_impact_reports(donor_profile_id);
CREATE INDEX IF NOT EXISTS idx_impact_reports_sent ON donation_impact_reports(sent_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update donor profile from donations
CREATE OR REPLACE FUNCTION update_donor_profile_from_donation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process successful donations
  IF NEW.payment_status = 'succeeded' THEN
    -- Upsert donor profile
    INSERT INTO donor_profiles (
      email,
      first_name,
      last_name,
      phone,
      stripe_customer_id,
      first_donation_date,
      last_donation_date,
      lifetime_giving,
      donation_count
    ) VALUES (
      NEW.donor_email,
      NEW.donor_first_name,
      NEW.donor_last_name,
      NEW.donor_phone,
      NEW.stripe_customer_id,
      NEW.created_at,
      NEW.created_at,
      NEW.amount,
      1
    )
    ON CONFLICT (email) DO UPDATE SET
      first_name = COALESCE(EXCLUDED.first_name, donor_profiles.first_name),
      last_name = COALESCE(EXCLUDED.last_name, donor_profiles.last_name),
      phone = COALESCE(EXCLUDED.phone, donor_profiles.phone),
      stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, donor_profiles.stripe_customer_id),
      last_donation_date = EXCLUDED.last_donation_date,
      lifetime_giving = donor_profiles.lifetime_giving + EXCLUDED.lifetime_giving,
      donation_count = donor_profiles.donation_count + 1,
      updated_at = NOW();

    -- Update donor tier based on lifetime giving
    UPDATE donor_profiles
    SET donor_tier = CASE
      WHEN lifetime_giving >= 10000 THEN 'legacy'
      WHEN lifetime_giving >= 5000 THEN 'visionary'
      WHEN lifetime_giving >= 1000 THEN 'champion'
      ELSE 'supporter'
    END,
    updated_at = NOW()
    WHERE email = NEW.donor_email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donation updates
DROP TRIGGER IF EXISTS trigger_update_donor_profile ON donations;
CREATE TRIGGER trigger_update_donor_profile
  AFTER INSERT OR UPDATE OF payment_status ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donor_profile_from_donation();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_impact_reports ENABLE ROW LEVEL SECURITY;

-- Donor profiles: Admin access only
CREATE POLICY "Admin full access to donor_profiles"
  ON donor_profiles FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('super_admin', 'sales_lead')
    )
  );

-- Impact metrics: Public read, admin write
CREATE POLICY "Public read access to impact_metrics"
  ON impact_metrics FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admin full access to impact_metrics"
  ON impact_metrics FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'super_admin'
    )
  );

-- Donation allocations: Admin access only
CREATE POLICY "Admin full access to donation_allocations"
  ON donation_allocations FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('super_admin', 'sales_lead')
    )
  );

-- Impact reports: Admin access only
CREATE POLICY "Admin full access to impact_reports"
  ON donation_impact_reports FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('super_admin', 'sales_lead')
    )
  );

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER set_updated_at_donor_profiles
  BEFORE UPDATE ON donor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_impact_metrics
  BEFORE UPDATE ON impact_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_donation_allocations
  BEFORE UPDATE ON donation_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_impact_reports
  BEFORE UPDATE ON donation_impact_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
