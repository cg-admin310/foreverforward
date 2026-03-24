-- Forever Forward Foundation - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Description: Implements role-based access control for all tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE msp_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE travis_conversations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is case worker or higher
CREATE OR REPLACE FUNCTION is_case_worker_or_higher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'case_worker')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is sales lead or higher
CREATE OR REPLACE FUNCTION is_sales_or_higher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'sales_lead')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is event coordinator or higher
CREATE OR REPLACE FUNCTION is_event_coordinator_or_higher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'event_coordinator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Super admins can see all users
CREATE POLICY "Super admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Super admins can manage all users
CREATE POLICY "Super admins can manage users"
  ON users FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- LEADS TABLE POLICIES
-- ============================================================================

-- Super admins and sales leads can see all leads
CREATE POLICY "Admin and sales can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_super_admin() OR get_user_role() = 'sales_lead');

-- Case workers can see program leads
CREATE POLICY "Case workers can view program leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    is_case_worker_or_higher()
    AND lead_type = 'program'
  );

-- Users can see leads assigned to them
CREATE POLICY "Users can view assigned leads"
  ON leads FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Super admins and sales can create leads
CREATE POLICY "Admin and sales can create leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin() OR get_user_role() = 'sales_lead');

-- Super admins and sales can update leads
CREATE POLICY "Admin and sales can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (is_super_admin() OR get_user_role() = 'sales_lead')
  WITH CHECK (is_super_admin() OR get_user_role() = 'sales_lead');

-- Only super admins can delete leads
CREATE POLICY "Only super admins can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (is_super_admin());

-- Anonymous users can insert leads (from website forms)
CREATE POLICY "Anonymous can submit leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================================
-- COHORTS TABLE POLICIES
-- ============================================================================

-- Anyone authenticated can view cohorts
CREATE POLICY "Authenticated users can view cohorts"
  ON cohorts FOR SELECT
  TO authenticated
  USING (true);

-- Super admins and case workers can manage cohorts
CREATE POLICY "Admin and case workers can manage cohorts"
  ON cohorts FOR ALL
  TO authenticated
  USING (is_case_worker_or_higher())
  WITH CHECK (is_case_worker_or_higher());

-- ============================================================================
-- PARTICIPANTS TABLE POLICIES
-- ============================================================================

-- Super admins can see all participants
CREATE POLICY "Super admins can view all participants"
  ON participants FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Case workers can see all program participants
CREATE POLICY "Case workers can view all participants"
  ON participants FOR SELECT
  TO authenticated
  USING (get_user_role() = 'case_worker');

-- Users can see participants assigned to them
CREATE POLICY "Users can view assigned participants"
  ON participants FOR SELECT
  TO authenticated
  USING (assigned_case_worker = auth.uid());

-- Super admins and case workers can manage participants
CREATE POLICY "Admin and case workers can manage participants"
  ON participants FOR ALL
  TO authenticated
  USING (is_case_worker_or_higher())
  WITH CHECK (is_case_worker_or_higher());

-- Anonymous can create participants (enrollment form)
CREATE POLICY "Anonymous can submit enrollment"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================================
-- MSP CLIENTS TABLE POLICIES
-- ============================================================================

-- Super admins and sales can see all clients
CREATE POLICY "Admin and sales can view all clients"
  ON msp_clients FOR SELECT
  TO authenticated
  USING (is_super_admin() OR get_user_role() = 'sales_lead');

-- Technicians can see clients they're assigned to
CREATE POLICY "Technicians can view assigned clients"
  ON msp_clients FOR SELECT
  TO authenticated
  USING (
    get_user_role() = 'technician'
    AND auth.uid() = ANY(assigned_technicians)
  );

-- Account managers can see their clients
CREATE POLICY "Account managers can view their clients"
  ON msp_clients FOR SELECT
  TO authenticated
  USING (account_manager = auth.uid());

-- Super admins and sales can manage clients
CREATE POLICY "Admin and sales can manage clients"
  ON msp_clients FOR ALL
  TO authenticated
  USING (is_sales_or_higher())
  WITH CHECK (is_sales_or_higher());

-- ============================================================================
-- DOCUMENTS TABLE POLICIES
-- ============================================================================

-- Super admins can see all documents
CREATE POLICY "Super admins can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Users can see documents they created
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Case workers can see participant documents
CREATE POLICY "Case workers can view participant documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    is_case_worker_or_higher()
    AND participant_id IS NOT NULL
  );

