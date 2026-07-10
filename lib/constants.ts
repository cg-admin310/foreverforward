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
    "We're a crew of dads, builders, and believers putting tomorrow's technology in the hands of Black and brown communities. AI, robotics, 3D printing, satellites, even rockets. The kind of exposure that turns a first \"whoa\" into careers, confidence, and legacy. We're not chasing perfect. We're chasing forward.",
  founderNote:
    "I'm a Black father, born in Compton in the late 1900s. I started with what I knew and built forward from there.",
  mantra: "Progress over perfection. Every single week.",
} as const;

// The three pillars everything on the site rolls up to.
export const PILLARS = [
  {
    id: "careers",
    kicker: "For Fathers",
    name: "Career Forward",
    headline: "Real training. Real credentials. Real careers.",
    description:
      "Twelve weeks of career training built around real life: evenings and Saturdays, in IT and cybersecurity, plumbing and skilled trades, or auto and EV mechanics. Work that pays real money and can't be outsourced. You don't need to have it all figured out. You just need to show up. We'll figure out the rest together.",
    image: "/images/future/pillar-careers.jpg",
    href: "/programs/father-forward",
  },
  {
    id: "future-tech",
    kicker: "For Kids & Youth",
    name: "Future Builders",
    headline: "The first time a kid sees the future, everything changes.",
    description:
      "Robots they build. AI they get to boss around. 3D printers that turn \"what if\" into \"look what I made.\" Books they write and publish with their own name on the cover. We hand kids tomorrow's tools, then get out of the way.",
    image: "/images/future/pillar-future-tech.jpg",
    href: "/programs/tech-ready-youth",
  },
  {
    id: "moments",
    kicker: "For Families",
    name: "Making Moments",
    headline: "Joy is a strategy.",
    description:
      "Movie nights with dinner on us. Robot races in the park. Evenings where the only assignment is being together. Strong families aren't built in classrooms. They're built in moments, so we make moments, on purpose, all year long.",
    image: "/images/future/pillar-moments.jpg",
    href: "/programs/making-moments",
  },
] as const;

// Career pathways inside Career Forward (Father Forward program).
export const CAREER_PATHWAYS = [
  {
    id: "it",
    name: "IT & Cybersecurity",
    detail:
      "CompTIA ITF+ certification prep, networks, data centers, and security. A real runway from help desk to network and systems engineer.",
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
    name: "AI & Machine Learning",
    line: "Not just using it. Directing it.",
  },
  {
    id: "robotics",
    name: "Robotics",
    line: "Build it. Code it. Race it.",
  },
  {
    id: "printing",
    name: "3D Printing",
    line: "From \"what if\" to \"in your hand\" in an afternoon.",
  },
  {
    id: "orbit",
    name: "Rockets & Low Earth Orbit",
    line: "Satellites overhead, tracked from our own rooftops.",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    line: "The rails tomorrow's money and records run on.",
  },
  {
    id: "energy",
    name: "Renewable Energy",
    line: "The power of the future, and the paychecks that come with it.",
  },
] as const;

// How we show up for the wider nonprofit community — collaboration, not sales.
export const COMMUNITY_TECH = {
  kicker: "Stronger Together",
  headline: "We help other nonprofits power up, too.",
  description:
    "A lot of organizations are doing big work with old tools. So we jump in. We get fellow nonprofits onto modern platforms, tighten up their tech, build small custom tools, and put AI to work so limited resources stretch further. We're not selling anything. We're joining forces. When one org levels up, every family it serves levels up with it.",
} as const;

export const PROGRAMS = [
  {
    slug: "father-forward",
    name: "Father Forward",
    tagline: "Pick a Path. Build a Legacy.",
    audience: "fathers" as const,
    duration: "12 weeks",
    format: "Hybrid",
    description:
      "Twelve weeks of career training built for dads: IT & cybersecurity, plumbing & skilled trades, or auto & EV mechanics. Guest speakers from the industry, leadership you can use at home, and a crew that won't let you quit on yourself.",
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
      "Robots, AI, and real hardware for ages 16+. Eight weeks of building things that actually work, capped off with a gaming tournament they run themselves.",
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
      "Dinner-and-a-movie nights, robot races, festivals. Events built so dads and kids get real time together, with no agenda except a good one.",
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
      "Students write it, AI and Unreal Engine help build it, and a real festival premieres it. Filmmaking with Dawnn Lewis, from first line to final cut.",
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
      "Kids write the story of their future self, illustrate it with AI, publish it as a real book, and 3D-print a piece of that future to take home. Published author by dinnertime.",
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
      "A gamified STEM platform where the character kids level up is themselves. AI tutoring included, patience unlimited.",
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
