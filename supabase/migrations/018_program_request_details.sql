-- ============================================================================
-- Migration 018: Full application details on a program request
-- The website enrollment application now lands directly in program_memberships
-- (Program Requests) carrying all of the applicant's information.
-- ============================================================================

ALTER TABLE program_memberships ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE program_memberships ADD COLUMN IF NOT EXISTS details JSONB;
