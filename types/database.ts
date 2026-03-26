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

export type BillingEventType =
  | "created"
  | "sent"
  | "viewed"
  | "paid"
  | "reminder_sent"
  | "voided"
  | "edited"
  | "recurring_enabled"
  | "recurring_disabled"
  | "portal_accessed";

export type RevenueSource =
  | "billing"
  | "donations"
  | "events";

// ============================================================================
// DONOR & IMPACT TYPES
// ============================================================================

export type DonorTier = "founding" | "champion" | "supporter" | "friend";

export type DonorCommunicationType =
  | "thank_you"
  | "impact_update"
  | "quarterly_report"
  | "annual_report"
  | "milestone"
  | "event_invite"
  | "tier_upgrade"
  | "receipt"
  | "general";

export type CommunicationChannel = "email" | "sms" | "mail" | "phone";

export type CommunicationStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed";

export type ImpactMetricType =
  | "program"
  | "service"
  | "event"
  | "community"
  | "financial";

export type MetricPeriodType =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "all_time";

// ============================================================================
// EVENT CHECK-IN TYPES
// ============================================================================

export type CheckInMethod = "qr_scan" | "manual" | "pre_registered" | "walk_up";

export type CheckInLogAction =
  | "check_in"
  | "check_out"
  | "guest_check_in"
  | "guest_check_out"
  | "badge_print"
  | "table_assign"
  | "walk_up_register"
  | "payment_received"
  | "vip_upgrade"
  | "note_added"
  | "refund_issued";

export type RegistrationSource =
  | "website"
  | "admin"
  | "walk_up"
  | "import"
  | "comp";

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
  ai_classification: AILeadClassification | null;
  assigned_to: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  converted_at: string | null;

  // Assessment fields (added in migration 012)
  assessment_data: ProgramAssessmentData | EnhancedITAssessmentData | null;
  assessment_completed_at: string | null;
  fit_score: number | null;
  recommended_programs: ProgramType[] | null;
  barriers: BarrierType[] | null;
  support_needs: SupportNeedType[] | null;
  readiness_level: ReadinessLevel | null;

  // Enhanced IT assessment fields
  compliance_requirements: ComplianceRequirement[] | null;
  disaster_recovery_status: DisasterRecoveryStatus | null;
  growth_projection_users: number | null;
  office_count: number | null;
  remote_worker_percent: number | null;
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

// ============================================================================
// PROGRAM ASSESSMENT TYPES
// ============================================================================

export type EmploymentStatus =
  | "employed_full"
  | "employed_part"
  | "unemployed_looking"
  | "unemployed_not"
  | "self_employed"
  | "student"
  | "retired"
  | "disabled";

export type IncomeRange =
  | "under_1000"
  | "1000_2500"
  | "2500_5000"
  | "5000_plus"
  | "prefer_not_say";

export type EducationLevel =
  | "less_than_high_school"
  | "high_school_ged"
  | "some_college"
  | "associates"
  | "bachelors"
  | "masters_plus";

export type SchedulePreference =
  | "weekday_morning"
  | "weekday_afternoon"
  | "weekday_evening"
  | "weekend"
  | "flexible";

export type ITExperienceLevel =
  | "none"
  | "basic"
  | "intermediate"
  | "advanced";

export type PrimaryGoal =
  | "career_change"
  | "certification"
  | "skills_upgrade"
  | "employment"
  | "personal_growth"
  | "help_family"
  | "creative_expression";

export type ReadinessLevel = "high" | "medium" | "low";

export type BarrierType =
  | "transportation"
  | "childcare"
  | "housing"
  | "legal"
  | "health"
  | "financial"
  | "time"
  | "language"
  | "technology_access"
  | "other";

export type SupportNeedType =
  | "job_training"
  | "certification"
  | "mentorship"
  | "career_counseling"
  | "resume_help"
  | "interview_prep"
  | "childcare_assistance"
  | "transportation_assistance"
  | "housing_resources"
  | "legal_aid"
  | "mental_health"
  | "financial_literacy";

export type ComplianceRequirement =
  | "hipaa"
  | "ferpa"
  | "pci_dss"
  | "soc2"
  | "none";

export type DisasterRecoveryStatus = "has_plan" | "no_plan" | "partial";

// Program Assessment Data Interface (stored as JSONB in leads.assessment_data)
export interface ProgramAssessmentData {
  // Step 1: About You
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isFather: boolean;
  numberOfChildren?: number;
  childrenAges?: string[];

  // Step 2: Current Situation
  currentEmploymentStatus: EmploymentStatus;
  monthlyIncomeRange?: IncomeRange;
  highestEducation: EducationLevel;
  barriers: BarrierType[];
  otherBarrier?: string;

