-- Migration: 004_storage_buckets.sql
-- Description: Create storage buckets for event images, documents, and other uploads

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Event images bucket (public for display on website)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Documents bucket (private for proposals, contracts, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Client logos and assets (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-assets',
  'client-assets',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Participant files (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'participant-files',
  'participant-files',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Event images: Anyone can view, authenticated users can upload/update/delete
CREATE POLICY "Public can view event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can update event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');

-- Documents: Only authenticated users can access
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- Client assets: Public view, authenticated upload
CREATE POLICY "Public can view client assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-assets');

CREATE POLICY "Authenticated users can upload client assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-assets');

CREATE POLICY "Authenticated users can update client assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'client-assets');

CREATE POLICY "Authenticated users can delete client assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'client-assets');

-- Participant files: Only authenticated users can access
CREATE POLICY "Authenticated users can view participant files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'participant-files');

CREATE POLICY "Authenticated users can upload participant files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'participant-files');

CREATE POLICY "Authenticated users can update participant files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'participant-files');

CREATE POLICY "Authenticated users can delete participant files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'participant-files');
