// Forever Forward Brand Constants

export const BRAND_COLORS = {
  black: "#1A1A1A",
  blackSoft: "#2D2D2D",
  blackLight: "#444444",
  gold: "#C9A84C",
  goldLight: "#E8D48B",
  goldDark: "#A68A2E",
  goldBg: "#FBF6E9",
  olive: "#5A7247",
  oliveLight: "#7A9A63",
  oliveDark: "#3D5030",
  oliveBg: "#EFF4EB",
  offwhite: "#FAFAF8",
  warm: "#F5F3EF",
  textMedium: "#555555",
  textLight: "#888888",
  border: "#DDDDDD",
} as const;

export const PROGRAMS = [
  {
    slug: "father-forward",
    name: "Father Forward",
    tagline: "Tech. Leadership. Legacy.",
    audience: "fathers" as const,
    duration: "8 weeks",
    format: "Hybrid",
    description:
      "An 8-week intensive program empowering fathers with IT skills, leadership training, and Google IT Certification preparation.",
    icon: "💼",
  },
  {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "Build Your Future in Tech",
    audience: "youth" as const,
    duration: "8 weeks",
    format: "Hybrid",
    description:
      "Prepare for entry-level IT careers with hands-on training, Google IT Support Certificate prep, and a capstone gaming tournament.",
    icon: "🎓",
  },
  {
    slug: "making-moments",
    name: "Making Moments",
    tagline: "Creating Joy, Strengthening Bonds",
    audience: "families" as const,
    duration: "Ongoing",
    format: "In-person",
    description:
      "Community events and experiences designed to strengthen father-child bonds, including our signature Movies on the Menu series.",
    icon: "❤️",
  },
  {
    slug: "from-script-to-screen",
    name: "From Script to Screen",
    tagline: "Tell Your Story",
    audience: "students" as const,
    duration: "Multi-phase",
    format: "Hybrid",
    description:
      "A filmmaking program partnered with Dawnn Lewis, using AI and Unreal Engine to bring student stories to life.",
    icon: "🎬",
  },
  {
    slug: "stories-from-my-future",
    name: "Stories from My Future",
    tagline: "Imagine. Create. Print.",
    audience: "kids" as const,
    duration: "Workshop",
    format: "In-person",
    description:
      "Spark imagination through storytelling, AI design, and 3D printing with Bambu Lab. Kids take home their own creations.",
    icon: "✨",
  },
  {
    slug: "lula",
    name: "LULA",
    tagline: "Level Up Learning Academy",
    audience: "youth" as const,
    duration: "Ongoing",
    format: "Online",
    description:
      "A gamified STEM platform with AI-powered tutoring, interactive lessons, and real-world projects.",
    icon: "🎮",
  },
];

export const SERVICES = [
  {
    slug: "managed-it",
    name: "Managed IT Services",
    tagline: "Enterprise IT. Nonprofit Heart.",
    description:
      "Comprehensive IT support for nonprofits and schools, from help desk to network management.",
    icon: "server",
    startingPrice: "$50/user/month",
  },
  {
    slug: "software-ai",
    name: "Software & AI Development",
    tagline: "Custom Solutions for Impact",
    description:
      "Custom applications, AI chatbots, process automation, and data tools built for mission-driven organizations.",
    icon: "code",
    startingPrice: "$1,500/project",
  },
  {
    slug: "low-voltage",
    name: "Low Voltage & Infrastructure",
    tagline: "Build the Foundation",
    description:
      "Structured cabling, CCTV installation, media walls, and network infrastructure for facilities.",
    icon: "cable",
    startingPrice: "$150/drop",
  },
] as const;

export const CONTACT_INFO = {
  founder: "Thomas TJ Wilform",
  address: "6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047",
  phone: "(951) 877-5196",
  email: "4ever4wardfoundation@gmail.com",
  website: "forever4ward.org",
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/foreverforward",
  facebook: "https://facebook.com/foreverforward",
  linkedin: "https://linkedin.com/company/foreverforward",
  youtube: "https://youtube.com/@foreverforward",
} as const;

// These are our GOALS - what we're working toward
export const IMPACT_GOALS = [
  { label: "Fathers to Train", value: 500, suffix: "+", current: 0 },
  { label: "Events Annually", value: 50, suffix: "+", current: 0 },
  { label: "Nonprofit Clients", value: 25, suffix: "+", current: 0 },
  { label: "Youth to Reach", value: 5000, suffix: "+", current: 0 },
] as const;

// Legacy export for backward compatibility
export const IMPACT_STATS = IMPACT_GOALS;

export const USER_ROLES = [
  "super_admin",
  "case_worker",
  "sales_lead",
  "technician",
  "event_coordinator",
] as const;

export const LEAD_TYPES = [
  "program",
  "msp",
  "event",
  "volunteer",
  "partner",
  "donor",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
] as const;

export const PARTICIPANT_STATUSES = [
  "applicant",
  "under_review",
  "enrolled",
  "active",
  "graduate",
  "alumni",
  "workforce",
] as const;

export const MSP_PIPELINE_STAGES = [
  { id: "new_lead", label: "New Lead", color: "gray" },
  { id: "discovery", label: "Discovery", color: "blue" },
  { id: "assessment", label: "Assessment", color: "purple" },
  { id: "proposal", label: "Proposal Sent", color: "yellow" },
  { id: "negotiation", label: "Negotiation", color: "orange" },
  { id: "contract", label: "Contract Sent", color: "pink" },
  { id: "onboarding", label: "Onboarding", color: "cyan" },
  { id: "active", label: "Active Client", color: "green" },
] as const;

export const BLOG_CATEGORIES = [
  { slug: "fatherhood", name: "Fatherhood & Leadership" },
  { slug: "tech-careers", name: "Tech Careers" },
  { slug: "family", name: "Family Activities" },
  { slug: "it-nonprofits", name: "IT for Nonprofits" },
  { slug: "community", name: "Community Stories" },
  { slug: "ai-innovation", name: "AI & Innovation" },
] as const;

export const RESOURCE_CATEGORIES = [
  "housing",
  "legal",
  "financial",
  "mental_health",
  "childcare",
  "employment",
  "education",
] as const;

export const EVENT_TYPES = [
  "movies_on_menu",
  "workshop",
  "orientation",
  "community",
  "job_fair",
] as const;
