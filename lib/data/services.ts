// Detailed service data for individual service pages

export interface PricingTier {
  name: string;
  price: string;
  unit?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceDetail {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  heroImage: string;
  heroDescription: string;
  overview: string[];
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  pricingTiers: PricingTier[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  techStack?: string[];
  serviceArea: string;
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "managed-it": {
    slug: "managed-it",
    name: "Managed IT Services",
    tagline: "Enterprise IT. Nonprofit Heart.",
    icon: "🖥️",
    heroImage: "/images/generated/service-managed-it.png",
    heroDescription:
      "Comprehensive IT support for nonprofits and schools—from help desk to strategic planning.",
    overview: [
      "Our Managed IT Services bring enterprise-level technology support to mission-driven organizations at prices that respect your budget. We handle everything from daily help desk requests to long-term IT strategy, so you can focus on your mission.",
      "What makes us different? Our technicians are graduates of our workforce programs—skilled professionals who understand community service firsthand. When you partner with Forever Forward, you're not just getting IT support; you're helping create jobs for fathers and youth in our community.",
      "We use industry-leading tools and best practices developed for Fortune 500 companies, adapted for the unique needs of nonprofits and educational institutions.",
    ],
    benefits: [
      {
        icon: "🛡️",
        title: "24/7 Monitoring",
        description:
          "We watch your systems around the clock, catching problems before they impact your work.",
      },
      {
        icon: "📞",
        title: "Help Desk Support",
        description:
          "Your staff gets friendly, knowledgeable support whenever they need it.",
      },
      {
        icon: "🔒",
        title: "Security First",
        description:
          "Proactive security updates, threat monitoring, and compliance support.",
      },
      {
        icon: "📈",
        title: "Strategic Planning",
        description:
          "Quarterly business reviews and technology roadmaps aligned with your goals.",
      },
      {
        icon: "💰",
        title: "Predictable Costs",
        description:
          "Flat monthly pricing means no surprise bills—budget with confidence.",
      },
      {
        icon: "🤝",
        title: "Community Impact",
        description:
          "Every dollar you spend helps train and employ fathers and youth.",
      },
    ],
    pricingTiers: [
      {
        name: "Foundation",
        price: "$200-$500",
        unit: "one-time setup + $50-$100/month",
        description: "For small nonprofits just getting started with IT support.",
        features: [
          "Basic monitoring and alerts",
          "Email and phone support (business hours)",
          "Microsoft 365 setup and management",
          "Quarterly check-ins",
          "Up to 15 users",
        ],
      },
      {
        name: "Growth",
        price: "$50-$65",
        unit: "per user/month",
        description:
          "Our most popular package for established nonprofits and schools.",
        features: [
          "24/7 monitoring and management",
          "Unlimited help desk support",
          "Advanced security suite",
          "Monthly reporting",
          "Quarterly business reviews",
          "On-site support included",
          "15-75 users",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$75-$85",
        unit: "per user/month",
        description:
          "Full-service IT partnership for large or complex organizations.",
        features: [
          "Everything in Growth, plus:",
          "Dedicated account manager",
          "Custom SLA guarantees",
          "vCIO strategic services",
          "Compliance support (HIPAA, etc.)",
          "Priority on-site response",
          "75+ users",
        ],
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery Call",
        description:
          "We learn about your organization, current IT setup, and challenges.",
      },
      {
        step: 2,
        title: "Assessment",
        description:
          "Our team evaluates your infrastructure and identifies opportunities.",
      },
      {
        step: 3,
        title: "Proposal",
        description:
          "You receive a detailed plan with transparent pricing—no surprises.",
      },
      {
        step: 4,
        title: "Onboarding",
        description:
          "We deploy our tools and train your team on the new support process.",
      },
      {
        step: 5,
        title: "Ongoing Support",
        description:
          "Enjoy peace of mind with proactive management and responsive support.",
      },
    ],
    techStack: [
      "Microsoft 365",
      "Windows Server",
      "Dell Hardware",
      "SonicWall Security",
      "Ubiquiti Networking",
      "ConnectWise RMM",
    ],
    serviceArea:
      "Greater Los Angeles (South LA, Compton, Inglewood, Carson, Long Beach). Remote support available nationwide.",
  },
  "software-ai": {
    slug: "software-ai",
    name: "Software & AI Development",
    tagline: "Custom Solutions for Impact",
    icon: "💻",
    heroImage: "/images/generated/service-software-ai.png",
    heroDescription:
      "Custom applications, AI chatbots, process automation, and data tools built for mission-driven organizations.",
    overview: [
      "Technology should amplify your impact, not hold you back. Our Software & AI Development services help nonprofits and schools build custom solutions that solve real problems—from donor management systems to AI-powered chatbots that serve your community 24/7.",
      "We specialize in practical AI applications: intake chatbots, document automation, data analysis tools, and more. Our approach is to start with your actual needs, not the latest tech trends, and build solutions that your team can actually use.",
      "Every project includes training for your staff and documentation, so you're never dependent on us to keep things running.",
    ],
    benefits: [
      {
        icon: "🤖",
        title: "AI Integration",
        description:
          "Chatbots, document processing, and intelligent automation that saves staff time.",
      },
      {
        icon: "🌐",
        title: "Web Applications",
        description:
          "Custom portals, dashboards, and tools built for your specific workflows.",
      },
      {
        icon: "⚡",
        title: "Process Automation",
        description:
          "Eliminate repetitive tasks and let your team focus on mission-critical work.",
      },
      {
        icon: "📊",
        title: "Data & Analytics",
        description:
          "Turn your data into insights with custom dashboards and reporting.",
      },
      {
        icon: "🔗",
        title: "System Integration",
        description:
          "Connect your existing tools so data flows where it needs to go.",
      },
      {
        icon: "📚",
        title: "Training Included",
        description:
          "Your team gets hands-on training and documentation for every project.",
      },
    ],
    pricingTiers: [
      {
        name: "Quick Win",
        price: "$1,500-$3,500",
        description:
          "Small automation projects and integrations that deliver immediate value.",
        features: [
          "Single workflow automation",
          "Basic integrations (Zapier, etc.)",
          "Simple chatbot setup",
          "2-4 week delivery",
          "30 days of support",
        ],
      },
      {
        name: "Custom Build",
        price: "$5,000-$15,000",
        description: "Full custom application or AI solution for your specific needs.",
        features: [
          "Custom web application",
          "Advanced AI integration",
          "User training and documentation",
          "6-12 week delivery",
          "90 days of support",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$15,000+",
        description:
          "Large-scale projects requiring ongoing development and support.",
        features: [
          "Multi-phase development",
          "Complex AI/ML solutions",
          "Dedicated project team",
          "Ongoing maintenance available",
          "Custom SLA options",
        ],
      },
    ],
    process: [
      {
        step: 1,
        title: "Consultation",
        description:
          "We dive deep into your challenges and identify the right solution approach.",
      },
      {
        step: 2,
        title: "Scoping",
        description:
          "Detailed project plan with milestones, timeline, and fixed pricing.",
      },
      {
        step: 3,
        title: "Development",
        description:
          "Agile development with regular demos so you see progress throughout.",
      },
      {
        step: 4,
        title: "Testing",
        description:
          "Thorough testing with your team to ensure everything works as expected.",
      },
      {
        step: 5,
        title: "Launch & Training",
        description:
          "Deploy to production and train your staff to use the new system.",
      },
    ],
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "Claude AI",
      "Supabase",
      "Vercel",
    ],
    serviceArea:
      "Remote-first delivery. We work with organizations nationwide.",
  },
  "low-voltage": {
    slug: "low-voltage",
    name: "Low Voltage & Infrastructure",
    tagline: "Build the Foundation",
    icon: "🔌",
    heroImage: "/images/generated/service-low-voltage.png",
    heroDescription:
      "Structured cabling, CCTV installation, network infrastructure, and media systems for facilities.",
    overview: [
      "Your technology is only as reliable as the infrastructure it runs on. Our Low Voltage team handles the physical layer—structured cabling, security cameras, network equipment, and media systems—with the same care and professionalism as our managed services.",
      "Whether you're building out a new facility, upgrading aging infrastructure, or adding security cameras, our technicians ensure clean installation, proper documentation, and systems that will serve you for years to come.",
      "We specialize in nonprofits, schools, and community facilities, so we understand budget constraints and the need for minimal disruption to your operations.",
    ],
    benefits: [
      {
        icon: "📡",
        title: "Structured Cabling",
        description:
          "Clean, certified Cat6/Cat6a installations with proper cable management.",
      },
      {
        icon: "📹",
        title: "CCTV & Security",
        description:
          "Camera systems designed for your space, with remote viewing capabilities.",
      },
      {
        icon: "🌐",
        title: "Network Infrastructure",
        description:
          "Routers, switches, access points, and racks—properly deployed.",
      },
      {
        icon: "📺",
        title: "Media Systems",
        description:
          "Conference room setups, digital signage, and AV integration.",
      },
      {
        icon: "📋",
        title: "Documentation",
        description:
          "Complete as-built documentation so you always know what's where.",
      },
      {
        icon: "✅",
        title: "Certified Work",
        description:
          "All work tested and certified to manufacturer specifications.",
      },
    ],
    pricingTiers: [
      {
        name: "Cabling",
        price: "$150-$300",
        unit: "per drop",
        description: "Cat6/Cat6a structured cabling with termination and testing.",
        features: [
          "Cat6 or Cat6a cable",
          "Keystone jacks and wall plates",
          "Patch panel termination",
          "Cable testing and certification",
          "As-built documentation",
        ],
      },
      {
        name: "CCTV",
        price: "$2,500-$8,000",
        unit: "typical project",
        description: "Complete camera system installation with NVR and remote access.",
        features: [
          "IP camera installation",
          "Network Video Recorder (NVR)",
          "Remote viewing setup",
          "Motion detection configuration",
          "Training for your team",
        ],
        popular: true,
      },
      {
        name: "IT Refresh",
        price: "$75-$150",
        unit: "per device",
        description: "Device rollouts, workstation setup, and equipment migrations.",
        features: [
          "Hardware deployment",
          "Data migration",
          "Software installation",
          "User profile setup",
          "Old device secure disposal",
        ],
      },
    ],
    process: [
      {
        step: 1,
        title: "Site Survey",
        description:
          "We walk your facility to understand the scope and identify challenges.",
      },
      {
        step: 2,
        title: "Design",
        description:
          "Custom plan showing cable routes, camera placement, and equipment locations.",
      },
      {
        step: 3,
        title: "Proposal",
        description:
          "Detailed quote with materials, labor, and timeline—all transparent.",
      },
      {
        step: 4,
        title: "Installation",
        description:
          "Professional installation with minimal disruption to your operations.",
      },
      {
        step: 5,
        title: "Testing & Handoff",
        description:
          "Every connection tested, documented, and explained to your team.",
      },
    ],
    techStack: [
      "Cat6/Cat6a Cabling",
      "Ubiquiti",
      "Hikvision",
      "Commscope",
      "Panduit",
      "Leviton",
    ],
    serviceArea:
      "Greater Los Angeles area. On-site installation required for most projects.",
  },
};

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICE_DETAILS[slug];
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(SERVICE_DETAILS);
}
