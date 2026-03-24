-- Forever Forward Foundation - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Creates all core tables for the Forever Forward platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles for the SuperAdmin portal
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'case_worker',
  'sales_lead',
  'technician',
  'event_coordinator'
);

-- Lead types
CREATE TYPE lead_type AS ENUM (
  'program',
  'msp',
  'volunteer',
  'partner',
  'donation',
  'general'
);

-- Lead status
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost'
);

-- Program identifiers
CREATE TYPE program_type AS ENUM (
  'father_forward',
  'tech_ready_youth',
  'making_moments',
  'from_script_to_screen',
  'stories_from_my_future',
  'lula'
);

-- Participant status in program journey
CREATE TYPE participant_status AS ENUM (
  'applicant',
  'enrolled',
  'active',
  'on_hold',
  'completed',
  'withdrawn'
);

-- MSP pipeline stages
CREATE TYPE pipeline_stage AS ENUM (
  'new_lead',
  'discovery',
  'assessment',
  'proposal',
  'negotiation',
  'contract',
  'onboarding',
  'active',
  'churned'
);

-- Document types
CREATE TYPE document_type AS ENUM (
  'proposal',
  'contract',
  'certificate',
  'assessment',
  'qbr_report',
  'invoice',
  'other'
);

-- Document status
CREATE TYPE document_status AS ENUM (
  'draft',
  'sent',
  'viewed',
  'signed',
  'expired'
);

-- Email status
CREATE TYPE email_status AS ENUM (
  'draft',
  'scheduled',
  'sent',
  'delivered',
  'opened',
  'clicked',
  'bounced',
  'failed'
);

-- Event types
CREATE TYPE event_type AS ENUM (
  'movies_on_the_menu',
  'workshop',
  'graduation',
  'community',
  'fundraiser',
  'other'
);

-- Donation frequency
CREATE TYPE donation_frequency AS ENUM (
  'one_time',
  'monthly',
  'quarterly',
  'annual'
);

-- ============================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'case_worker',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  title TEXT,

  -- Classification
  lead_type lead_type NOT NULL DEFAULT 'general',
  status lead_status NOT NULL DEFAULT 'new',
  priority_score INTEGER DEFAULT 0 CHECK (priority_score >= 0 AND priority_score <= 100),

  -- Program interest (for program leads)
  program_interest program_type,

  -- MSP interest (for MSP leads)
  service_interests TEXT[], -- Array of service slugs
  estimated_value DECIMAL(10, 2),

  -- Source tracking
  source TEXT, -- How they found us
  referral_source TEXT, -- Specific referrer
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- AI classification
  ai_classification JSONB, -- Stores AI reasoning and insights

  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Notes and metadata
  notes TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- ============================================================================
-- COHORTS TABLE
-- ============================================================================

CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL, -- e.g., "Father Forward - Spring 2026"
  program program_type NOT NULL,

  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE,

  -- Capacity
  max_participants INTEGER DEFAULT 20,

  -- Staff
  primary_instructor UUID REFERENCES users(id) ON DELETE SET NULL,
  case_worker UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_accepting_applications BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  description TEXT,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PARTICIPANTS TABLE
-- ============================================================================

CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to lead (if came from website)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Personal info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT DEFAULT 'CA',
  zip_code TEXT,

  -- Program info
  program program_type NOT NULL,
  cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
  status participant_status NOT NULL DEFAULT 'applicant',

  -- Progress tracking
  current_week INTEGER DEFAULT 1,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),

  -- Employment (for Father Forward)
  employment_status TEXT,
  it_experience_level TEXT,

  -- Youth info (for youth programs)
  parent_guardian_name TEXT,
  parent_guardian_phone TEXT,
  parent_guardian_email TEXT,
  school_name TEXT,
  grade_level TEXT,

  -- Goals and barriers
  goals TEXT,
  barriers TEXT,

  -- Emergency contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  -- AI-generated Path Forward Plan
  path_forward_plan JSONB,

  -- Assignment
  assigned_case_worker UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Certifications
  google_it_cert_status TEXT, -- 'not_started', 'in_progress', 'passed', 'failed'
  google_it_cert_date DATE,

  -- Travis AI
  travis_conversation_summary TEXT,
  travis_last_interaction TIMESTAMPTZ,
  travis_escalation_flags TEXT[],

  -- Source tracking
  how_did_you_hear TEXT,

  -- Notes
  notes TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  enrolled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- MSP CLIENTS TABLE
-- ============================================================================

