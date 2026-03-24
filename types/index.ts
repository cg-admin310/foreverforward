// Forever Forward Platform Types

export type UserRole =
  | "super_admin"
  | "case_worker"
  | "sales_lead"
  | "technician"
  | "event_coordinator";

export type LeadType =
  | "program"
  | "msp"
  | "event"
  | "volunteer"
  | "partner"
  | "donor";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export type ParticipantStatus =
  | "applicant"
  | "under_review"
  | "enrolled"
  | "active"
  | "graduate"
  | "alumni"
  | "workforce";

export type PipelineStage =
  | "new_lead"
  | "discovery"
  | "assessment"
  | "proposal"
  | "negotiation"
  | "contract"
  | "onboarding"
  | "active";

export type DocumentType =
  | "proposal"
  | "contract"
  | "certificate"
  | "onboarding"
  | "qbr"
  | "assessment";

export type DocumentStatus = "draft" | "sent" | "signed" | "expired";

export type EventType =
  | "movies_on_menu"
  | "workshop"
  | "orientation"
  | "community"
  | "job_fair";

export type ResourceCategory =
  | "housing"
  | "legal"
  | "financial"
  | "mental_health"
  | "childcare"
  | "employment"
  | "education";

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  lead_type: LeadType;
  program_interest?: string;
  service_interests?: string[];
  status: LeadStatus;
  priority_score?: number;
  source_page?: string;
  utm_source?: string;
  utm_campaign?: string;
  assigned_to?: string;
  ai_classification?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  user_id?: string;
  lead_id?: string;
  program: string;
  cohort_id?: string;
  status: ParticipantStatus;
  current_week: number;
  path_forward_plan?: PathForwardPlan;
  progress_data?: ProgressData;
  certifications?: Certification[];
  barriers?: Barrier[];
  emergency_contact?: EmergencyContact;
  created_at: string;
  updated_at: string;
}

export interface PathForwardPlan {
  goals: string[];
  milestones: Milestone[];
  study_schedule: string;
  resources: string[];
}

export interface Milestone {
  week: number;
  title: string;
  description: string;
  completed: boolean;
  completed_at?: string;
}

export interface ProgressData {
  coursework_completion: number;
  attendance_rate: number;
  assessment_scores: number[];
  engagement_score: number;
}

export interface Certification {
  name: string;
  status: "preparing" | "scheduled" | "passed" | "retry";
  scheduled_date?: string;
  passed_date?: string;
}

export interface Barrier {
  type: string;
  description: string;
  status: "identified" | "addressing" | "resolved";
  resolution?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Cohort {
  id: string;
  name: string;
  program: string;
  start_date: string;
  end_date: string;
  assigned_case_workers?: string[];
  max_participants: number;
  status: "upcoming" | "active" | "completed";
  created_at: string;
}

export interface MSPClient {
  id: string;
  lead_id?: string;
  organization_name: string;
  organization_type?: string;
  address?: string;
  website?: string;
  employee_count?: number;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  pipeline_stage: PipelineStage;
  services?: string[];
  monthly_value?: number;
  contract_start?: string;
  contract_end?: string;
  stripe_customer_id?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  content?: string;
  file_url?: string;
  related_type?: "participant" | "client" | "lead";
  related_id?: string;
  version: number;
  status: DocumentStatus;
  created_by?: string;
  created_at: string;
}

export interface Email {
  id: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  body: string;
  status: "draft" | "scheduled" | "sent" | "failed" | "bounced";
  sequence_id?: string;
  sequence_step?: number;
  related_type?: string;
  related_id?: string;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  created_by?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  activity_type: string;
  description?: string;
  related_type?: string;
  related_id?: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Workforce {
  id: string;
  participant_id?: string;
  user_id?: string;
  certifications?: string[];
  skills?: string[];
  availability: "full_time" | "part_time" | "project";
  hourly_rate?: number;
  location?: string;
  status: "available" | "assigned" | "unavailable";
  created_at: string;
}

export interface Assignment {
  id: string;
  workforce_id: string;
  client_id: string;
  start_date?: string;
  end_date?: string;
  hours_logged: number;
  status: string;
  notes?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: EventType;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  capacity?: number;
  ticket_price?: number;
  stripe_product_id?: string;
  image_url?: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  eligibility?: string;
  notes?: string;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  frequency: "one_time" | "monthly" | "annual";
  stripe_payment_id?: string;
  stripe_subscription_id?: string;
  campaign?: string;
  status: string;
  receipt_sent: boolean;
  created_at: string;
}

export interface CheckIn {
  id: string;
  participant_id: string;
  case_worker_id: string;
  week_number: number;
  notes?: string;
  progress_rating?: number;
  barriers_identified?: string[];
  actions_taken?: string[];
  next_steps?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id?: string;
  tags?: string[];
  author_id?: string;
  status: "draft" | "published" | "archived";
  seo_title?: string;
  seo_description?: string;
  views: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  source?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// AI Types
export interface LeadClassification {
  lead_type: LeadType;
  program_interest?: string;
  service_interests?: string[];
  priority_score: number;
  reasoning: string;
}

export interface GeneratedDocument {
  content: string;
  metadata: Record<string, unknown>;
}

export interface TravisResponse {
  message: string;
  should_escalate: boolean;
  suggested_resources?: Resource[];
}

export interface GeneratedBlogPost {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  image_description: string;
}
