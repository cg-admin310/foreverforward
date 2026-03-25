-- =============================================================================
-- Migration 008: Add total_weeks column to cohorts table
-- =============================================================================

-- Add total_weeks column for tracking program duration
ALTER TABLE cohorts
ADD COLUMN IF NOT EXISTS total_weeks INTEGER DEFAULT 8;

-- Add comment for documentation
COMMENT ON COLUMN cohorts.total_weeks IS 'Total number of weeks in the program';
