-- Forever Forward Foundation - Events Check-In Enhancement
-- Migration: 014_events_checkin_enhancement.sql
-- Description: Adds advanced check-in/out, guest management, table assignments, and event analytics

-- ============================================================================
-- EVENT ATTENDEES TABLE ENHANCEMENTS
-- ============================================================================

-- Check-in method tracking
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS check_in_method TEXT;
-- check_in_method: "qr_scan", "manual", "pre_registered", "walk_up"

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS check_in_notes TEXT;
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS checked_in_by UUID;
-- references users(id) - who performed the check-in

-- Guest/party management
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS guests_count INTEGER DEFAULT 0;
-- Total guests in party (excluding primary registrant)

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS guests_checked_in INTEGER DEFAULT 0;
-- How many guests have been checked in

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS guest_names TEXT[];
-- Array of guest names for badges: ["Sarah Smith", "Mike Smith"]

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS party_size INTEGER DEFAULT 1;
-- Total party size including registrant (guests_count + 1)

-- Table/seating management
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS table_number TEXT;
-- e.g., "Table 5", "VIP Table A"

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS seat_assignment TEXT;
-- e.g., "5A", "VIP-1"

-- Special flags
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS is_donor BOOLEAN DEFAULT false;
-- is_donor: auto-set if attendee email matches a donor

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS is_walk_up BOOLEAN DEFAULT false;
-- Walk-up registrations (day-of)

ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS is_sponsor BOOLEAN DEFAULT false;
-- Sponsor representatives

-- Badge printing
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS badge_printed BOOLEAN DEFAULT false;
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS badge_printed_at TIMESTAMPTZ;

-- Contact preferences
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS opt_in_communications BOOLEAN DEFAULT true;
-- Opt-in for future event notifications

-- Source tracking
ALTER TABLE event_attendees ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'website';
-- 'website', 'admin', 'walk_up', 'import', 'comp'

-- ============================================================================
-- EVENT CHECK-IN LOG TABLE (Activity timeline)
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_checkin_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Related records
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES event_attendees(id) ON DELETE CASCADE,

  -- Action details
  action TEXT NOT NULL CHECK (action IN (
    'check_in',          -- Primary registrant checked in
    'check_out',         -- Registrant checked out
    'guest_check_in',    -- A guest in the party checked in
    'guest_check_out',   -- A guest checked out
    'badge_print',       -- Badge was printed
    'table_assign',      -- Table assignment changed
    'walk_up_register',  -- Walk-up registration created
    'payment_received',  -- Payment collected (walk-up)
    'vip_upgrade',       -- Upgraded to VIP status
    'note_added',        -- Admin note added
    'refund_issued'      -- Refund processed
  )),

  -- Method of action
  method TEXT,
  -- For check_in: "qr_scan", "manual_search", "name_lookup"

  -- Who performed the action
  performed_by UUID,
  -- references users(id)

  -- Additional context
  notes TEXT,
  metadata JSONB,
  -- metadata examples:
  -- { "guest_name": "Sarah Smith", "guest_index": 1 }
  -- { "old_table": "5", "new_table": "VIP-A" }
  -- { "payment_amount": 25.00, "payment_method": "cash" }

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENT ANALYTICS TABLE (Aggregated event statistics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- One analytics record per event
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE UNIQUE,

  -- Registration stats
  total_registered INTEGER DEFAULT 0,
  total_tickets INTEGER DEFAULT 0, -- Total tickets (may be more than registered if party tickets)
  total_guests INTEGER DEFAULT 0, -- Total guests (not counting primary registrants)

  -- Attendance stats
  total_checked_in INTEGER DEFAULT 0,
  guests_checked_in INTEGER DEFAULT 0,
  total_walk_ups INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0, -- Calculated: registered - checked_in - cancelled

  -- Peak and timing
  peak_attendance INTEGER DEFAULT 0, -- Maximum simultaneous attendees
  peak_time TIMESTAMPTZ,
  first_check_in_at TIMESTAMPTZ,
  last_check_in_at TIMESTAMPTZ,
  avg_arrival_minutes INTEGER, -- Average minutes after event start

  -- Revenue stats
  revenue_tickets DECIMAL(10,2) DEFAULT 0,
  revenue_addons DECIMAL(10,2) DEFAULT 0,
  revenue_donations DECIMAL(10,2) DEFAULT 0, -- Donations at event
  revenue_walk_ups DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,

  -- Refund stats
  refunds_issued INTEGER DEFAULT 0,
  refunds_amount DECIMAL(10,2) DEFAULT 0,

  -- Special attendees
  vip_attendees INTEGER DEFAULT 0,
  donor_attendees INTEGER DEFAULT 0,
  sponsor_attendees INTEGER DEFAULT 0,

  -- Engagement
  badge_prints INTEGER DEFAULT 0,
  table_assignments INTEGER DEFAULT 0,

  -- Feedback (optional post-event)
  feedback_submissions INTEGER DEFAULT 0,
  feedback_avg_rating DECIMAL(3,2),
  feedback_nps_score INTEGER, -- Net Promoter Score (-100 to 100)

  -- Comparison data
  attendance_rate DECIMAL(5,2), -- (checked_in / registered) * 100
  growth_vs_last DECIMAL(5,2), -- % growth compared to previous similar event

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENT TABLES TABLE (Table/seating management for seated events)
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Table identification
  table_number TEXT NOT NULL,
  table_name TEXT, -- Optional friendly name "VIP Table", "Family Table"

  -- Capacity
  capacity INTEGER DEFAULT 8,
  seats_filled INTEGER DEFAULT 0,

  -- Location/type
  section TEXT, -- "VIP", "General", "Family"
  location_notes TEXT, -- "Near stage", "By entrance"

  -- Special designations
  is_vip BOOLEAN DEFAULT false,
  is_reserved BOOLEAN DEFAULT false,
  reserved_for TEXT, -- "Smith Family", "Sponsor: ABC Corp"

  -- Status
  is_full BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique table number per event
  UNIQUE(event_id, table_number)
);

