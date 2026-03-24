-- Migration: 005_documents_table.sql
-- Description: Create documents table for proposals, contracts, and other generated documents

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  client_id UUID REFERENCES msp_clients(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Document info
  document_type TEXT NOT NULL CHECK (document_type IN ('proposal', 'contract', 'invoice', 'certificate', 'report', 'other')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'rejected', 'expired')),

  -- Document metadata
  file_path TEXT,                    -- Storage path if saved as file
  file_url TEXT,                     -- Public URL if applicable
  file_size_bytes INTEGER,
  mime_type TEXT,

  -- Tracking dates
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Version control
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES documents(id),

  -- Additional data
  metadata JSONB,
  tags TEXT[],

  -- Creator info
  created_by UUID REFERENCES users(id),

  -- Constraints
  CONSTRAINT document_has_reference CHECK (
    client_id IS NOT NULL OR participant_id IS NOT NULL OR lead_id IS NOT NULL
  )
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_participant_id ON documents(participant_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view documents
CREATE POLICY "Authenticated users can view documents"
ON documents FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can create documents
CREATE POLICY "Authenticated users can create documents"
ON documents FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated users can update documents
CREATE POLICY "Authenticated users can update documents"
ON documents FOR UPDATE
TO authenticated
USING (true);

-- Policy: Authenticated users can delete documents
CREATE POLICY "Authenticated users can delete documents"
ON documents FOR DELETE
TO authenticated
USING (true);

-- ============================================================================
-- TRIGGER: Update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();