CREATE TABLE msp_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to lead
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Organization info
  organization_name TEXT NOT NULL,
  organization_type TEXT, -- 'nonprofit', 'school', 'church', 'government'
  website TEXT,

  -- Primary contact
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,
  primary_contact_title TEXT,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT DEFAULT 'CA',
  zip_code TEXT,

  -- Pipeline
  pipeline_stage pipeline_stage NOT NULL DEFAULT 'new_lead',
  days_in_stage INTEGER DEFAULT 0,
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contract details
  service_package TEXT, -- 'foundation', 'growth', 'custom'
  services TEXT[], -- Array of service slugs
  user_count INTEGER,
  monthly_value DECIMAL(10, 2),
  contract_start_date DATE,
  contract_end_date DATE,

  -- Billing
  stripe_customer_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'current', 'overdue'

  -- Assignment
  account_manager UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_technicians UUID[],

  -- Notes
  notes TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  document_type document_type NOT NULL,
  status document_status NOT NULL DEFAULT 'draft',

  -- Content
  content TEXT, -- Markdown content
  file_url TEXT, -- For uploaded files

  -- Related records
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES msp_clients(id) ON DELETE CASCADE,

  -- AI generation
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt_used TEXT,

  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,

  -- Creator
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- EMAILS TABLE
-- ============================================================================

CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Recipient
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_type TEXT, -- 'lead', 'participant', 'client'
  recipient_id UUID, -- Generic reference

  -- Email content
  subject TEXT NOT NULL,
  body TEXT NOT NULL,

  -- Status
  status email_status NOT NULL DEFAULT 'draft',

  -- AI generation
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt_used TEXT,

  -- Scheduling
  scheduled_for TIMESTAMPTZ,

  -- Tracking
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Sequence (for drip campaigns)
  sequence_id UUID,
  sequence_position INTEGER,

  -- Creator
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ACTIVITIES TABLE (Activity Log)
-- ============================================================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- What happened
  activity_type TEXT NOT NULL, -- 'note', 'email', 'call', 'status_change', 'document', 'check_in', etc.
  description TEXT NOT NULL,

  -- Related records (polymorphic)
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES msp_clients(id) ON DELETE CASCADE,

  -- Metadata
  metadata JSONB, -- Additional context

  -- Who did it
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- WORKFORCE TABLE (Program graduates in workforce pool)
-- ============================================================================

