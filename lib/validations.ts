import { z } from "zod";

// Common field schemas
export const emailSchema = z.string().email("Please enter a valid email address");
export const phoneSchema = z
  .string()
  .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Please enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters");

// Lead form schema
export const leadFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  organization: z.string().optional(),
  leadType: z.enum(["program", "msp", "event", "volunteer", "partner", "donor"]).optional(),
  programInterest: z.string().optional(),
  serviceInterests: z.array(z.string()).optional(),
  message: z.string().max(1000, "Message must be less than 1000 characters").optional(),
  sourcePage: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Enrollment form schema
export const enrollmentFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  program: z.enum([
    "father-forward",
    "tech-ready-youth",
    "making-moments",
    "from-script-to-screen",
    "stories-from-my-future",
    "lula",
  ]),
  // Father Forward specific
  currentEmployment: z.string().optional(),
  careerGoals: z.string().optional(),
  // Tech-Ready Youth specific
  age: z.number().min(16).optional(),
  // Stories from My Future specific
  childAge: z.number().min(5).max(14).optional(),
  plan: z.enum(["regular", "premium"]).optional(),
  // Common
  howDidYouHear: z.string().optional(),
  additionalInfo: z.string().max(1000).optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;

// Volunteer form schema
export const volunteerFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  availability: z.string().min(10, "Please describe your availability"),
  experience: z.string().optional(),
  motivation: z.string().min(20, "Please tell us why you want to volunteer"),
});

export type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

// Partner form schema
export const partnerFormSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  contactName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  partnershipType: z.enum(["corporate", "nonprofit", "school", "government", "individual"]),
  proposedPartnership: z.string().min(20, "Please describe the proposed partnership"),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;

// IT Assessment form schema
export const itAssessmentFormSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.enum(["nonprofit", "school", "other"]),
  contactName: nameSchema,
  contactTitle: z.string().optional(),
  email: emailSchema,
  phone: phoneSchema,
  employeeCount: z.enum(["1-15", "16-50", "51-100", "100+"]),
  currentItSetup: z.string().optional(),
  painPoints: z.string().min(10, "Please describe your current IT challenges"),
  interestedServices: z.array(z.string()).min(1, "Please select at least one service"),
  budget: z.enum(["under-1000", "1000-5000", "5000-10000", "10000+"]).optional(),
  timeline: z.enum(["immediate", "1-3months", "3-6months", "exploring"]),
});

export type ITAssessmentFormData = z.infer<typeof itAssessmentFormSchema>;

// Donation form schema
export const donationFormSchema = z.object({
  amount: z.number().min(1, "Donation amount must be at least $1"),
  frequency: z.enum(["one_time", "monthly", "annual"]),
  donorName: nameSchema,
  donorEmail: emailSchema,
  donorPhone: phoneSchema,
  isAnonymous: z.boolean().default(false),
  dedicationType: z.enum(["none", "in_honor_of", "in_memory_of"]).optional(),
  dedicationName: z.string().optional(),
  message: z.string().max(500).optional(),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
