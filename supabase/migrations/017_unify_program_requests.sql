-- ============================================================================
-- Migration 017: Unify leads / program requests / enrollments
-- A program membership is now identified by EMAIL, so a website enrollment and
-- a portal signup are the same record. member_id links it to a login once the
-- person has an account (claimed at signup). One funnel, one approval, access.
-- ============================================================================

-- member_id becomes optional (a website enrollment has no account yet).
ALTER TABLE program_memberships ALTER COLUMN member_id DROP NOT NULL;

-- Carry identity + provenance on the row itself.
ALTER TABLE program_memberships ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE program_memberships ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE program_memberships ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'portal';

-- Backfill email/full_name for any existing (member-keyed) rows.
UPDATE program_memberships pm
SET email = m.email,
    full_name = COALESCE(pm.full_name, m.full_name)
FROM members m
WHERE pm.member_id = m.id AND pm.email IS NULL;

-- Identity is now (email, program), not (member_id, program).
ALTER TABLE program_memberships DROP CONSTRAINT IF EXISTS program_memberships_member_id_program_key;
CREATE UNIQUE INDEX IF NOT EXISTS program_memberships_email_program_key
  ON program_memberships (lower(email), program);
CREATE INDEX IF NOT EXISTS idx_program_memberships_email ON program_memberships (lower(email));
