-- Migration: Add IT Assessment Fields to MSP Clients
-- Purpose: Enable comprehensive IT discovery data capture from Free Assessment form
-- This transforms basic MSP prospects into rich client profiles with actionable intelligence

-- ============================================================================
-- ASSESSMENT TRACKING
-- ============================================================================

-- When the assessment was completed
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS assessment_completed_at TIMESTAMPTZ;

-- Full assessment data as flexible JSONB (for extensibility)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS assessment_data JSONB;

-- ============================================================================
-- CURRENT IT SITUATION
-- ============================================================================

-- Monthly IT spend (helps with value comparison in proposals)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS current_it_spend_monthly NUMERIC;

-- Current IT provider name (competitor intel)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS current_it_provider VARCHAR(255);

-- Type of support they need: 'ongoing', 'project', 'both', 'none'
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS support_type VARCHAR(50);

-- Do they have internal IT staff?
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS has_it_staff BOOLEAN DEFAULT FALSE;

-- How many internal IT staff (if any)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS it_staff_count INTEGER;

-- ============================================================================
-- TECHNOLOGY INVENTORY
-- ============================================================================

-- Number of devices (computers, laptops, tablets)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS device_count INTEGER;

-- Number of servers (on-premise or cloud)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS server_count INTEGER;

-- Cloud services they use (e.g., ['Microsoft 365', 'Google Workspace', 'AWS'])
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS cloud_services TEXT[];

-- Current IT tools/software (e.g., ['QuickBooks', 'Salesforce', 'Slack'])
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS current_tools TEXT[];

-- ============================================================================
-- CHALLENGES & PRIORITIES
-- ============================================================================

-- Pain points they identified (multi-select options)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS pain_points TEXT[];

-- Their top 3 priorities (ranked)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS top_priorities TEXT[];

-- Open-ended: their biggest IT challenge
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS biggest_challenge TEXT;

-- Open-ended: ideal outcome they're hoping for
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS ideal_outcome TEXT;

-- ============================================================================
-- DECISION CONTEXT
-- ============================================================================

-- Timeline for making a decision: 'immediately', '1-2 weeks', '1 month', '3+ months', 'just exploring'
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS decision_timeline VARCHAR(50);

-- Budget range: 'under_500', '500_1000', '1000_2500', '2500_5000', '5000_plus', 'not_sure'
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50);

-- Services they're interested in (from assessment)
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS services_interested TEXT[];

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on assessment completion for filtering clients who completed assessment
CREATE INDEX IF NOT EXISTS idx_msp_clients_assessment_completed
ON msp_clients (assessment_completed_at)
WHERE assessment_completed_at IS NOT NULL;

-- Index on support type for filtering by ongoing vs project clients
CREATE INDEX IF NOT EXISTS idx_msp_clients_support_type
ON msp_clients (support_type)
WHERE support_type IS NOT NULL;

-- Index on decision timeline for prioritizing hot leads
CREATE INDEX IF NOT EXISTS idx_msp_clients_decision_timeline
ON msp_clients (decision_timeline)
WHERE decision_timeline IS NOT NULL;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN msp_clients.assessment_completed_at IS 'Timestamp when the Free IT Assessment form was completed';
COMMENT ON COLUMN msp_clients.assessment_data IS 'Full JSONB snapshot of assessment form responses for extensibility';
COMMENT ON COLUMN msp_clients.current_it_spend_monthly IS 'Monthly IT spend in dollars - helps compare value in proposals';
COMMENT ON COLUMN msp_clients.current_it_provider IS 'Name of current IT provider (competitor intelligence)';
COMMENT ON COLUMN msp_clients.support_type IS 'Type of support needed: ongoing, project, both, none';
COMMENT ON COLUMN msp_clients.has_it_staff IS 'Whether they have internal IT staff';
COMMENT ON COLUMN msp_clients.it_staff_count IS 'Number of internal IT staff if has_it_staff is true';
COMMENT ON COLUMN msp_clients.device_count IS 'Total number of devices (computers, laptops, tablets)';
COMMENT ON COLUMN msp_clients.server_count IS 'Number of servers (on-premise or cloud)';
COMMENT ON COLUMN msp_clients.cloud_services IS 'Array of cloud services used (Microsoft 365, Google Workspace, etc.)';
COMMENT ON COLUMN msp_clients.current_tools IS 'Array of current IT tools and software';
COMMENT ON COLUMN msp_clients.pain_points IS 'Array of IT pain points identified in assessment';
COMMENT ON COLUMN msp_clients.top_priorities IS 'Ranked array of top 3 IT priorities';
COMMENT ON COLUMN msp_clients.biggest_challenge IS 'Open-ended description of their biggest IT challenge';
COMMENT ON COLUMN msp_clients.ideal_outcome IS 'What ideal IT support outcome looks like to them';
COMMENT ON COLUMN msp_clients.decision_timeline IS 'Timeline for making IT decision: immediately, 1-2 weeks, etc.';
COMMENT ON COLUMN msp_clients.budget_range IS 'Monthly budget range: under_500, 500_1000, etc.';
COMMENT ON COLUMN msp_clients.services_interested IS 'Array of Forever Forward services they are interested in';
