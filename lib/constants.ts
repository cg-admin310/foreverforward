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
    "Forever Forward uses technology to empower families in Black and brown communities, turning that first spark of exposure into careers, confidence, and legacy.",
  founderNote:
    "I'm a Black father, born in Compton in the late 1900s. I started with what I knew and built forward from there.",
  mantra: "Progress over perfection.",
} as const;

// The three pillars everything on the site rolls up to.
export const PILLARS = [
  {
    id: "careers",
    kicker: "For Fathers",
    name: "Career Forward",
    headline: "Real training. Real credentials. Real careers.",
    description:
      "A whole program of professional events for fathers, from a free CompTIA Tech+ certification course to lunch-and-learns, range days, and money workshops, all built around your life so you never miss a shift or a bedtime. It's the start of a real career in tech and beyond: work that pays well and can't be outsourced. HVAC, auto, and the trades are coming next. You just need to show up. We'll figure out the rest together.",
    image: "/images/future/pillar-careers.jpg",
    href: "/programs/father-forward",
  },
  {
    id: "future-tech",
    kicker: "For Kids & Youth",
    name: "Future Builders",
    headline: "The first time a kid sees the future, everything changes.",
    description:
      "Robots, AI, 3D printers, satellites: the same tools shaping the world, put directly into a kid's hands. They stop watching the future happen and start building it themselves. We hand them tomorrow's tools, then get out of the way.",
    image: "/images/future/pillar-future-tech.jpg",
    href: "/programs/tech-ready-youth",
  },
  {
    id: "moments",
    kicker: "For Everybody",
    name: "Making Moments",
    headline: "Joy is a strategy.",
    description:
      "Movie nights with dinner on us. Dad outings, no kids allowed. Family takeovers of the fun spots. Strong families are built in moments, so we make them on purpose, all year long.",
    image: "/images/future/pillar-moments.jpg",
    href: "/events",
  },
] as const;

// Making Moments — the event series under one roof.
export const EVENT_SERIES = [
  {
    id: "motm",
    name: "Movies on the Menu",
    audience: "Families",
    flagship: true,
    tagline: "Dinner. A movie. Your people.",
    description:
      "Our flagship night: chef-made dinner, a movie under the stars, and your family in it. Free, always.",
    href: "/events/movies-on-the-menu",
    image: "/images/motm/motm-hero.jpg",
  },
  {
    id: "off-the-clock",
    name: "Off the Clock",
    audience: "Dads Only",
    flagship: false,
    tagline: "Grown-man time, on the calendar.",
    description:
      "Fishing trips, range days, cigar lounges, golf. Fellowship, a few new skills, and zero agenda.",
    href: "/events/off-the-clock",
    image: "/images/events/otc-hero.jpg",
  },
  {
    id: "family-takeovers",
    name: "Family Takeovers",
    audience: "The Whole Crew",
    flagship: false,
    tagline: "We take over the fun spots.",
    description:
      "Trampoline parks, paintball, bowling, theme parks, block parties. We rent it out, you show up.",
    href: "/events/family-takeovers",
    image: "/images/events/ft-hero.jpg",
  },
] as const;

// Career tracks inside Father Forward. IT is live; the trades are next.
export const CAREER_PATHWAYS = [
  {
    id: "it",
    name: "IT & Cybersecurity",
    status: "open" as const,
    detail:
      "CompTIA Tech+ certification, networks, data centers, and security. The runway from help desk to network and systems engineer.",
  },
  {
    id: "auto",
    name: "Auto & EV Mechanics",
    status: "coming" as const,
    detail: "Diagnostics, repair, and the electric-vehicle skills every shop is racing to hire for.",
  },
  {
    id: "hvac",
    name: "HVAC & Building Systems",
    status: "coming" as const,
    detail: "Install and service the heating and cooling that keeps every building running.",
  },
  {
    id: "trades",
    name: "Plumbing & Skilled Trades",
    status: "coming" as const,
    detail: "Apprenticeship-ready fundamentals in the trades that keep every city standing.",
  },
] as const;

