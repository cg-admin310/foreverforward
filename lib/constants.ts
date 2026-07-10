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

// The one-line mission that anchors every page.
export const MISSION = {
  headline: "The future belongs to our families.",
  statement:
    "Forever Forward introduces underserved communities to the technologies shaping tomorrow — AI, robotics, 3D printing, satellites orbiting overhead — and turns that first spark of curiosity into careers, confidence, and legacy.",
  founderNote:
    "I'm a Black father. I started with what I knew — and built forward from there.",
} as const;

// The three pillars everything on the site rolls up to.
export const PILLARS = [
  {
    id: "careers",
    kicker: "For Fathers",
    name: "Career Forward",
    headline: "Real training. Real credentials. Real careers.",
    description:
      "Career pathways built for fathers — IT and cybersecurity, plumbing and skilled trades, EV and auto mechanics. Modern industries that pay real wages and can't be outsourced. Pick a path. Build a legacy.",
    image: "/images/future/pillar-careers.jpg",
    href: "/programs/father-forward",
  },
  {
    id: "future-tech",
    kicker: "For Kids & Youth",
    name: "Future Builders",
    headline: "The first time a kid sees the future, everything changes.",
    description:
      "Robotics they can build. AI they can direct. 3D printers that turn their ideas into objects. Satellites they can track across the night sky. We put tomorrow's tools in young hands — the same hands the future is waiting on.",
    image: "/images/future/pillar-future-tech.jpg",
    href: "/programs/tech-ready-youth",
  },
  {
    id: "moments",
    kicker: "For Families",
    name: "Making Moments",
    headline: "Joy is a strategy.",
    description:
      "Movie nights with dinner on us. Robot races in the park. Festivals where fathers and kids show up as a team. Because strong families aren't built in classrooms alone — they're built in moments.",
    image: "/images/future/pillar-moments.jpg",
    href: "/programs/making-moments",
  },
] as const;

// Career pathways inside Career Forward (Father Forward program).
export const CAREER_PATHWAYS = [
  {
    id: "it",
    name: "IT & Cybersecurity",
    detail: "Google IT Support Certificate prep, networks, cloud, and security fundamentals.",
  },
  {
    id: "trades",
    name: "Plumbing & Skilled Trades",
    detail: "Apprenticeship-ready fundamentals in plumbing and the building trades that keep every city running.",
  },
  {
    id: "auto",
    name: "Auto & EV Mechanics",
    detail: "Diagnostics, repair, and the electric-vehicle skills the next generation of shops is hiring for.",
  },
] as const;

// The technologies we put in front of the community.
export const FUTURE_TECH = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    line: "Not just using it — directing it.",
  },
  {
    id: "robotics",
    name: "Robotics",
    line: "Build it, code it, race it.",
  },
  {
    id: "printing",
    name: "3D Printing",
    line: "From imagination to object in an afternoon.",
  },
  {
    id: "orbit",
    name: "Low Earth Orbit",
    line: "Satellites overhead, tracked from our own rooftops.",
  },
] as const;

// How we show up for the wider nonprofit community — collaboration, not sales.
export const COMMUNITY_TECH = {
  kicker: "Stronger Together",
  headline: "We help other organizations power up, too.",
  description:
    "Forever Forward builds apps and shares technology with fellow nonprofits — joining forces so the whole community-resource space can serve people better. When one organization levels up, everyone it serves levels up with it.",
} as const;

export const PROGRAMS = [
  {
    slug: "father-forward",
    name: "Father Forward",
    tagline: "Pick a Path. Build a Legacy.",
    audience: "fathers" as const,
    duration: "8 weeks",
    format: "Hybrid",
    description:
      "Career training built for fathers — choose IT & cybersecurity, plumbing & skilled trades, or auto & EV mechanics, with leadership coaching and a community that has your back.",
    icon: "💼",
  },
  {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "Build the Future With Your Own Hands",
    audience: "youth" as const,
    duration: "8 weeks",
    format: "Hybrid",
    description:
      "Hands-on robotics, AI, and real hardware for ages 16+ — ending in a capstone gaming tournament where the skills get put to the test.",
    icon: "🤖",
  },
  {
    slug: "making-moments",
    name: "Making Moments",
    tagline: "Joy Is a Strategy",
    audience: "families" as const,
    duration: "Ongoing",
    format: "In-person",
    description:
      "Community events that strengthen father-child bonds — dinner-and-a-movie nights, robot races, and festivals the whole family looks forward to.",
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
      "A filmmaking program with Dawnn Lewis where students use AI and Unreal Engine to bring their own stories to the big screen.",
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
      "Kids write the story of who they'll become, design it with AI, and 3D-print a piece of that future to take home.",
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
  { label: "Youth to Reach", value: 5000, suffix: "+", current: 0 },
  { label: "Events Annually", value: 50, suffix: "+", current: 0 },
  { label: "Partner Organizations", value: 25, suffix: "+", current: 0 },
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
  { slug: "future-tech", name: "Future Tech" },
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
