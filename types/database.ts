// Forever Forward Foundation - Database Types
// Auto-generated based on Supabase schema

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole =
  | "super_admin"
  | "case_worker"
  | "sales_lead"
  | "technician"
  | "event_coordinator";

export type LeadType =
  | "program"
  | "msp"
  | "volunteer"
  | "partner"
  | "donation"
  | "general";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export type ProgramType =
  | "father_forward"
  | "tech_ready_youth"
  | "making_moments"
  | "from_script_to_screen"
  | "stories_from_my_future"
  | "lula";

export type ParticipantStatus =
  | "applicant"
  | "enrolled"
  | "active"
  | "on_hold"
  | "completed"
  | "withdrawn";

export type PipelineStage =
  | "new_lead"
  | "discovery"
  | "assessment"
  | "proposal"
  | "negotiation"
  | "contract"
  | "onboarding"
  | "active"
  | "churned";

export type DocumentType =
  | "proposal"
  | "contract"
  | "certificate"
  | "assessment"
  | "qbr_report"
  | "invoice"
  | "other";

export type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "expired";

export type EmailStatus =
  | "draft"
  | "scheduled"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed";

export type EventType =
  | "movies_on_the_menu"
  | "workshop"
  | "graduation"
  | "community"
  | "fundraiser"
  | "other";

export type DonationFrequency =
  | "one_time"
  | "monthly"
  | "quarterly"
  | "annual";

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "uncollectible"
  | "void"
  | "failed";

export type InvoiceType =
  | "one-time"
  | "recurring";

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  title: string | null;
  lead_type: LeadType;
  status: LeadStatus;
  priority_score: number | null;
  program_interest: ProgramType | null;
  service_interests: string[] | null;
  estimated_value: number | null;
  source: string | null;
  referral_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ai_classification: Record<string, unknown> | null;
  assigned_to: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  converted_at: string | null;
}

export interface Cohort {
  id: string;
  name: string;
  program: ProgramType;
  start_date: string;
  end_date: string | null;
  max_participants: number | null;
  total_weeks: number | null;
  primary_instructor: string | null;
  case_worker: string | null;
  is_active: boolean;
  is_accepting_applications: boolean;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  lead_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  program: ProgramType;
  cohort_id: string | null;
  status: ParticipantStatus;
  current_week: number | null;
  progress_percentage: number | null;
  employment_status: string | null;
  it_experience_level: string | null;
  parent_guardian_name: string | null;
  parent_guardian_phone: string | null;
  parent_guardian_email: string | null;
  school_name: string | null;
  grade_level: string | null;
  goals: string | null;
  barriers: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  path_forward_plan: Record<string, unknown> | null;
  assigned_case_worker: string | null;
  google_it_cert_status: string | null;
  google_it_cert_date: string | null;
  travis_conversation_summary: string | null;
  travis_last_interaction: string | null;
  travis_escalation_flags: string[] | null;
  how_did_you_hear: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  enrolled_at: string | null;
  completed_at: string | null;
}

// IT Assessment Support Types
export type SupportType = "ongoing" | "project" | "both" | "none";
export type DecisionTimeline = "immediately" | "1-2_weeks" | "1_month" | "3_months_plus" | "just_exploring";
export type BudgetRange = "under_500" | "500_1000" | "1000_2500" | "2500_5000" | "5000_plus" | "not_sure";

// Structured IT Assessment Data (stored as JSONB)
export interface ITAssessmentData {
  // Step 1: Contact & Organization
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  userCount: number;

  // Step 2: Current IT Situation
  hasItSupport: boolean;
  currentItProvider?: string;
  currentItSpendMonthly?: number;
  supportType?: SupportType;
  hasItStaff: boolean;
  itStaffCount?: number;
  deviceCount?: number;
  serverCount?: number;
  cloudServices: string[];

  // Step 3: Challenges & Priorities
  painPoints: string[];
  topPriorities: string[];
  biggestChallenge?: string;
  idealOutcome?: string;

  // Step 4: Next Steps
  servicesInterested: string[];
  decisionTimeline: DecisionTimeline;
  budgetRange: BudgetRange;
  additionalNotes?: string;

  // Metadata
  submittedAt: string;
  formVersion: string;
}

