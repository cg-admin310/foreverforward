// Detailed program data for individual program pages

export type ProgramAudience = "fathers" | "youth" | "families" | "kids" | "students";

export interface ProgramDetail {
  slug: string;
  name: string;
  tagline: string;
  audience: ProgramAudience;
  duration: string;
  format: string;
  icon: string;
  heroImage: string;
  heroDescription: string;
  overview: string[];
  atAGlance: {
    duration: string;
    format: string;
    schedule: string;
    certification?: string;
    ageRange?: string;
    cost: string;
  };
  curriculum: {
    week?: number;
    phase?: string;
    title: string;
    topics: string[];
  }[];
  deliverables: {
    icon: string;
    title: string;
    description: string;
  }[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  };
}

export const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "father-forward": {
    slug: "father-forward",
    name: "Father Forward",
    tagline: "Tech. Leadership. Legacy.",
    audience: "fathers",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "💼",
    heroImage: "/images/generated/program-father-forward.png",
    heroDescription:
      "An intensive 8-week program that transforms fathers into tech professionals and community leaders.",
    overview: [
      "Father Forward is our flagship workforce development program, designed specifically for fathers who want to build stable careers in technology while becoming stronger leaders in their families and communities.",
      "Over 8 weeks, participants receive comprehensive IT training aligned with the Google IT Support Professional Certificate, leadership development, and hands-on experience with enterprise systems. But we go beyond just technical skills—we address the real challenges fathers face and provide the support system they need to succeed.",
      "With Travis AI available 24/7 for study help and encouragement, plus dedicated case workers who understand your journey, Father Forward sets you up for long-term success.",
    ],
    atAGlance: {
      duration: "8 weeks",
      format: "Hybrid (in-person + online)",
      schedule: "Evenings & Saturdays",
      certification: "Google IT Support Certificate Prep",
      cost: "Free for qualifying participants",
    },
    curriculum: [
      {
        week: 1,
        title: "Foundations & Orientation",
        topics: [
          "Program overview and goal setting",
          "Introduction to IT fundamentals",
          "Creating your Path Forward Plan",
          "Meet Travis - your AI case manager",
        ],
      },
      {
        week: 2,
        title: "Computer Hardware",
        topics: [
          "PC components and assembly",
          "Mobile devices and peripherals",
          "Hands-on lab: Build a computer",
          "Troubleshooting methodology",
        ],
      },
      {
        week: 3,
        title: "Operating Systems",
        topics: [
          "Windows administration",
          "Linux fundamentals",
          "macOS overview",
          "File systems and management",
        ],
      },
      {
        week: 4,
        title: "Networking Fundamentals",
        topics: [
          "TCP/IP and the OSI model",
          "Network hardware and configuration",
          "Wireless networking",
          "Network troubleshooting",
        ],
      },
      {
        week: 5,
        title: "Security & Cybersecurity",
        topics: [
          "Security principles and threats",
          "Authentication and access control",
          "Malware prevention",
          "Security best practices",
        ],
      },
      {
        week: 6,
        title: "Cloud & AI Foundations",
        topics: [
          "Introduction to cloud computing",
          "Microsoft 365 administration",
          "AI tools for productivity",
          "Modern IT service delivery",
        ],
      },
      {
        week: 7,
        title: "Leadership Development",
        topics: [
          "Communication and teamwork",
          "Customer service excellence",
          "Project management basics",
          "Building your professional brand",
        ],
      },
      {
        week: 8,
        title: "Career Launch",
        topics: [
          "Resume and interview prep",
          "Google IT Cert exam preparation",
          "Workforce pool introduction",
          "Graduation ceremony",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎓",
        title: "Google IT Certificate Prep",
        description:
          "Complete preparation for the Google IT Support Professional Certificate exam.",
      },
      {
        icon: "📋",
        title: "Path Forward Plan",
        description:
          "A personalized career roadmap with milestones, resources, and ongoing support.",
      },
      {
        icon: "💼",
        title: "Workforce Pool Access",
        description:
          "Graduates join our skilled workforce and get matched with nonprofit IT clients.",
      },
      {
        icon: "🤖",
        title: "Travis AI Support",
        description:
          "24/7 access to our AI case manager for study help and resource connections.",
      },
      {
        icon: "👥",
        title: "Alumni Network",
        description:
          "Lifetime access to the Father Forward community, mentorship, and events.",
      },
      {
        icon: "📜",
        title: "Certificate of Completion",
        description:
          "Official Forever Forward certification recognizing your achievement.",
      },
    ],
    testimonial: {
      quote:
        "Father Forward didn't just teach me IT—it gave me the confidence to be the provider and role model my kids deserve. Now I'm working in tech and making it to every basketball game.",
      name: "Marcus Thompson",
      role: "Father Forward Graduate, Class of 2023",
    },
  },
  "tech-ready-youth": {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "Build Your Future in Tech",
    audience: "youth",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "🎓",
    heroImage: "/images/generated/program-tech-ready-youth.png",
    heroDescription:
      "Prepare young people ages 16+ for entry-level IT careers with hands-on training and industry certifications.",
    overview: [
      "Tech-Ready Youth opens the door to tech careers for young people who might not otherwise have access to training and opportunities. Whether you're in high school, recently graduated, or looking for a career change, this program meets you where you are.",
      "The curriculum covers everything needed for entry-level IT positions: hardware, software, networking, security, and customer service. But we also focus on the soft skills that employers value—communication, teamwork, problem-solving, and professionalism.",
      "The program culminates in a Gaming Tournament capstone event where participants showcase their technical skills while competing in a friendly esports competition.",
    ],
    atAGlance: {
      duration: "8 weeks",
      format: "Hybrid (in-person + online)",
      schedule: "After school & weekends",
      certification: "Google IT Support Certificate Prep",
      ageRange: "Ages 16-24",
      cost: "Free",
    },
    curriculum: [
      {
        week: 1,
        title: "Welcome to Tech",
        topics: [
          "Program orientation and goal setting",
          "Introduction to IT careers",
          "Setting up your learning environment",
          "Meeting Travis - your AI study buddy",
        ],
      },
      {
        week: 2,
        title: "Inside the Machine",
        topics: [
          "Computer hardware components",
          "Building and upgrading PCs",
          "Mobile device fundamentals",
          "Hands-on: PC assembly challenge",
        ],
      },
      {
        week: 3,
        title: "Operating Systems",
        topics: [
          "Windows: The IT standard",
          "Linux: Server essentials",
          "Command line basics",
          "Software installation and management",
        ],
      },
      {
        week: 4,
        title: "Networking",
        topics: [
          "How the internet works",
          "Network setup and configuration",
          "WiFi and wireless networks",
          "Hands-on: Home network setup",
        ],
      },
      {
        week: 5,
        title: "Security Essentials",
        topics: [
          "Cybersecurity fundamentals",
          "Protecting yourself online",
          "Password management",
          "Security careers overview",
        ],
      },
      {
        week: 6,
        title: "Cloud & Modern Tech",
        topics: [
          "Introduction to cloud computing",
          "Collaboration tools",
          "AI productivity tools",
          "Remote work best practices",
        ],
      },
      {
        week: 7,
        title: "Professional Skills",
        topics: [
          "Customer service excellence",
          "Technical communication",
          "Resume building",
          "Interview preparation",
        ],
      },
      {
        week: 8,
        title: "Capstone & Graduation",
        topics: [
          "Gaming Tournament setup",
          "Team competition and showcase",
          "Certification exam prep",
          "Graduation celebration",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎓",
        title: "Google IT Certificate Prep",
        description:
          "Full preparation for the Google IT Support Professional Certificate.",
      },
      {
        icon: "🎮",
        title: "Gaming Tournament",
        description:
          "Capstone esports event showcasing technical and teamwork skills.",
      },
      {
        icon: "📄",
        title: "Professional Resume",
        description:
          "Polished resume highlighting your new skills and certifications.",
      },
      {
        icon: "🤖",
        title: "Travis AI Access",
        description:
          "24/7 study help and support from our AI learning assistant.",
      },
      {
        icon: "💼",
        title: "Career Connections",
        description:
          "Introductions to employers and apprenticeship opportunities.",
      },
      {
        icon: "📜",
        title: "Certificate of Completion",
        description:
          "Official certification of your Tech-Ready Youth achievement.",
      },
    ],
    testimonial: {
      quote:
        "I went from gaming all day to building gaming PCs for a living. Tech-Ready Youth showed me that my passion could become a career.",
      name: "Jaylen Rodriguez",
      role: "Tech-Ready Youth Graduate, 2024",
    },
  },
  "making-moments": {
    slug: "making-moments",
    name: "Making Moments",
    tagline: "Creating Joy, Strengthening Bonds",
    audience: "families",
    duration: "Ongoing",
    format: "In-person",
    icon: "❤️",
    heroImage: "/images/generated/program-making-moments.png",
    heroDescription:
      "Community events and experiences designed to strengthen father-child bonds and create lasting family memories.",
    overview: [
      "Making Moments is our family enrichment initiative, creating opportunities for fathers to connect with their children through shared experiences. At the heart of this program is our signature 'Movies on the Menu' series—dinner-and-movie events where families enjoy themed meals, watch films together, and build community.",
      "But Making Moments goes beyond movie nights. We host holiday events, sports outings, educational field trips, and seasonal celebrations. Every event is designed with intention: to create space for fathers and children to bond, laugh, and make memories.",
      "Because we know that strong families start with presence—and sometimes all you need is a reason to be together.",
    ],
    atAGlance: {
      duration: "Ongoing events",
      format: "In-person community events",
      schedule: "Monthly (varies by event)",
      cost: "Free or low-cost",
    },
    curriculum: [
      {
        phase: "Monthly",
        title: "Movies on the Menu",
        topics: [
          "Themed dinner with family-style seating",
          "Blockbuster movie screening",
          "Father-child bonding activities",
          "Community networking time",
        ],
      },
      {
        phase: "Seasonal",
        title: "Holiday Events",
        topics: [
          "Back-to-school celebrations",
          "Halloween costume parties",
          "Thanksgiving family dinners",
          "Winter holiday festivities",
        ],
      },
      {
        phase: "Quarterly",
        title: "Sports & Outings",
        topics: [
          "Tickets to local sports games",
          "Bowling nights",
          "Hiking and outdoor adventures",
          "Museum and educational trips",
        ],
      },
      {
        phase: "Special",
        title: "Community Celebrations",
        topics: [
          "Father's Day celebration",
          "Program graduation ceremonies",
          "Anniversary events",
          "Partner organization events",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎬",
        title: "Movies on the Menu",
        description:
          "Monthly dinner-and-movie events with themed food and family fun.",
      },
      {
        icon: "🎉",
        title: "Holiday Celebrations",
        description:
          "Seasonal events that bring the community together.",
      },
      {
        icon: "⚽",
        title: "Sports Outings",
        description:
          "Tickets and trips to local sporting events and recreational activities.",
      },
      {
        icon: "📸",
        title: "Photo Memories",
        description:
          "Professional photos from events to capture family moments.",
      },
      {
        icon: "👨‍👧",
        title: "Bonding Activities",
        description:
          "Structured activities designed to strengthen parent-child connections.",
      },
      {
        icon: "🤝",
        title: "Community Network",
        description:
          "Connect with other families who share your values and journey.",
      },
    ],
    testimonial: {
      quote:
        "Movies on the Menu has become our thing. My daughter looks forward to it every month, and honestly, so do I. It's not just an event—it's quality time.",
      name: "David Chen",
      role: "Making Moments Participant",
    },
  },
  "from-script-to-screen": {
    slug: "from-script-to-screen",
    name: "From Script to Screen",
    tagline: "Tell Your Story",
    audience: "students",
    duration: "Multi-phase",
    format: "Hybrid",
    icon: "🎬",
    heroImage: "/images/generated/program-script-to-screen.png",
    heroDescription:
      "A filmmaking program partnered with actress Dawnn Lewis, teaching students to tell their stories through AI-enhanced video production.",
    overview: [
      "From Script to Screen is a creative partnership with actress and producer Dawnn Lewis (A Different World, Hangin' with Mr. Cooper) that teaches young storytellers the art of filmmaking—from concept to premiere.",
      "Students learn the entire filmmaking process: screenwriting, directing, cinematography, editing, and more. What makes this program unique is the integration of cutting-edge tools like AI writing assistants and Unreal Engine for visual effects, giving students exposure to the future of entertainment production.",
      "Each cohort produces short films that premiere at our annual film festival, giving students a real-world showcase for their creative work.",
    ],
    atAGlance: {
      duration: "Multi-phase (varies)",
      format: "Hybrid workshops + production",
      schedule: "After school + weekends",
      ageRange: "Middle & high school students",
      cost: "Free",
    },
    curriculum: [
      {
        phase: "Phase 1",
        title: "Story Development",
        topics: [
          "Introduction to storytelling",
          "Screenwriting fundamentals",
          "Using AI for creative writing",
          "Developing your unique voice",
        ],
      },
      {
        phase: "Phase 2",
        title: "Pre-Production",
        topics: [
          "Storyboarding and shot planning",
          "Casting and character development",
          "Location scouting",
          "Production planning",
        ],
      },
      {
        phase: "Phase 3",
        title: "Production",
        topics: [
          "Camera operation and cinematography",
          "Directing actors",
          "Sound recording",
          "Set management",
        ],
      },
      {
        phase: "Phase 4",
        title: "Post-Production",
        topics: [
          "Video editing fundamentals",
          "Unreal Engine for visual effects",
          "Sound design and music",
          "Color grading",
        ],
      },
      {
        phase: "Phase 5",
        title: "Premiere",
        topics: [
          "Final film delivery",
          "Marketing your film",
          "Film festival preparation",
          "Red carpet premiere event",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎬",
        title: "Completed Short Film",
        description:
          "A polished short film you wrote, directed, and produced.",
      },
      {
        icon: "🎭",
        title: "Mentorship with Dawnn Lewis",
        description:
          "Direct guidance from an accomplished actress and producer.",
      },
      {
        icon: "🤖",
        title: "AI & Unreal Engine Skills",
        description:
          "Hands-on experience with cutting-edge creative technology.",
      },
      {
        icon: "🎪",
        title: "Film Festival Premiere",
        description:
          "Your work showcased at our annual student film festival.",
      },
      {
        icon: "📁",
        title: "Professional Portfolio",
        description:
          "Demo reel and materials to pursue further creative opportunities.",
      },
      {
        icon: "💻",
        title: "Laptop (if needed)",
        description:
          "Qualifying students receive laptops through our A New Day partnership.",
      },
    ],
    testimonial: {
      quote:
        "I never thought I could make a real movie. Now I have one with my name on it, and people actually watched it at a real premiere. That's crazy.",
      name: "Aaliyah Washington",
      role: "From Script to Screen Graduate, 2024",
    },
  },
  "stories-from-my-future": {
    slug: "stories-from-my-future",
    name: "Stories from My Future",
    tagline: "Imagine. Create. Print.",
    audience: "kids",
    duration: "Workshop",
    format: "In-person",
    icon: "✨",
    heroImage: "/images/generated/program-stories-future.png",
    heroDescription:
      "A creative workshop where kids write stories about their future selves, design with AI, and bring their visions to life with 3D printing.",
    overview: [
      "Stories from My Future is a magical workshop experience that combines storytelling, AI design tools, and 3D printing technology to help kids envision and create their futures—literally.",
      "Kids write stories about who they want to become, then work with facilitators to design visual representations using AI tools. The best part? They get to print their designs on our Bambu Lab 3D printers and take home a physical creation that represents their dreams.",
      "It's part creative writing, part technology exploration, and entirely about showing kids that their imagination has no limits.",
    ],
    atAGlance: {
      duration: "Single-day or weekend workshop",
      format: "In-person at Forever Forward",
      schedule: "Varies by session",
      ageRange: "Ages 6-12",
      cost: "Starting at $100",
    },
    curriculum: [
      {
        phase: "Part 1",
        title: "Dream It",
        topics: [
          "Guided imagination exercises",
          "Story prompts: 'In 20 years, I will be...'",
          "Writing your future story",
          "Sharing stories with the group",
        ],
      },
      {
        phase: "Part 2",
        title: "Design It",
        topics: [
          "Introduction to AI design tools",
          "Creating visual representations",
          "Selecting designs for 3D printing",
          "Understanding 3D printing basics",
        ],
      },
      {
        phase: "Part 3",
        title: "Print It",
        topics: [
          "Watching the Bambu Lab in action",
          "Learning how 3D printers work",
          "Receiving your printed creation",
          "Celebration and showcase",
        ],
      },
    ],
    deliverables: [
      {
        icon: "📖",
        title: "Future Story",
        description:
          "A written story about your future self, illustrated and bound.",
      },
      {
        icon: "🎨",
        title: "AI-Generated Art",
        description:
          "Digital artwork created with AI based on your story.",
      },
      {
        icon: "🖨️",
        title: "3D Printed Creation",
        description:
          "A physical 3D print representing your dreams, made on Bambu Lab.",
      },
      {
        icon: "📸",
        title: "Photo Keepsake",
        description:
          "Professional photo with your creation to take home.",
      },
      {
        icon: "🎓",
        title: "STEM Exposure",
        description:
          "Hands-on introduction to AI and 3D printing technology.",
      },
      {
        icon: "😊",
        title: "Confidence Boost",
        description:
          "The pride of seeing your imagination become reality.",
      },
    ],
    testimonial: {
      quote:
        "My son said he wants to be a 'robot engineer who helps people.' Seeing him hold the little robot he designed... I've never seen him smile so big.",
      name: "Monica Harris",
      role: "Parent of Stories from My Future Participant",
    },
  },
  lula: {
    slug: "lula",
    name: "LULA",
    tagline: "Level Up Learning Academy",
    audience: "youth",
    duration: "Ongoing",
    format: "Online",
    icon: "🎮",
    heroImage: "/images/generated/program-lula-learning.png",
    heroDescription:
      "A gamified online STEM learning platform where young people earn points, unlock achievements, and level up their skills.",
    overview: [
      "LULA (Level Up Learning Academy) reimagines education by making learning feel like gaming. Through our online platform, young people engage with STEM subjects through interactive lessons, real-world projects, and friendly competition.",
      "Every lesson completed earns XP. Every skill mastered unlocks achievements. Leaderboards keep things competitive, while AI-powered tutoring ensures no one gets left behind. It's designed for the generation that grew up with games—and it works.",
      "LULA isn't a replacement for school—it's a supplement that makes after-school learning actually exciting.",
    ],
    atAGlance: {
      duration: "Ongoing access",
      format: "100% online platform",
      schedule: "Self-paced",
      ageRange: "Ages 10-18",
      cost: "Free basic tier",
    },
    curriculum: [
      {
        phase: "Track 1",
        title: "Tech Fundamentals",
        topics: [
          "Computer basics and digital literacy",
          "Introduction to coding (Scratch, Python)",
          "Internet safety and citizenship",
          "Basic troubleshooting",
        ],
      },
      {
        phase: "Track 2",
        title: "Coding & Development",
        topics: [
          "Python programming",
          "Web development basics",
          "Game development intro",
          "Building real projects",
        ],
      },
      {
        phase: "Track 3",
        title: "Digital Creation",
        topics: [
          "Graphic design fundamentals",
          "Video editing basics",
          "AI tools for creativity",
          "Building a portfolio",
        ],
      },
      {
        phase: "Track 4",
        title: "Future Tech",
        topics: [
          "Introduction to AI and machine learning",
          "Robotics concepts",
          "Cybersecurity awareness",
          "Career exploration in tech",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎮",
        title: "Gamified Learning",
        description:
          "Earn XP, unlock achievements, and climb the leaderboards.",
      },
      {
        icon: "🤖",
        title: "AI Tutoring",
        description:
          "Get personalized help from our AI learning assistant anytime.",
      },
      {
        icon: "💻",
        title: "Real Projects",
        description:
          "Build websites, games, and apps you can show off.",
      },
      {
        icon: "🏆",
        title: "Certificates",
        description:
          "Earn verified certificates for completed tracks.",
      },
      {
        icon: "👥",
        title: "Community",
        description:
          "Connect with other learners, form teams, and collaborate.",
      },
      {
        icon: "📈",
        title: "Progress Tracking",
        description:
          "Dashboards for students and parents to track learning.",
      },
    ],
    testimonial: {
      quote:
        "My daughter actually asks to do LULA after school. She's completed two tracks and won't stop talking about making her own video game.",
      name: "Kevin Brown",
      role: "Parent of LULA Learner",
    },
  },
};

export function getProgramBySlug(slug: string): ProgramDetail | undefined {
  return PROGRAM_DETAILS[slug];
}

export function getAllProgramSlugs(): string[] {
  return Object.keys(PROGRAM_DETAILS);
}
