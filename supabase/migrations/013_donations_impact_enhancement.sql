-- Forever Forward Foundation - Donations & Impact Enhancement
-- Migration: 013_donations_impact_enhancement.sql
-- Description: Adds donor profiles, impact tracking, communication logs, and metrics tables

-- ============================================================================
-- DONATIONS TABLE ENHANCEMENTS
-- ============================================================================

-- Enhanced donation tracking fields
ALTER TABLE donations ADD COLUMN IF NOT EXISTS allocation JSONB;
-- allocation: { "programs": 60, "operations": 25, "events": 15 } percentages

ALTER TABLE donations ADD COLUMN IF NOT EXISTS impact_tags TEXT[];
-- impact_tags: ["father_forward", "tech_ready_youth", "movies_on_menu"]

ALTER TABLE donations ADD COLUMN IF NOT EXISTS impact_report_sent BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS impact_report_sent_at TIMESTAMPTZ;

ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_tier TEXT;
-- donor_tier: "founding", "champion", "supporter", "friend"

ALTER TABLE donations ADD COLUMN IF NOT EXISTS communication_preferences JSONB;
-- communication_preferences: { "email_updates": true, "quarterly_reports": true, "event_invites": true }

ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_corporate BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS company_match_eligible BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS matched_amount DECIMAL(10,2);

-- Tax receipt tracking
ALTER TABLE donations ADD COLUMN IF NOT EXISTS tax_receipt_sent BOOLEAN DEFAULT false;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS tax_receipt_sent_at TIMESTAMPTZ;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS tax_receipt_number TEXT;

-- ============================================================================
-- DONOR PROFILES TABLE (Aggregate donor information)
-- ============================================================================