-- ============================================================================
-- EVENT FEEDBACK TABLE (Post-event surveys)
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES event_attendees(id) ON DELETE SET NULL,

  -- Anonymous option
  is_anonymous BOOLEAN DEFAULT false,
  submitted_email TEXT, -- If not linked to attendee

  -- Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
  organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),

  -- NPS question (-100 to 100 scale, stored as 0-10)
  would_recommend INTEGER CHECK (would_recommend >= 0 AND would_recommend <= 10),
  -- NPS: 9-10 = Promoter, 7-8 = Passive, 0-6 = Detractor

  -- Open-ended
  what_went_well TEXT,
  what_could_improve TEXT,
  additional_comments TEXT,

  -- Would attend again
  would_attend_again BOOLEAN,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Event attendees - check-in related
CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON event_attendees(event_id, checked_in);
CREATE INDEX IF NOT EXISTS idx_attendees_vip ON event_attendees(event_id, is_vip);
CREATE INDEX IF NOT EXISTS idx_attendees_donor ON event_attendees(event_id, is_donor);
CREATE INDEX IF NOT EXISTS idx_attendees_walk_up ON event_attendees(event_id, is_walk_up);
CREATE INDEX IF NOT EXISTS idx_attendees_table ON event_attendees(event_id, table_number);