  // Step 3: Tech Background
  itExperienceLevel: ITExperienceLevel;
  hasComputer: boolean;
  hasInternet: boolean;
  techInterests: string[];

  // Step 4: Goals & Schedule
  primaryGoal: PrimaryGoal;
  sixMonthVision?: string;
  whatBroughtYouHere?: string;
  preferredSchedule: SchedulePreference;
  hasReliableTransportation: boolean;
  hasChildcareNeeds: boolean;

  // Step 5: Youth Information (conditional)
  isMinor: boolean;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  parentGuardianEmail?: string;
  schoolName?: string;
  gradeLevel?: string;

  // Metadata
  submittedAt: string;
  formVersion: string;
}

// Enhanced IT Assessment Data Interface (extends existing with compliance fields)
export interface EnhancedITAssessmentData extends ITAssessmentData {
  // New fields for enhanced assessment
  complianceRequirements: ComplianceRequirement[];
  disasterRecoveryStatus: DisasterRecoveryStatus;
  currentBackupSolution?: string;
  growthProjectionUsers?: number;
  officeCount?: number;
  remoteWorkerPercent?: number;
  stakeholderConcerns?: string[];
}

// AI Lead Classification Interface
export interface AILeadClassification {
  // Core classification
  lead_type: LeadType;
  program_interest?: ProgramType;
  service_interests?: string[];

  // Scoring
  priority_score: number; // 1-100
  urgency_level: "low" | "medium" | "high" | "critical";
  fit_score?: number; // 0-100, how well they fit the recommended program/service

  // For Program leads
  recommended_programs?: ProgramType[];
  program_reasoning?: string;
  barriers_identified?: BarrierType[];
  support_needs?: SupportNeedType[];
  readiness_level?: ReadinessLevel;

  // For MSP leads
  estimated_value?: number;
  recommended_package?: "foundation" | "growth" | "enterprise" | "custom";
  pain_points?: string[];
  infrastructure_summary?: {
    users?: number;
    devices?: number;
    servers?: number;
    locations?: number;
    compliance_needs?: ComplianceRequirement[];
  };

  // Metadata
  classified_at: string;
  model_used: string;
  confidence: number; // 0-1
  reasoning: string;
}

// Program Recommendation from AI
export interface ProgramRecommendation {
  program: ProgramType;
  fitScore: number; // 0-100
  reasoning: string;
  matchingCriteria: string[];
}

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

  // Recurring billing configuration
  billing_enabled: boolean | null;
  billing_day_of_month: number | null;
  auto_invoice_enabled: boolean | null;
  stripe_subscription_id: string | null;
  last_invoice_generated_at: string | null;

  // Enhanced IT assessment fields (added in migration 012)
  compliance_requirements: ComplianceRequirement[] | null;
  disaster_recovery_status: DisasterRecoveryStatus | null;
  growth_projection_users: number | null;
  office_count: number | null;
  remote_worker_percent: number | null;
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

  // Enhanced check-in fields (migration 014)
  check_in_method: CheckInMethod | null;
  check_in_notes: string | null;
  checked_in_by: string | null;
  guests_count: number | null;
  guests_checked_in: number | null;
  guest_names: string[] | null;
  party_size: number | null;
  table_number: string | null;
  seat_assignment: string | null;
  is_vip: boolean | null;
  is_donor: boolean | null;
  is_walk_up: boolean | null;
  is_sponsor: boolean | null;
  badge_printed: boolean | null;
  badge_printed_at: string | null;
  opt_in_communications: boolean | null;
  registration_source: RegistrationSource | null;
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

// ============================================================================
// DONOR & IMPACT ENTITIES (Migration 013)
// ============================================================================

export interface DonorProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  tier: DonorTier;
  total_given: number;
  ytd_given: number;
  first_donation_at: string | null;
  last_donation_at: string | null;
  donation_count: number;
  average_donation: number;
  largest_donation: number;
  is_recurring: boolean;
  recurring_amount: number | null;
  recurring_frequency: string | null;
  recurring_since: string | null;
  stripe_customer_id: string | null;
  communication_preferences: DonorCommunicationPreferences | null;
  preferred_contact_method: string | null;
  is_corporate: boolean;
  company_name: string | null;
  company_contact_title: string | null;
  notes: string | null;
  tags: string[] | null;
  assigned_to: string | null;
  last_contact_at: string | null;
  next_contact_date: string | null;
  events_attended: number;
  volunteer_hours: number;
  referrals_made: number;
  created_at: string;
  updated_at: string;
}

export interface DonorCommunication {
  id: string;
  donor_profile_id: string | null;
  donation_id: string | null;
  type: DonorCommunicationType;
  subject: string | null;
  content: string | null;
  template_used: string | null;
  channel: CommunicationChannel;
  status: CommunicationStatus;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  email_id: string | null;
  sent_by: string | null;
  created_at: string;
}