export interface MspClient {
  id: string;
  lead_id: string | null;
  organization_name: string;
  organization_type: string | null;
  website: string | null;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string | null;
  primary_contact_title: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  pipeline_stage: PipelineStage;
  days_in_stage: number | null;
  stage_entered_at: string | null;
  service_package: string | null;
  services: string[] | null;
  user_count: number | null;
  monthly_value: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  stripe_customer_id: string | null;
  payment_status: string | null;
  account_manager: string | null;
  assigned_technicians: string[] | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;

  // Assessment tracking
  assessment_completed_at: string | null;
  assessment_data: ITAssessmentData | null;

  // Current IT situation
  current_it_spend_monthly: number | null;
  current_it_provider: string | null;
  support_type: SupportType | null;
  has_it_staff: boolean | null;
  it_staff_count: number | null;

  // Technology inventory
  device_count: number | null;
  server_count: number | null;
  cloud_services: string[] | null;
  current_tools: string[] | null;

  // Challenges & priorities
  pain_points: string[] | null;
  top_priorities: string[] | null;
  biggest_challenge: string | null;
  ideal_outcome: string | null;

  // Decision context
  decision_timeline: DecisionTimeline | null;
  budget_range: BudgetRange | null;
  services_interested: string[] | null;
}

export interface Document {
  id: string;
  title: string;
  document_type: DocumentType;
  status: DocumentStatus;
  content: string | null;
  file_url: string | null;
  participant_id: string | null;
  client_id: string | null;
  ai_generated: boolean | null;
  ai_prompt_used: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  recipient_email: string;
  recipient_name: string | null;
  recipient_type: string | null;
  recipient_id: string | null;
  subject: string;
  body: string;
  status: EmailStatus;
  ai_generated: boolean | null;
  ai_prompt_used: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  sequence_id: string | null;
  sequence_position: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  activity_type: string;
  description: string;
  lead_id: string | null;
  participant_id: string | null;
  client_id: string | null;
  metadata: Record<string, unknown> | null;
  performed_by: string | null;
  created_at: string;
}