-- Check-in log
CREATE INDEX IF NOT EXISTS idx_checkin_log_event ON event_checkin_log(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkin_log_attendee ON event_checkin_log(attendee_id);
CREATE INDEX IF NOT EXISTS idx_checkin_log_action ON event_checkin_log(event_id, action);

-- Event analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event ON event_analytics(event_id);

-- Event tables
CREATE INDEX IF NOT EXISTS idx_tables_event ON event_tables(event_id);
CREATE INDEX IF NOT EXISTS idx_tables_available ON event_tables(event_id, is_full);

-- Event feedback
CREATE INDEX IF NOT EXISTS idx_feedback_event ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_attendee ON event_feedback(attendee_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update event_analytics.updated_at on change
CREATE TRIGGER update_event_analytics_updated_at
  BEFORE UPDATE ON event_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update event_tables.updated_at on change
CREATE TRIGGER update_event_tables_updated_at
  BEFORE UPDATE ON event_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update event analytics when check-in happens
CREATE OR REPLACE FUNCTION update_event_analytics_on_checkin()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when checked_in changes to true
  IF NEW.checked_in = true AND (OLD.checked_in IS NULL OR OLD.checked_in = false) THEN
    -- Upsert analytics record
    INSERT INTO event_analytics (event_id, total_checked_in, first_check_in_at)
    VALUES (NEW.event_id, 1, NOW())
    ON CONFLICT (event_id) DO UPDATE SET
      total_checked_in = event_analytics.total_checked_in + 1,
      last_check_in_at = NOW(),
      first_check_in_at = COALESCE(event_analytics.first_check_in_at, NOW()),
      peak_attendance = GREATEST(event_analytics.peak_attendance, event_analytics.total_checked_in + 1),
      peak_time = CASE
        WHEN event_analytics.total_checked_in + 1 > event_analytics.peak_attendance
        THEN NOW()
        ELSE event_analytics.peak_time
      END,
      updated_at = NOW();

    -- Update VIP/donor/walk-up counters
    IF NEW.is_vip THEN
      UPDATE event_analytics SET vip_attendees = vip_attendees + 1 WHERE event_id = NEW.event_id;
    END IF;
    IF NEW.is_donor THEN
      UPDATE event_analytics SET donor_attendees = donor_attendees + 1 WHERE event_id = NEW.event_id;
    END IF;
    IF NEW.is_walk_up THEN
      UPDATE event_analytics SET total_walk_ups = total_walk_ups + 1 WHERE event_id = NEW.event_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for check-in analytics
DROP TRIGGER IF EXISTS trigger_checkin_analytics ON event_attendees;
CREATE TRIGGER trigger_checkin_analytics
  AFTER UPDATE OF checked_in ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION update_event_analytics_on_checkin();

-- Function to check if attendee is a donor
CREATE OR REPLACE FUNCTION check_attendee_is_donor()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this email exists in donations
  IF EXISTS (
    SELECT 1 FROM donations
    WHERE donor_email = NEW.email
    AND payment_status = 'completed'
    LIMIT 1
  ) THEN
    NEW.is_donor := true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-detect donors on registration
DROP TRIGGER IF EXISTS trigger_check_donor ON event_attendees;
CREATE TRIGGER trigger_check_donor
  BEFORE INSERT ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION check_attendee_is_donor();

-- Function to create analytics record when event is created
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_analytics (event_id) VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create analytics on event creation
DROP TRIGGER IF EXISTS trigger_create_analytics ON events;
CREATE TRIGGER trigger_create_analytics
  AFTER INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION create_event_analytics();

-- Function to log check-in activity
CREATE OR REPLACE FUNCTION log_checkin_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log when checked_in changes to true
  IF NEW.checked_in = true AND (OLD.checked_in IS NULL OR OLD.checked_in = false) THEN
    INSERT INTO event_checkin_log (
      event_id,
      attendee_id,
      action,
      method,
      performed_by,
      metadata
    ) VALUES (
      NEW.event_id,
      NEW.id,
      'check_in',
      NEW.check_in_method,
      NEW.checked_in_by,
      jsonb_build_object(
        'ticket_quantity', NEW.ticket_quantity,
        'guests_count', NEW.guests_count,
        'is_vip', NEW.is_vip,
        'is_donor', NEW.is_donor
      )
    );
  END IF;

  -- Log badge print
  IF NEW.badge_printed = true AND (OLD.badge_printed IS NULL OR OLD.badge_printed = false) THEN
    INSERT INTO event_checkin_log (
      event_id,
      attendee_id,
      action,
      metadata
    ) VALUES (
      NEW.event_id,
      NEW.id,
      'badge_print',
      jsonb_build_object('printed_at', NOW())
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log check-in and badge activities
DROP TRIGGER IF EXISTS trigger_log_checkin ON event_attendees;
CREATE TRIGGER trigger_log_checkin
  AFTER UPDATE ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION log_checkin_activity();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for live event dashboard
CREATE OR REPLACE VIEW event_live_stats AS
SELECT
  e.id as event_id,
  e.title,
  e.start_datetime,
  e.capacity,
  COUNT(DISTINCT a.id) as total_registered,
  SUM(COALESCE(a.ticket_quantity, 1)) as total_tickets,
  SUM(COALESCE(a.guests_count, 0)) as total_guests,
  COUNT(DISTINCT CASE WHEN a.checked_in = true THEN a.id END) as checked_in_count,
  SUM(CASE WHEN a.checked_in = true THEN COALESCE(a.guests_checked_in, 0) ELSE 0 END) as guests_checked_in,
  COUNT(DISTINCT CASE WHEN a.is_walk_up = true THEN a.id END) as walk_ups,
  COUNT(DISTINCT CASE WHEN a.is_vip = true THEN a.id END) as vip_count,
  COUNT(DISTINCT CASE WHEN a.is_donor = true THEN a.id END) as donor_count,
  ROUND(
    (COUNT(DISTINCT CASE WHEN a.checked_in = true THEN a.id END)::DECIMAL /
     NULLIF(COUNT(DISTINCT a.id), 0)) * 100, 1
  ) as check_in_rate,
  SUM(COALESCE(a.total_paid, 0)) as total_revenue
FROM events e
LEFT JOIN event_attendees a ON e.id = a.event_id
WHERE e.is_cancelled = false
GROUP BY e.id, e.title, e.start_datetime, e.capacity;