export interface ImpactMetric {
  id: string;
  metric_type: ImpactMetricType;
  metric_name: string;
  metric_value: number;
  metric_unit: string | null;
  period_type: MetricPeriodType;
  period_start: string | null;
  period_end: string | null;
  program_id: string | null;
  event_id: string | null;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DonationAllocation {
  id: string;
  period_start: string;
  period_end: string;
  programs_percent: number;
  operations_percent: number;
  events_percent: number;
  admin_percent: number;
  total_donations: number;
  programs_amount: number;
  operations_amount: number;
  events_amount: number;
  admin_amount: number;
  program_allocations: Record<string, number> | null;
  notes: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EVENT CHECK-IN ENTITIES (Migration 014)
// ============================================================================

export interface EventCheckinLog {
  id: string;
  event_id: string;
  attendee_id: string | null;
  action: CheckInLogAction;
  method: string | null;
  performed_by: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface EventAnalytics {
  id: string;
  event_id: string;
  total_registered: number;
  total_tickets: number;
  total_guests: number;
  total_checked_in: number;
  guests_checked_in: number;
  total_walk_ups: number;
  no_shows: number;
  peak_attendance: number;
  peak_time: string | null;
  first_check_in_at: string | null;
  last_check_in_at: string | null;
  avg_arrival_minutes: number | null;
  revenue_tickets: number;
  revenue_addons: number;
  revenue_donations: number;
  revenue_walk_ups: number;
  total_revenue: number;
  refunds_issued: number;
  refunds_amount: number;
  vip_attendees: number;
  donor_attendees: number;
  sponsor_attendees: number;
  badge_prints: number;
  table_assignments: number;
  feedback_submissions: number;
  feedback_avg_rating: number | null;
  feedback_nps_score: number | null;
  attendance_rate: number | null;
  growth_vs_last: number | null;
  created_at: string;
  updated_at: string;
}

export interface EventTable {
  id: string;
  event_id: string;
  table_number: string;
  table_name: string | null;
  capacity: number;
  seats_filled: number;
  section: string | null;
  location_notes: string | null;
  is_vip: boolean;
  is_reserved: boolean;
  reserved_for: string | null;
  is_full: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFeedback {
  id: string;
  event_id: string;
  attendee_id: string | null;
  is_anonymous: boolean;
  submitted_email: string | null;
  overall_rating: number | null;
  venue_rating: number | null;
  food_rating: number | null;
  content_rating: number | null;
  organization_rating: number | null;
  would_recommend: number | null;
  what_went_well: string | null;
  what_could_improve: string | null;
  additional_comments: string | null;
  would_attend_again: boolean | null;
  created_at: string;
}

// Live event stats view type
export interface EventLiveStats {
  event_id: string;
  title: string;
  start_datetime: string;
  capacity: number | null;
  total_registered: number;
  total_tickets: number;
  total_guests: number;
  checked_in_count: number;
  guests_checked_in: number;
  walk_ups: number;
  vip_count: number;
  donor_count: number;
  check_in_rate: number | null;
  total_revenue: number;
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

  // Enhanced fields (migration 013)
  allocation: DonationAllocationBreakdown | null;
  impact_tags: string[] | null;
  impact_report_sent: boolean | null;
  impact_report_sent_at: string | null;
  donor_tier: DonorTier | null;
  communication_preferences: DonorCommunicationPreferences | null;
  is_corporate: boolean | null;
  company_name: string | null;
  company_match_eligible: boolean | null;
  matched_amount: number | null;
  tax_receipt_sent: boolean | null;
  tax_receipt_sent_at: string | null;
  tax_receipt_number: string | null;
}

// Donation allocation breakdown (stored as JSONB)
export interface DonationAllocationBreakdown {
  programs?: number; // Percentage
  operations?: number;
  events?: number;
  admin?: number;
}

// Donor communication preferences (stored as JSONB)
export interface DonorCommunicationPreferences {
  email_updates?: boolean;
  quarterly_reports?: boolean;
  event_invites?: boolean;
  annual_report?: boolean;
}

// Line item for invoice breakdown
export interface InvoiceLineItem {
  id?: string;
  description: string;
  amount: number;
  quantity?: number;
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

  // Enhanced billing fields
  line_items: InvoiceLineItem[] | null;
  reminder_sent_at: string | null;
  reminder_count: number | null;
  notes: string | null;
  internal_notes: string | null;
}

// Revenue history for accurate historical charts
export interface RevenueHistory {
  id: string;
  source: RevenueSource;
  month_year: string; // '2026-03' format
  total_amount: number;
  collected_amount: number;
  outstanding_amount: number;
  record_count: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// Billing events audit log
export interface BillingEvent {
  id: string;
  invoice_id: string | null;
  client_id: string | null;
  event_type: BillingEventType;
  description: string | null;
  metadata: Record<string, unknown> | null;
  performed_by: string | null;
  created_at: string;
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

export type MspClientInsert = Omit<MspClient, "id" | "created_at" | "updated_at" | "billing_enabled" | "billing_day_of_month" | "auto_invoice_enabled" | "stripe_subscription_id" | "last_invoice_generated_at"> & {
  billing_enabled?: boolean | null;
  billing_day_of_month?: number | null;
  auto_invoice_enabled?: boolean | null;
  stripe_subscription_id?: string | null;
  last_invoice_generated_at?: string | null;
};
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

// DonationInsert - enhanced fields are optional (have database defaults)
export type DonationInsert = Omit<Donation, "id" | "created_at" | "updated_at" | "allocation" | "impact_tags" | "impact_report_sent" | "impact_report_sent_at" | "donor_tier" | "communication_preferences" | "is_corporate" | "company_name" | "company_match_eligible" | "matched_amount" | "tax_receipt_sent" | "tax_receipt_sent_at" | "tax_receipt_number"> & {
  // Optional enhanced fields
  allocation?: DonationAllocationBreakdown | null;
  impact_tags?: string[] | null;
  impact_report_sent?: boolean | null;
  impact_report_sent_at?: string | null;
  donor_tier?: DonorTier | null;
  communication_preferences?: DonorCommunicationPreferences | null;
  is_corporate?: boolean | null;
  company_name?: string | null;
  company_match_eligible?: boolean | null;
  matched_amount?: number | null;
  tax_receipt_sent?: boolean | null;
  tax_receipt_sent_at?: string | null;
  tax_receipt_number?: string | null;
};
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

export type RevenueHistoryInsert = Omit<RevenueHistory, "id" | "created_at" | "updated_at">;
export type RevenueHistoryUpdate = Partial<RevenueHistoryInsert>;

export type BillingEventInsert = Omit<BillingEvent, "id" | "created_at">;

export type InvoiceLineItemInsert = Omit<InvoiceLineItem, "id">;

// Donor & Impact Insert/Update Types
export type DonorProfileInsert = Omit<DonorProfile, "id" | "created_at" | "updated_at">;
export type DonorProfileUpdate = Partial<DonorProfileInsert>;

export type DonorCommunicationInsert = Omit<DonorCommunication, "id" | "created_at">;

export type ImpactMetricInsert = Omit<ImpactMetric, "id" | "created_at" | "updated_at">;
export type ImpactMetricUpdate = Partial<ImpactMetricInsert>;

export type DonationAllocationInsert = Omit<DonationAllocation, "id" | "created_at" | "updated_at">;
export type DonationAllocationUpdate = Partial<DonationAllocationInsert>;

// Event Check-In Insert/Update Types
export type EventCheckinLogInsert = Omit<EventCheckinLog, "id" | "created_at">;

export type EventAnalyticsInsert = Omit<EventAnalytics, "id" | "created_at" | "updated_at">;
export type EventAnalyticsUpdate = Partial<EventAnalyticsInsert>;

export type EventTableInsert = Omit<EventTable, "id" | "created_at" | "updated_at">;
export type EventTableUpdate = Partial<EventTableInsert>;

export type EventFeedbackInsert = Omit<EventFeedback, "id" | "created_at">;

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
      revenue_history: {
        Row: RevenueHistory;
        Insert: RevenueHistoryInsert;
        Update: RevenueHistoryUpdate;
      };
      billing_events: {
        Row: BillingEvent;
        Insert: BillingEventInsert;
        Update: never;
      };
      donor_profiles: {
        Row: DonorProfile;
        Insert: DonorProfileInsert;
        Update: DonorProfileUpdate;
      };
      donor_communications: {
        Row: DonorCommunication;
        Insert: DonorCommunicationInsert;
        Update: never;
      };
      impact_metrics: {
        Row: ImpactMetric;
        Insert: ImpactMetricInsert;
        Update: ImpactMetricUpdate;
      };
      donation_allocations: {
        Row: DonationAllocation;
        Insert: DonationAllocationInsert;
        Update: DonationAllocationUpdate;
      };
      event_checkin_log: {
        Row: EventCheckinLog;
        Insert: EventCheckinLogInsert;
        Update: never;
      };
      event_analytics: {
        Row: EventAnalytics;
        Insert: EventAnalyticsInsert;
        Update: EventAnalyticsUpdate;
      };
      event_tables: {
        Row: EventTable;
        Insert: EventTableInsert;
        Update: EventTableUpdate;
      };
      event_feedback: {
        Row: EventFeedback;
        Insert: EventFeedbackInsert;
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
