-- Migration: Lead Assessment Enhancement
-- Purpose: Add assessment tracking, program fit scoring, and AI classification fields to leads table
-- This enables unified lead routing with comprehensive assessments for both Program and MSP tracks

-- ============================================================================
-- ASSESSMENT DATA & TRACKING
-- ============================================================================

-- Full assessment data as flexible JSONB (ProgramAssessmentData or ITAssessmentData)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assessment_data JSONB;

-- When the assessment was completed
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assessment_completed_at TIMESTAMPTZ;

-- ============================================================================
-- AI CLASSIFICATION & SCORING
-- ============================================================================

-- Fit score for program leads (0-100, how well they match recommended program)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fit_score INTEGER;

-- AI-recommended programs for program leads (sorted by fit)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recommended_programs TEXT[];

-- Identified barriers from assessment (transportation, childcare, housing, etc.)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS barriers TEXT[];

-- Identified support needs (job_training, certification, mentorship, etc.)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS support_needs TEXT[];

-- Readiness level for program enrollment (high, medium, low)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS readiness_level TEXT
  CHECK (readiness_level IS NULL OR readiness_level IN ('high', 'medium', 'low'));

-- ============================================================================
-- ENHANCED IT ASSESSMENT FIELDS (for MSP leads on leads table)
-- ============================================================================

-- Compliance requirements (HIPAA, FERPA, PCI-DSS, SOC2, none)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS compliance_requirements TEXT[];

-- Disaster recovery status (has_plan, no_plan, partial)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS disaster_recovery_status TEXT;

-- Expected growth in next 12 months (users)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS growth_projection_users INTEGER;

-- Number of office locations
ALTER TABLE leads ADD COLUMN IF NOT EXISTS office_count INTEGER;

-- Remote worker percentage
ALTER TABLE leads ADD COLUMN IF NOT EXISTS remote_worker_percent INTEGER;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on assessment completion for filtering leads who completed assessment
CREATE INDEX IF NOT EXISTS idx_leads_assessment_completed
ON leads (assessment_completed_at)
WHERE assessment_completed_at IS NOT NULL;

-- GIN index on recommended programs for filtering by program type
CREATE INDEX IF NOT EXISTS idx_leads_recommended_programs
ON leads USING GIN (recommended_programs);

-- Index on readiness level for prioritizing ready-to-enroll leads
CREATE INDEX IF NOT EXISTS idx_leads_readiness_level
ON leads (readiness_level)
WHERE readiness_level IS NOT NULL;

-- GIN index on barriers for filtering/reporting
CREATE INDEX IF NOT EXISTS idx_leads_barriers
ON leads USING GIN (barriers);

-- ============================================================================
-- ALSO ADD COMPLIANCE FIELDS TO MSP_CLIENTS (for enhanced IT assessment)
-- ============================================================================

ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS compliance_requirements TEXT[];
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS disaster_recovery_status TEXT;
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS growth_projection_users INTEGER;
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS office_count INTEGER;
ALTER TABLE msp_clients ADD COLUMN IF NOT EXISTS remote_worker_percent INTEGER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN leads.assessment_data IS 'Full JSONB snapshot of assessment form responses (ProgramAssessmentData or ITAssessmentData)';
COMMENT ON COLUMN leads.assessment_completed_at IS 'Timestamp when the assessment form was completed';
COMMENT ON COLUMN leads.fit_score IS 'AI-calculated program fit score (0-100) for program leads';
COMMENT ON COLUMN leads.recommended_programs IS 'Array of recommended programs sorted by fit score';
COMMENT ON COLUMN leads.barriers IS 'Array of identified barriers (transportation, childcare, housing, etc.)';
COMMENT ON COLUMN leads.support_needs IS 'Array of identified support needs (job_training, certification, mentorship, etc.)';
COMMENT ON COLUMN leads.readiness_level IS 'Readiness level for enrollment: high, medium, low';
COMMENT ON COLUMN leads.compliance_requirements IS 'Array of compliance requirements (HIPAA, FERPA, PCI-DSS, SOC2)';
COMMENT ON COLUMN leads.disaster_recovery_status IS 'Current disaster recovery status: has_plan, no_plan, partial';
COMMENT ON COLUMN leads.growth_projection_users IS 'Expected user growth in next 12 months';
COMMENT ON COLUMN leads.office_count IS 'Number of office/facility locations';
COMMENT ON COLUMN leads.remote_worker_percent IS 'Percentage of workforce that works remotely';