// The technologies we put in front of the community.
export const FUTURE_TECH = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    line: "Command it. Don't just scroll past it.",
    field: "Intelligence",
  },
  {
    id: "robotics",
    name: "Robotics",
    line: "Code that gets up and moves.",
    field: "Machines",
  },
  {
    id: "printing",
    name: "3D Printing",
    line: "An idea you can hold by dinnertime.",
    field: "Fabrication",
  },
  {
    id: "orbit",
    name: "Rockets & Low Earth Orbit",
    line: "The internet lives overhead now. We watch it pass.",
    field: "Space",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    line: "Ownership with receipts. Rails for what's next.",
    field: "Trust",
  },
  {
    id: "energy",
    name: "Renewable Energy",
    line: "The grid is changing. So are the paychecks.",
    field: "Power",
  },
] as const;

// How we show up for the wider nonprofit community — collaboration, not sales.
export const COMMUNITY_TECH = {
  kicker: "Stronger Together",
  headline: "We help fellow nonprofits power up, too.",
  description:
    "So many organizations are doing heroic work with tools that hold them back. So we roll up our sleeves and help. We get fellow nonprofits onto modern platforms, tighten up their tech, build small custom tools, and put AI to work so every limited dollar stretches further. We're not selling anything. We're joining forces. When one organization levels up, every family it serves rises with it.",
} as const;

export const PROGRAMS = [
  {
    slug: "father-forward",
    name: "Father Forward",
    tagline: "Career. Leadership. Brotherhood.",
    audience: "fathers" as const,
    duration: "Ongoing",
    format: "Events & Courses",
    description:
      "A whole program of professional events for dads: a free CompTIA Tech+ certification course, networking lunch-and-learns, range days for the security path, money workshops, and a brotherhood that has your back. HVAC, auto, and the trades are coming next.",
    icon: "briefcase",
  },
  {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "The Future, in Their Hands.",
    audience: "youth" as const,
    duration: "Ongoing",
    format: "Two Programs",
    description:
      "The umbrella over how we spark the next generation. Future Tech Lab puts robotics, AI, and 3D printing in their hands with a real tech-company field trip. Stories from My Future turns their imagination into a story and a 3D-printed hero.",
    icon: "robot",
  },
  {
    slug: "stories-from-my-future",
    name: "Stories from My Future",
    tagline: "Dream it. Write it. Hold it.",
    audience: "kids" as const,
    duration: "Workshop",
    format: "In-person",
    description:
      "A guided creative writing adventure. With a mentor's help, kids invent a hero, build a full story with an AI writing partner, then draw their character and 3D-print it to take home, along with their digital story.",
    icon: "spark",
  },
];

export const CONTACT_INFO = {
  founder: "Thomas TJ Wilform",
  address: "6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047",
  phone: "(951) 877-5196",
  email: "4ever4wardfoundation@gmail.com",
  website: "forever4ward.org",
  ein: "87-0944016",
} as const;

// Donation designations. Every dollar is tagged with a fund so giving can be
// tracked per program in Stripe and in the admin Donations module.
export const DONATION_FUNDS = [
  {
    id: "general",
    label: "Where It's Needed Most",
    blurb: "Trust us to put it exactly where a family needs it most that week: programs, events, and the people in them.",
  },
  {
    id: "father-forward",
    label: "Father Forward",
    blurb: "Send a father through free IT training toward a CompTIA Tech+, a real career, and a future his kids get to watch.",
  },
  {
    id: "tech-ready-youth",
    label: "Tech-Ready Youth",
    blurb: "Give a young person real access to robotics, AI, and 3D printing, plus a look inside a real tech company.",
  },
  {
    id: "stories-from-my-future",
    label: "Stories from My Future",
    blurb: "Kids invent a hero, write a full story with an AI partner, and 3D-print their character to keep.",
  },
  {
    id: "making-moments",
    label: "Making Moments",
    blurb: "Movie nights, dad outings, and family takeovers, free for families.",
  },
] as const;

export type DonationFundId = (typeof DONATION_FUNDS)[number]["id"];

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