export interface Workforce {
  id: string;
  participant_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  certifications: string[] | null;
  skills: string[] | null;
  experience_level: string | null;
  availability_status: string;
  available_hours_per_week: number | null;
  preferred_schedule: string | null;
  average_rating: number | null;
  total_hours_worked: number | null;
  assignments_completed: number | null;
  bio: string | null;
  resume_url: string | null;
  photo_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  workforce_id: string;
  client_id: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  hours_per_week: number | null;
  hourly_rate: number | null;
  status: string;
  total_hours_logged: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  event_type: EventType;
  description: string | null;
  short_description: string | null;
  start_datetime: string;
  end_datetime: string | null;
  timezone: string | null;
  venue_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  is_virtual: boolean | null;
  virtual_link: string | null;
  capacity: number | null;
  ticket_price: number | null;
  tickets_sold: number | null;
  is_free: boolean | null;
  movie_title: string | null;
  movie_description: string | null;
  food_pairing: string | null;
  featured_image_url: string | null;
  gallery_urls: string[] | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  is_cancelled: boolean | null;
  coordinator_id: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partial_refund";

export interface EventAttendee {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  ticket_quantity: number | null;
  ticket_type: string | null;
  total_paid: number | null;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus | null;
  payment_method: string | null;
  payment_date: string | null;
  payment_notes: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
  refunded_at: string | null;
  checked_in: boolean | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  qr_code_token: string | null;
  dietary_restrictions: string | null;
  accessibility_needs: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventTicketType {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
  quantity_available: number | null;
  quantity_sold: number;
  max_per_order: number;
  is_active: boolean;
  sort_order: number;
  stripe_price_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type AddonCategory = "food" | "merchandise" | "upgrade" | "other";

export interface EventAddon {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  category?: AddonCategory | null;
  price: number;
  quantity_available: number | null;
  quantity_sold: number;
  max_per_order: number;
  is_active: boolean;
  sort_order: number;
  applicable_ticket_types?: string[] | null;
  stripe_price_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItemType = "ticket" | "addon";

export interface EventOrderItem {
  id: string;
  attendee_id: string;
  item_type: OrderItemType;
  ticket_type_id: string | null;
  addon_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  description: string | null;
  services_offered: string[] | null;
  eligibility_requirements: string | null;
  hours_of_operation: string | null;
  notes: string | null;
  tags: string[] | null;
  is_active: boolean | null;
  is_verified: boolean | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_first_name: string;
  donor_last_name: string;
  donor_email: string;
  donor_phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  amount: number;
  frequency: DonationFrequency;
  designation: string | null;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  payment_status: string;
  acknowledgment_sent: boolean | null;
  acknowledgment_sent_at: string | null;
  campaign: string | null;
  source: string | null;
  is_anonymous: boolean | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string | null;
  stripe_invoice_id: string;
  stripe_customer_id: string | null;
  number: string | null;
  amount: number;
  status: InvoiceStatus;
  invoice_type: InvoiceType | null;
  description: string | null;
  due_date: string | null;
  sent_at: string | null;
  paid_at: string | null;
  stripe_payment_intent_id: string | null;
  hosted_invoice_url: string | null;
  pdf_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Checkin {
  id: string;
  participant_id: string;
  case_worker_id: string;
  checkin_type: string;
  notes: string;
  mood_rating: number | null;
  engagement_rating: number | null;
  goals_discussed: string[] | null;
  barriers_identified: string[] | null;
  action_items: string[] | null;
  follow_up_needed: boolean | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: string | null;
  author_id: string | null;
  author_name: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  ai_generated: boolean | null;
  ai_prompt_used: string | null;
  views: number | null;
  status: string;
  published_at: string | null;
  scheduled_for: string | null;
  read_time_minutes: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  interests: string[] | null;
  is_active: boolean | null;
  confirmed: boolean | null;
  confirmed_at: string | null;
  source: string | null;
  unsubscribed_at: string | null;
  unsubscribe_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface TravisConversation {
  id: string;
  participant_id: string;
  role: string;
  content: string;
  model_used: string | null;
  tokens_used: number | null;
  escalation_triggered: boolean | null;
  escalation_reason: string | null;
  created_at: string;
}

// ============================================================================
// INSERT/UPDATE TYPES
// ============================================================================

export type UserInsert = Omit<User, "created_at" | "updated_at">;
export type UserUpdate = Partial<UserInsert>;

export type LeadInsert = Omit<Lead, "id" | "created_at" | "updated_at">;
export type LeadUpdate = Partial<LeadInsert>;

export type CohortInsert = Omit<Cohort, "id" | "created_at" | "updated_at">;
export type CohortUpdate = Partial<CohortInsert>;

export type ParticipantInsert = Omit<Participant, "id" | "created_at" | "updated_at">;
export type ParticipantUpdate = Partial<ParticipantInsert>;

export type MspClientInsert = Omit<MspClient, "id" | "created_at" | "updated_at">;
export type MspClientUpdate = Partial<MspClientInsert>;

export type DocumentInsert = Omit<Document, "id" | "created_at" | "updated_at">;
export type DocumentUpdate = Partial<DocumentInsert>;

export type EmailInsert = Omit<Email, "id" | "created_at" | "updated_at">;
export type EmailUpdate = Partial<EmailInsert>;

export type ActivityInsert = Omit<Activity, "id" | "created_at">;

export type WorkforceInsert = Omit<Workforce, "id" | "created_at" | "updated_at">;
export type WorkforceUpdate = Partial<WorkforceInsert>;

export type AssignmentInsert = Omit<Assignment, "id" | "created_at" | "updated_at">;
export type AssignmentUpdate = Partial<AssignmentInsert>;

export type EventInsert = Omit<Event, "id" | "created_at" | "updated_at">;
export type EventUpdate = Partial<EventInsert>;

export type EventAttendeeInsert = Omit<EventAttendee, "id" | "created_at" | "updated_at">;
export type EventAttendeeUpdate = Partial<EventAttendeeInsert>;

export type EventTicketTypeInsert = Omit<EventTicketType, "id" | "created_at" | "updated_at">;
export type EventTicketTypeUpdate = Partial<EventTicketTypeInsert>;

export type EventAddonInsert = Omit<EventAddon, "id" | "created_at" | "updated_at">;
export type EventAddonUpdate = Partial<EventAddonInsert>;

export type EventOrderItemInsert = Omit<EventOrderItem, "id" | "created_at">;

export type ResourceInsert = Omit<Resource, "id" | "created_at" | "updated_at">;
export type ResourceUpdate = Partial<ResourceInsert>;

export type DonationInsert = Omit<Donation, "id" | "created_at" | "updated_at">;
export type DonationUpdate = Partial<DonationInsert>;

export type InvoiceInsert = Omit<Invoice, "id" | "created_at" | "updated_at">;
export type InvoiceUpdate = Partial<InvoiceInsert>;

export type CheckinInsert = Omit<Checkin, "id" | "created_at">;

export type BlogCategoryInsert = Omit<BlogCategory, "id" | "created_at" | "updated_at">;
export type BlogCategoryUpdate = Partial<BlogCategoryInsert>;

export type BlogPostInsert = Omit<BlogPost, "id" | "created_at" | "updated_at">;
export type BlogPostUpdate = Partial<BlogPostInsert>;

export type NewsletterSubscriberInsert = Omit<NewsletterSubscriber, "id" | "created_at" | "updated_at">;
export type NewsletterSubscriberUpdate = Partial<NewsletterSubscriberInsert>;

export type TravisConversationInsert = Omit<TravisConversation, "id" | "created_at">;

// ============================================================================
// DATABASE SCHEMA TYPE (for Supabase client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
      cohorts: {
        Row: Cohort;
        Insert: CohortInsert;
        Update: CohortUpdate;
      };
      participants: {
        Row: Participant;
        Insert: ParticipantInsert;
        Update: ParticipantUpdate;
      };
      msp_clients: {
        Row: MspClient;
        Insert: MspClientInsert;
        Update: MspClientUpdate;
      };
      documents: {
        Row: Document;
        Insert: DocumentInsert;
        Update: DocumentUpdate;
      };
      emails: {
        Row: Email;
        Insert: EmailInsert;
        Update: EmailUpdate;
      };
      activities: {
        Row: Activity;
        Insert: ActivityInsert;
        Update: never;
      };
      workforce: {
        Row: Workforce;
        Insert: WorkforceInsert;
        Update: WorkforceUpdate;
      };
      assignments: {
        Row: Assignment;
        Insert: AssignmentInsert;
        Update: AssignmentUpdate;
      };
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: EventUpdate;
      };
      event_attendees: {
        Row: EventAttendee;
        Insert: EventAttendeeInsert;
        Update: EventAttendeeUpdate;
      };
      event_ticket_types: {
        Row: EventTicketType;
        Insert: EventTicketTypeInsert;
        Update: EventTicketTypeUpdate;
      };
      event_addons: {
        Row: EventAddon;
        Insert: EventAddonInsert;
        Update: EventAddonUpdate;
      };
      event_order_items: {
        Row: EventOrderItem;
        Insert: EventOrderItemInsert;
        Update: never;
      };
      resources: {
        Row: Resource;
        Insert: ResourceInsert;
        Update: ResourceUpdate;
      };
      donations: {
        Row: Donation;
        Insert: DonationInsert;
        Update: DonationUpdate;
      };
      invoices: {
        Row: Invoice;
        Insert: InvoiceInsert;
        Update: InvoiceUpdate;
      };
      checkins: {
        Row: Checkin;
        Insert: CheckinInsert;
        Update: never;
      };
      blog_categories: {
        Row: BlogCategory;
        Insert: BlogCategoryInsert;
        Update: BlogCategoryUpdate;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: BlogPostUpdate;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: NewsletterSubscriberInsert;
        Update: NewsletterSubscriberUpdate;
      };
      travis_conversations: {
        Row: TravisConversation;
        Insert: TravisConversationInsert;
        Update: never;
      };
    };
    Enums: {
      user_role: UserRole;
      lead_type: LeadType;
      lead_status: LeadStatus;
      program_type: ProgramType;
      participant_status: ParticipantStatus;
      pipeline_stage: PipelineStage;
      document_type: DocumentType;
      document_status: DocumentStatus;
      email_status: EmailStatus;
      event_type: EventType;
      donation_frequency: DonationFrequency;
      invoice_status: InvoiceStatus;
      invoice_type: InvoiceType;
    };
  };
}