CREATE TABLE IF NOT EXISTS donor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact information
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

  -- Donor tier (auto-calculated based on giving)
  tier TEXT DEFAULT 'friend' CHECK (tier IN ('founding', 'champion', 'supporter', 'friend')),
  -- founding: $10,000+/year, champion: $2,500+/year, supporter: $500+/year, friend: <$500/year

  -- Aggregate statistics
  total_given DECIMAL(12,2) DEFAULT 0,
  ytd_given DECIMAL(12,2) DEFAULT 0,
  first_donation_at TIMESTAMPTZ,
  last_donation_at TIMESTAMPTZ,
  donation_count INTEGER DEFAULT 0,
  average_donation DECIMAL(10,2) DEFAULT 0,
  largest_donation DECIMAL(10,2) DEFAULT 0,

  -- Recurring status
  is_recurring BOOLEAN DEFAULT false,
  recurring_amount DECIMAL(10,2),
  recurring_frequency TEXT, -- 'monthly', 'quarterly', 'annual'
  recurring_since TIMESTAMPTZ,

  -- Stripe integration
  stripe_customer_id TEXT,

  -- Communication preferences
  communication_preferences JSONB DEFAULT '{"email_updates": true, "quarterly_reports": true, "event_invites": true, "annual_report": true}'::jsonb,
  preferred_contact_method TEXT DEFAULT 'email',

  -- Corporate donor info
  is_corporate BOOLEAN DEFAULT false,
  company_name TEXT,
  company_contact_title TEXT,

  -- Relationship management
  notes TEXT,
  tags TEXT[],
  assigned_to UUID, -- Staff member managing relationship
  last_contact_at TIMESTAMPTZ,
  next_contact_date DATE,

  -- Engagement tracking
  events_attended INTEGER DEFAULT 0,
  volunteer_hours INTEGER DEFAULT 0,
  referrals_made INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DONOR COMMUNICATIONS TABLE (Communication log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS donor_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Related records
  donor_profile_id UUID REFERENCES donor_profiles(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,

  -- Communication type
  type TEXT NOT NULL CHECK (type IN (
    'thank_you',           -- Immediate thank you after donation
    'impact_update',       -- 30-day impact update
    'quarterly_report',    -- Quarterly impact newsletter
    'annual_report',       -- Annual tax summary + impact report
    'milestone',           -- Recurring donor milestones (6mo, 1yr, 2yr)
    'event_invite',        -- Event invitation
    'tier_upgrade',        -- Notification of tier upgrade
    'receipt',             -- Tax receipt
    'general'              -- General communication
  )),

  -- Content
  subject TEXT,
  content TEXT,
  template_used TEXT, -- Reference to email template

  -- Delivery tracking
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'mail', 'phone')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Email tracking IDs
  email_id TEXT, -- From email provider

  -- Sender
  sent_by UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- IMPACT METRICS TABLE (Track organizational impact)
-- ============================================================================

CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Metric categorization
  metric_type TEXT NOT NULL CHECK (metric_type IN ('program', 'service', 'event', 'community', 'financial')),
  metric_name TEXT NOT NULL,
  -- Examples:
  -- program: "fathers_graduated", "youth_certified", "families_served"
  -- service: "nonprofits_served", "users_supported", "uptime_delivered"
  -- event: "events_hosted", "meals_served", "attendees"
  -- community: "volunteer_hours", "partners", "resources_connected"
  -- financial: "overhead_ratio", "program_efficiency"

  -- Metric value
  metric_value DECIMAL(12,2) NOT NULL,
  metric_unit TEXT, -- 'count', 'percentage', 'dollars', 'hours', etc.

  -- Time period
  period_type TEXT DEFAULT 'month' CHECK (period_type IN ('day', 'week', 'month', 'quarter', 'year', 'all_time')),
  period_start DATE,
  period_end DATE,

  -- Optional associations
  program_id UUID,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,

  -- Context
  description TEXT,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DONATION ALLOCATIONS TABLE (Track where donations go)
-- ============================================================================

CREATE TABLE IF NOT EXISTS donation_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Allocation period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Allocation breakdown (percentages)
  programs_percent DECIMAL(5,2) DEFAULT 60.00,
  operations_percent DECIMAL(5,2) DEFAULT 25.00,
  events_percent DECIMAL(5,2) DEFAULT 10.00,
  admin_percent DECIMAL(5,2) DEFAULT 5.00,

  -- Actual amounts (calculated from donations in period)
  total_donations DECIMAL(12,2) DEFAULT 0,
  programs_amount DECIMAL(12,2) DEFAULT 0,
  operations_amount DECIMAL(12,2) DEFAULT 0,
  events_amount DECIMAL(12,2) DEFAULT 0,
  admin_amount DECIMAL(12,2) DEFAULT 0,

  -- Program-specific breakdowns (stored as JSONB for flexibility)
  program_allocations JSONB,
  -- { "father_forward": 5000, "tech_ready_youth": 3000, "making_moments": 2000 }

  -- Notes
  notes TEXT,

  -- Published for donors
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_tier ON donations(donor_tier);
CREATE INDEX IF NOT EXISTS idx_donations_impact_tags ON donations USING GIN(impact_tags);
CREATE INDEX IF NOT EXISTS idx_donations_corporate ON donations(is_corporate);

-- Donor profiles
CREATE INDEX IF NOT EXISTS idx_donor_profiles_email ON donor_profiles(email);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_tier ON donor_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_stripe ON donor_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_recurring ON donor_profiles(is_recurring);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_total ON donor_profiles(total_given DESC);

-- Donor communications
CREATE INDEX IF NOT EXISTS idx_donor_comms_profile ON donor_communications(donor_profile_id);
CREATE INDEX IF NOT EXISTS idx_donor_comms_donation ON donor_communications(donation_id);
CREATE INDEX IF NOT EXISTS idx_donor_comms_type ON donor_communications(type);
CREATE INDEX IF NOT EXISTS idx_donor_comms_status ON donor_communications(status);
CREATE INDEX IF NOT EXISTS idx_donor_comms_sent ON donor_communications(sent_at);

-- Impact metrics
CREATE INDEX IF NOT EXISTS idx_impact_type_period ON impact_metrics(metric_type, period_end);
CREATE INDEX IF NOT EXISTS idx_impact_name ON impact_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_impact_program ON impact_metrics(program_id);

-- Donation allocations
CREATE INDEX IF NOT EXISTS idx_allocations_period ON donation_allocations(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_allocations_published ON donation_allocations(is_published);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update donor_profiles.updated_at on change
CREATE TRIGGER update_donor_profiles_updated_at
  BEFORE UPDATE ON donor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update impact_metrics.updated_at on change
CREATE TRIGGER update_impact_metrics_updated_at
  BEFORE UPDATE ON impact_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update donation_allocations.updated_at on change
CREATE TRIGGER update_donation_allocations_updated_at
  BEFORE UPDATE ON donation_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate donor tier based on annual giving
CREATE OR REPLACE FUNCTION calculate_donor_tier(annual_amount DECIMAL)
RETURNS TEXT AS $$
BEGIN
  IF annual_amount >= 10000 THEN
    RETURN 'founding';
  ELSIF annual_amount >= 2500 THEN
    RETURN 'champion';
  ELSIF annual_amount >= 500 THEN
    RETURN 'supporter';
  ELSE
    RETURN 'friend';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update donor profile stats when a donation is made
CREATE OR REPLACE FUNCTION update_donor_profile_stats()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
  new_total DECIMAL;
  new_ytd DECIMAL;
  new_count INTEGER;
  new_avg DECIMAL;
  new_largest DECIMAL;
  new_tier TEXT;
BEGIN
  -- Only process completed donations
  IF NEW.payment_status != 'completed' THEN
    RETURN NEW;
  END IF;

  -- Find or create donor profile
  SELECT id INTO profile_id FROM donor_profiles WHERE email = NEW.donor_email;

  IF profile_id IS NULL THEN
    INSERT INTO donor_profiles (
      email, first_name, last_name, phone,
      address_line1, address_line2, city, state, zip_code,
      first_donation_at, last_donation_at,
      stripe_customer_id
    ) VALUES (
      NEW.donor_email, NEW.donor_first_name, NEW.donor_last_name, NEW.donor_phone,
      NEW.address_line1, NEW.address_line2, NEW.city, NEW.state, NEW.zip_code,
      NOW(), NOW(),
      NEW.stripe_customer_id
    )
    RETURNING id INTO profile_id;
  END IF;

  -- Calculate updated stats
  SELECT
    COALESCE(SUM(amount), 0),
    COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW()) THEN amount ELSE 0 END), 0),
    COUNT(*),
    COALESCE(AVG(amount), 0),
    COALESCE(MAX(amount), 0)
  INTO new_total, new_ytd, new_count, new_avg, new_largest
  FROM donations
  WHERE donor_email = NEW.donor_email AND payment_status = 'completed';

  -- Calculate tier
  new_tier := calculate_donor_tier(new_ytd);

  -- Update donor profile
  UPDATE donor_profiles SET
    total_given = new_total,
    ytd_given = new_ytd,
    donation_count = new_count,
    average_donation = new_avg,
    largest_donation = new_largest,
    last_donation_at = NOW(),
    tier = new_tier,
    is_recurring = (NEW.frequency != 'one_time'),
    recurring_amount = CASE WHEN NEW.frequency != 'one_time' THEN NEW.amount ELSE recurring_amount END,
    recurring_frequency = CASE WHEN NEW.frequency != 'one_time' THEN NEW.frequency ELSE recurring_frequency END,
    updated_at = NOW()
  WHERE id = profile_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update donor profile on donation