-- Sales can see client documents
CREATE POLICY "Sales can view client documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    is_sales_or_higher()
    AND client_id IS NOT NULL
  );

-- Super admins and appropriate roles can manage documents
CREATE POLICY "Authorized users can manage documents"
  ON documents FOR ALL
  TO authenticated
  USING (
    is_super_admin()
    OR created_by = auth.uid()
    OR (is_case_worker_or_higher() AND participant_id IS NOT NULL)
    OR (is_sales_or_higher() AND client_id IS NOT NULL)
  )
  WITH CHECK (
    is_super_admin()
    OR (is_case_worker_or_higher() AND participant_id IS NOT NULL)
    OR (is_sales_or_higher() AND client_id IS NOT NULL)
  );

-- ============================================================================
-- EMAILS TABLE POLICIES
-- ============================================================================

-- Super admins can see all emails
CREATE POLICY "Super admins can view all emails"
  ON emails FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Users can see emails they created
CREATE POLICY "Users can view own emails"
  ON emails FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Authorized users can manage emails
CREATE POLICY "Authorized users can manage emails"
  ON emails FOR ALL
  TO authenticated
  USING (is_super_admin() OR created_by = auth.uid())
  WITH CHECK (is_super_admin() OR created_by = auth.uid());

-- ============================================================================
-- ACTIVITIES TABLE POLICIES
-- ============================================================================

-- Super admins can see all activities
CREATE POLICY "Super admins can view all activities"
  ON activities FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Users can see activities they performed
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (performed_by = auth.uid());

-- Case workers can see participant activities
CREATE POLICY "Case workers can view participant activities"
  ON activities FOR SELECT
  TO authenticated
  USING (
    is_case_worker_or_higher()
    AND participant_id IS NOT NULL
  );

-- Sales can see client activities
CREATE POLICY "Sales can view client activities"
  ON activities FOR SELECT
  TO authenticated
  USING (
    is_sales_or_higher()
    AND (client_id IS NOT NULL OR lead_id IS NOT NULL)
  );

-- Authenticated users can create activities
CREATE POLICY "Authenticated users can create activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- WORKFORCE TABLE POLICIES
-- ============================================================================

-- Super admins and sales can see all workforce
CREATE POLICY "Admin and sales can view workforce"
  ON workforce FOR SELECT
  TO authenticated
  USING (is_sales_or_higher());

-- Workforce members can see their own profile
CREATE POLICY "Workers can view own profile"
  ON workforce FOR SELECT
  TO authenticated
  USING (
    participant_id IN (
      SELECT p.id FROM participants p
      JOIN users u ON p.email = u.email
      WHERE u.id = auth.uid()
    )
  );

-- Super admins and sales can manage workforce
CREATE POLICY "Admin and sales can manage workforce"
  ON workforce FOR ALL
  TO authenticated
  USING (is_sales_or_higher())
  WITH CHECK (is_sales_or_higher());

-- ============================================================================
-- ASSIGNMENTS TABLE POLICIES
-- ============================================================================

-- Super admins and sales can see all assignments
CREATE POLICY "Admin and sales can view assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (is_sales_or_higher());

-- Technicians can see their assignments
CREATE POLICY "Workers can view own assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    workforce_id IN (
      SELECT w.id FROM workforce w
      JOIN participants p ON w.participant_id = p.id
      JOIN users u ON p.email = u.email
      WHERE u.id = auth.uid()
    )
  );

-- Super admins and sales can manage assignments
CREATE POLICY "Admin and sales can manage assignments"
  ON assignments FOR ALL
  TO authenticated
  USING (is_sales_or_higher())
  WITH CHECK (is_sales_or_higher());

-- ============================================================================
-- EVENTS TABLE POLICIES
-- ============================================================================

-- Anyone can see published events
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  TO anon
  USING (is_published = true AND is_cancelled = false);

-- Authenticated users can see all non-cancelled events
CREATE POLICY "Authenticated can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (is_cancelled = false OR is_super_admin());

-- Super admins and event coordinators can manage events
CREATE POLICY "Admin and coordinators can manage events"
  ON events FOR ALL
  TO authenticated
  USING (is_event_coordinator_or_higher())
  WITH CHECK (is_event_coordinator_or_higher());

-- ============================================================================
-- EVENT ATTENDEES TABLE POLICIES
-- ============================================================================

-- Super admins and event coordinators can see all attendees
CREATE POLICY "Admin and coordinators can view attendees"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (is_event_coordinator_or_higher());