CREATE TABLE workforce (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to participant
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,

  -- Personal info (denormalized for convenience)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Skills and certifications
  certifications TEXT[],
  skills TEXT[],
  experience_level TEXT, -- 'entry', 'intermediate', 'advanced'

  -- Availability
  availability_status TEXT NOT NULL DEFAULT 'available', -- 'available', 'assigned', 'unavailable'
  available_hours_per_week INTEGER,
  preferred_schedule TEXT,

  -- Performance
  average_rating DECIMAL(3, 2) CHECK (average_rating >= 0 AND average_rating <= 5),
  total_hours_worked INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,

  -- Profile
  bio TEXT,
  resume_url TEXT,
  photo_url TEXT,

  -- Notes
  notes TEXT,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ASSIGNMENTS TABLE (Workforce assignments to clients)
-- ============================================================================

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  workforce_id UUID NOT NULL REFERENCES workforce(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES msp_clients(id) ON DELETE CASCADE,

  -- Assignment details
  role TEXT NOT NULL, -- 'technician', 'support', 'project'
  description TEXT,

  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE,
  hours_per_week INTEGER,

  -- Billing
  hourly_rate DECIMAL(10, 2),

  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'

  -- Time tracking
  total_hours_logged DECIMAL(10, 2) DEFAULT 0,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  event_type event_type NOT NULL,

  -- Description
  description TEXT,
  short_description TEXT,

  -- Schedule
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Los_Angeles',

  -- Location
  venue_name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT DEFAULT 'Los Angeles',
  state TEXT DEFAULT 'CA',
  zip_code TEXT,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,

  -- Capacity and tickets
  capacity INTEGER,
  ticket_price DECIMAL(10, 2) DEFAULT 0,
  tickets_sold INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,

  -- Movies on the Menu specific
  movie_title TEXT,
  movie_description TEXT,
  food_pairing TEXT,

  -- Media
  featured_image_url TEXT,
  gallery_urls TEXT[],

  -- Stripe
  stripe_product_id TEXT,
  stripe_price_id TEXT,

  -- Status
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_cancelled BOOLEAN DEFAULT false,

  -- Coordinator
  coordinator_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- EVENT ATTENDEES TABLE
-- ============================================================================

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Attendee info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Ticket info
  ticket_quantity INTEGER DEFAULT 1,
  ticket_type TEXT DEFAULT 'general',
  total_paid DECIMAL(10, 2) DEFAULT 0,

  -- Payment
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'

  -- Check-in
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,

  -- Special needs
  dietary_restrictions TEXT,
  accessibility_needs TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- RESOURCES TABLE (Partner organizations and resources)
-- ============================================================================

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Organization info
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'housing', 'employment', 'legal', 'health', 'education', 'financial', 'food', 'other'

  -- Contact
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,

  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT DEFAULT 'CA',
  zip_code TEXT,

  -- Details
  description TEXT,
  services_offered TEXT[],
  eligibility_requirements TEXT,
  hours_of_operation TEXT,

  -- Notes
  notes TEXT,
  tags TEXT[],

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- DONATIONS TABLE
-- ============================================================================

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Donor info
  donor_first_name TEXT NOT NULL,
  donor_last_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,

  -- Address (for acknowledgment letters)
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Donation details
  amount DECIMAL(10, 2) NOT NULL,
  frequency donation_frequency NOT NULL DEFAULT 'one_time',
  designation TEXT, -- What the donation is for

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT, -- For recurring
  stripe_customer_id TEXT,

  -- Status
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'

  -- Acknowledgment
  acknowledgment_sent BOOLEAN DEFAULT false,
  acknowledgment_sent_at TIMESTAMPTZ,

  -- Campaign tracking
  campaign TEXT,
  source TEXT,

  -- Anonymous
  is_anonymous BOOLEAN DEFAULT false,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CHECK-INS TABLE (Case worker notes on participants)
-- ============================================================================

CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  case_worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Check-in details
  checkin_type TEXT NOT NULL, -- 'weekly', 'milestone', 'concern', 'celebration'

  -- Content
  notes TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  engagement_rating INTEGER CHECK (engagement_rating >= 1 AND engagement_rating <= 5),

  -- Progress
  goals_discussed TEXT[],
  barriers_identified TEXT[],
  action_items TEXT[],

  -- Follow-up
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- BLOG CATEGORIES TABLE
-- ============================================================================

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Display order
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,

  -- Category
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,

  -- Author
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT, -- Fallback if user deleted

  -- Media
  featured_image_url TEXT,
  featured_image_alt TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],

  -- AI generation
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt_used TEXT,

  -- Engagement
  views INTEGER DEFAULT 0,

  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'scheduled', 'archived'
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,

  -- Reading
  read_time_minutes INTEGER,

  -- Tags
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,

  -- Preferences
  interests TEXT[], -- Program categories they're interested in

  -- Status
  is_active BOOLEAN DEFAULT true,
  confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMPTZ,

  -- Tracking
  source TEXT, -- Where they signed up

  -- Unsubscribe
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TRAVIS CONVERSATIONS TABLE (AI Chat History)
-- ============================================================================

CREATE TABLE travis_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,

  -- Message
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,

  -- AI metadata
  model_used TEXT,
  tokens_used INTEGER,

  -- Flags
  escalation_triggered BOOLEAN DEFAULT false,
  escalation_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Leads
CREATE INDEX idx_leads_type ON leads(lead_type);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Participants
CREATE INDEX idx_participants_program ON participants(program);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_cohort ON participants(cohort_id);
CREATE INDEX idx_participants_case_worker ON participants(assigned_case_worker);
CREATE INDEX idx_participants_email ON participants(email);

-- MSP Clients
CREATE INDEX idx_clients_stage ON msp_clients(pipeline_stage);
CREATE INDEX idx_clients_account_manager ON msp_clients(account_manager);
CREATE INDEX idx_clients_stripe ON msp_clients(stripe_customer_id);

-- Documents
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_participant ON documents(participant_id);
CREATE INDEX idx_documents_client ON documents(client_id);

-- Emails
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_recipient ON emails(recipient_email);
CREATE INDEX idx_emails_scheduled ON emails(scheduled_for);

-- Activities
CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_participant ON activities(participant_id);
CREATE INDEX idx_activities_client ON activities(client_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- Workforce
CREATE INDEX idx_workforce_status ON workforce(availability_status);
CREATE INDEX idx_workforce_participant ON workforce(participant_id);

-- Events
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_datetime ON events(start_datetime);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_published ON events(is_published);

-- Event Attendees
CREATE INDEX idx_attendees_event ON event_attendees(event_id);
CREATE INDEX idx_attendees_email ON event_attendees(email);

-- Donations
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_stripe ON donations(stripe_customer_id);

-- Blog Posts
CREATE INDEX idx_posts_category ON blog_posts(category_id);
CREATE INDEX idx_posts_status ON blog_posts(status);
CREATE INDEX idx_posts_slug ON blog_posts(slug);
CREATE INDEX idx_posts_published ON blog_posts(published_at DESC);

-- Travis Conversations
CREATE INDEX idx_travis_participant ON travis_conversations(participant_id);
CREATE INDEX idx_travis_created ON travis_conversations(created_at DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_msp_clients_updated_at BEFORE UPDATE ON msp_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workforce_updated_at BEFORE UPDATE ON workforce FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendees_updated_at BEFORE UPDATE ON event_attendees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Blog categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
  ('Fatherhood', 'fatherhood', 'Stories, advice, and resources for fathers on their journey', 1),
  ('Tech Careers', 'tech-careers', 'IT career tips, certifications, and industry insights', 2),
  ('Family', 'family', 'Building stronger families and creating lasting memories', 3),
  ('IT for Nonprofits', 'it-for-nonprofits', 'Technology solutions and best practices for nonprofit organizations', 4),
  ('Community', 'community', 'Community events, partnerships, and local impact stories', 5),
  ('AI & Innovation', 'ai-innovation', 'Exploring AI, emerging tech, and digital transformation', 6);