DROP TRIGGER IF EXISTS trigger_update_donor_profile ON donations;
CREATE TRIGGER trigger_update_donor_profile
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_donor_profile_stats();

-- ============================================================================
-- SEED IMPACT METRICS (Sample data for demonstration)
-- ============================================================================

-- Only insert if table is empty
INSERT INTO impact_metrics (metric_type, metric_name, metric_value, metric_unit, period_type, period_start, period_end, description)
SELECT * FROM (VALUES
  ('program', 'fathers_graduated', 127, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Fathers who completed Father Forward program'),
  ('program', 'youth_certified', 89, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Youth who earned Google IT certification'),
  ('program', 'families_served', 342, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Families impacted through all programs'),
  ('program', 'employment_rate', 78, 'percentage', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Graduates who secured employment within 6 months'),
  ('service', 'nonprofits_served', 23, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Nonprofit organizations receiving IT services'),
  ('service', 'users_supported', 850, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'End users supported through MSP services'),
  ('service', 'uptime_delivered', 99.9, 'percentage', 'year', '2025-01-01'::DATE, '2025-12-31'::DATE, 'System uptime delivered to clients'),
  ('event', 'events_hosted', 24, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Community events hosted'),
  ('event', 'meals_served', 2400, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Meals served at Movies on the Menu events'),
  ('community', 'volunteer_hours', 1240, 'hours', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Total volunteer hours contributed'),
  ('community', 'partners', 15, 'count', 'all_time', '2023-01-01'::DATE, CURRENT_DATE, 'Partner organizations'),
  ('financial', 'overhead_ratio', 14, 'percentage', 'year', '2025-01-01'::DATE, '2025-12-31'::DATE, 'Administrative overhead as percentage of revenue'),
  ('financial', 'program_efficiency', 86, 'percentage', 'year', '2025-01-01'::DATE, '2025-12-31'::DATE, 'Percentage of funds going directly to programs')
) AS t(metric_type, metric_name, metric_value, metric_unit, period_type, period_start, period_end, description)
WHERE NOT EXISTS (SELECT 1 FROM impact_metrics LIMIT 1);

-- Sample allocation (current period)
INSERT INTO donation_allocations (period_start, period_end, programs_percent, operations_percent, events_percent, admin_percent, is_published)
SELECT '2025-01-01'::DATE, '2025-12-31'::DATE, 60.00, 25.00, 10.00, 5.00, true
WHERE NOT EXISTS (SELECT 1 FROM donation_allocations LIMIT 1);