-- Attendees can see their own registrations
CREATE POLICY "Attendees can view own registrations"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (
    email IN (SELECT email FROM users WHERE id = auth.uid())
  );

-- Anyone can register for events
CREATE POLICY "Anyone can register for events"
  ON event_attendees FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can also register
CREATE POLICY "Authenticated can register"
  ON event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Super admins and coordinators can manage attendees
CREATE POLICY "Admin and coordinators can manage attendees"
  ON event_attendees FOR UPDATE
  TO authenticated
  USING (is_event_coordinator_or_higher())
  WITH CHECK (is_event_coordinator_or_higher());

CREATE POLICY "Admin and coordinators can delete attendees"
  ON event_attendees FOR DELETE
  TO authenticated
  USING (is_event_coordinator_or_higher());

-- ============================================================================
-- RESOURCES TABLE POLICIES
-- ============================================================================

-- Anyone authenticated can view active resources
CREATE POLICY "Authenticated can view active resources"
  ON resources FOR SELECT
  TO authenticated
  USING (is_active = true OR is_super_admin());

-- Super admins and case workers can manage resources
CREATE POLICY "Admin and case workers can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (is_case_worker_or_higher())
  WITH CHECK (is_case_worker_or_higher());

-- ============================================================================
-- DONATIONS TABLE POLICIES
-- ============================================================================

-- Super admins can see all donations
CREATE POLICY "Super admins can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Donors can see their own donations
CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (
    donor_email IN (SELECT email FROM users WHERE id = auth.uid())
  );

-- Anyone can create donations
CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Super admins can manage donations
CREATE POLICY "Super admins can manage donations"
  ON donations FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================================
-- CHECK-INS TABLE POLICIES
-- ============================================================================

-- Super admins can see all check-ins
CREATE POLICY "Super admins can view all checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Case workers can see check-ins they created or for their participants
CREATE POLICY "Case workers can view checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (
    get_user_role() = 'case_worker'
    AND (
      case_worker_id = auth.uid()
      OR participant_id IN (
        SELECT id FROM participants WHERE assigned_case_worker = auth.uid()
      )
    )
  );

-- Case workers can create check-ins
CREATE POLICY "Case workers can create checkins"
  ON checkins FOR INSERT
  TO authenticated
  WITH CHECK (is_case_worker_or_higher());

-- Case workers can update their own check-ins
CREATE POLICY "Case workers can update own checkins"
  ON checkins FOR UPDATE
  TO authenticated
  USING (case_worker_id = auth.uid() OR is_super_admin())
  WITH CHECK (case_worker_id = auth.uid() OR is_super_admin());

-- ============================================================================
-- BLOG CATEGORIES TABLE POLICIES
-- ============================================================================

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view categories"
  ON blog_categories FOR SELECT
  TO authenticated
  USING (true);

-- Super admins can manage categories
CREATE POLICY "Super admins can manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================================
-- BLOG POSTS TABLE POLICIES
-- ============================================================================

-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users can see published and their drafts
CREATE POLICY "Authenticated can view posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    OR author_id = auth.uid()
    OR is_super_admin()
  );

-- Super admins can manage all posts
CREATE POLICY "Super admins can manage all posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Authors can manage their own posts
CREATE POLICY "Authors can manage own posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE POLICIES
-- ============================================================================

-- Super admins can see all subscribers
CREATE POLICY "Super admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can subscribe"
  ON newsletter_subscribers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Super admins can manage subscribers
CREATE POLICY "Super admins can manage subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Subscribers can update/delete their own record
CREATE POLICY "Subscribers can manage own subscription"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (email IN (SELECT email FROM users WHERE id = auth.uid()))
  WITH CHECK (email IN (SELECT email FROM users WHERE id = auth.uid()));

-- ============================================================================
-- TRAVIS CONVERSATIONS TABLE POLICIES
-- ============================================================================

-- Super admins can see all conversations
CREATE POLICY "Super admins can view all conversations"
  ON travis_conversations FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Case workers can see conversations for their participants
CREATE POLICY "Case workers can view participant conversations"
  ON travis_conversations FOR SELECT
  TO authenticated
  USING (
    is_case_worker_or_higher()
    AND participant_id IN (
      SELECT id FROM participants
      WHERE assigned_case_worker = auth.uid()
    )
  );

-- System can insert conversations (API only)
CREATE POLICY "System can insert conversations"
  ON travis_conversations FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin() OR is_case_worker_or_higher());

-- Service role can manage (for API)
-- Note: Service role bypasses RLS by default
