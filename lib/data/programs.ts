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
    tagline: "Pick a Path. Build a Legacy.",
    audience: "fathers",
    duration: "12 weeks",
    format: "Hybrid",
    icon: "💼",
    heroImage: "/images/future/pillar-careers.jpg",
    heroDescription:
      "Twelve weeks of free career training built for dads, by a dad. Pick your lane: IT & cybersecurity, plumbing & skilled trades, or auto & EV mechanics, and walk out with a real credential and a crew that's got your back.",
    overview: [
      "Father Forward is our flagship, built by a dad from Compton who figured out that the fastest way to change a family's future is to hand its father a career. Pick a lane: IT & Cybersecurity (CompTIA ITF+ prep, real data center time, and the road to network and systems engineer laid out in front of you), Plumbing & Skilled Trades, or Auto & EV Mechanics.",
      "Every week brings guest speakers who do this work right now, a leadership thread on goals, money, and showing up for your kids, and Travis, our AI mentor, on call 24/7. It's free, and we're not looking for perfect. Progress over perfection, every single week.",
    ],
    atAGlance: {
      duration: "12 weeks",
      format: "Hybrid (in-person labs + online)",
      schedule: "Evenings & Saturdays, built around work and kids",
      certification: "CompTIA ITF+ prep (IT pathway) or trade credential prep",
      cost: "Free for qualifying participants",
    },
    curriculum: [
      {
        week: 1,
        title: "Foundations & Your Path Forward Plan",
        topics: [
          "Orientation: three pathways, one brotherhood",
          "Pick your lane: IT, Trades, or Auto/EV",
          "Build your Path Forward Plan with your case worker",
          "Meet Travis, your 24/7 AI mentor",
        ],
      },
      {
        week: 2,
        title: "Core Skills I",
        topics: [
          "IT lane: hardware, operating systems, troubleshooting",
          "Trades lane: tools, materials, safety, and code basics",
          "Auto/EV lane: shop fundamentals and diagnostics",
          "Leadership thread: goals, habits, and accountability",
        ],
      },
      {
        week: 3,
        title: "Core Skills II",
        topics: [
          "IT lane: networking fundamentals and how the internet actually works",
          "Trades lane: plumbing systems and installation",
          "Auto/EV lane: engines, brakes, and electrical systems",
          "Leadership thread: money talk, financial literacy for fathers",
        ],
      },
      {
        week: 4,
        title: "Guest Speaker Series Begins",
        topics: [
          "Industry guests: how they broke in, what they'd do differently",
          "IT lane: servers and operating systems in the real world",
          "Trades & Auto lanes: a day in the life, unfiltered",
          "Leadership thread: asking questions like you belong (you do)",
        ],
      },
      {
        week: 5,
        title: "Hands-On Labs",
        topics: [
          "IT lane: build and configure a real network",
          "Trades lane: supervised install projects",
          "Auto/EV lane: live vehicle diagnostics",
          "Leadership thread: communication and conflict resolution",
        ],
      },
      {
        week: 6,
        title: "Inside the Industry",
        topics: [
          "IT lane: data center field experience, where the internet lives",
          "Trades lane: job-site walkthroughs with working pros",
          "Auto/EV lane: shop visits and service-bay shadowing",
          "Leadership thread: showing your kids what work looks like",
        ],
      },
      {
        week: 7,
        title: "The Future of Your Field",
        topics: [
          "IT lane: security, cloud, and AI on the job",
          "Trades lane: smart-building and green plumbing tech",
          "Auto/EV lane: EV batteries, charging, and high-voltage safety",
          "Leadership thread: being the example your kids study",
        ],
      },
      {
        week: 8,
        title: "Beyond Entry Level",
        topics: [
          "IT lane: the road from help desk to network & systems engineer",
          "Trades lane: from apprentice to journeyman to your own truck",
          "Auto/EV lane: master tech, shop lead, shop owner",
          "Leadership thread: thinking two moves ahead",
        ],
      },
      {
        week: 9,
        title: "Certification Prep I",
        topics: [
          "IT lane: CompTIA ITF+ deep prep and practice exams",
          "Trades & Auto lanes: credential prep and skills checks",
          "Study crew sessions: nobody preps alone",
          "Leadership thread: handling pressure without passing it down",
        ],
      },
      {
        week: 10,
        title: "Certification Prep II & Portfolio",
        topics: [
          "Practice exams until they stop being scary",
          "Portfolio: document what you can actually do",
          "Mock interviews with industry volunteers",
          "Leadership thread: telling your story with confidence",
        ],
      },
      {
        week: 11,
        title: "Career Launch",
        topics: [
          "Resume and LinkedIn built with AI tools",
          "Meet employers and apprenticeship programs face to face",
          "Negotiation: know your worth, then ask for it",
          "Leadership thread: legacy planning",
        ],
      },
      {
        week: 12,
        title: "Graduation & Beyond",
        topics: [
          "Capstone presentations to family and community",
          "Graduation ceremony: bring the kids, they earned this too",
          "Alumni network and continued mentorship",
          "Your next milestone, on the calendar before you leave",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎓",
        title: "A Real Credential",
        description:
          "CompTIA ITF+ prep on the IT lane, or trade credential prep on yours: proof, on paper, that you put in the work.",
      },
      {
        icon: "🗺️",
        title: "Path Forward Plan",
        description:
          "A personal roadmap covering career, family, and finances, built with your case worker and tracked with Travis.",
      },
      {
        icon: "🤝",
        title: "A Crew for Life",
        description:
          "Your cohort, our alumni network, guest speakers who take your calls, and mentors who've walked the same road.",
      },
      {
        icon: "💼",
        title: "Job-Ready Portfolio",
        description:
          "Resume, interview reps, and direct introductions to employers and apprenticeship programs.",
      },
    ],
    testimonial: {
      quote:
        "I came in thinking I was too old to start over. Twelve weeks later my son watched me walk across a stage. Now he tells everybody his dad works on electric cars.",
      name: "Marcus J.",
      role: "Father Forward Graduate, Auto & EV Pathway",
    },
  },

  "tech-ready-youth": {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "Build the Future With Your Own Hands",
    audience: "youth",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "🤖",
    heroImage: "/images/future/pillar-future-tech.jpg",
    heroDescription:
      "Robots you build, AI you get to boss around, designs you print. Then a capstone gaming tournament to put it all on the line.",
    overview: [
      "Talent is everywhere, exposure isn't. Over 8 weeks, youth 16 and up build and program robots, direct AI tools instead of scrolling past them, 3D-print their own designs, and track the satellites passing over their neighborhood.",
      "It closes with a capstone gaming tournament on machines they helped configure, with the community cheering them on. Free for qualifying participants, and proof they can finish what they start.",
    ],
    atAGlance: {
      duration: "8 weeks",
      format: "Hybrid (labs + online)",
      schedule: "After school & Saturdays",
      certification: "Google IT Support Certificate prep",
      ageRange: "16+",
      cost: "Free for qualifying participants",
    },
    curriculum: [
      {
        week: 1,
        title: "Welcome to the Future",
        topics: [
          "Tour of the tech: robots, printers, AI, and orbit",
          "How the internet actually works",
          "Set your 8-week build goal",
        ],
      },
      {
        week: 2,
        title: "Hardware, Opened Up",
        topics: [
          "Tear down and rebuild a PC",
          "Components, from silicon to screen",
          "Troubleshooting like a technician",
        ],
      },
      {
        week: 3,
        title: "Robotics I",
        topics: [
          "Assemble your team's robot",
          "Sensors, motors, and logic",
          "First autonomous run",
        ],
      },
      {
        week: 4,
        title: "AI as a Tool, Not a Toy",
        topics: [
          "Prompting and directing AI for real work",
          "Build a project with AI as your assistant",
          "Where AI careers are heading",
        ],
      },
      {
        week: 5,
        title: "3D Printing & Design",
        topics: [
          "Design in CAD, print on Bambu Lab machines",
          "Iterate: fail fast, print again",
          "Print a part for your robot",
        ],
      },
      {
        week: 6,
        title: "Networks & the Sky",
        topics: [
          "Networking fundamentals, hands-on",
          "Low Earth orbit: track live satellites overhead",
          "How space internet reaches underserved places",
        ],
      },
      {
        week: 7,
        title: "Certification & Careers",
        topics: [
          "Google IT Support Certificate prep",
          "Meet young professionals who started here",
          "Resumes, portfolios, and next steps",
        ],
      },
      {
        week: 8,
        title: "Capstone Gaming Tournament",
        topics: [
          "Configure the rigs, run the network",
          "Tournament day, community invited",
          "Graduation and what comes next",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🤖",
        title: "Projects You Built",
        description:
          "A robot your team programmed, parts you printed, and an AI project with your name on it.",
      },
      {
        icon: "🎓",
        title: "Certificate Momentum",
        description:
          "Google IT Support Certificate prep and a study plan to finish it.",
      },
      {
        icon: "🏆",
        title: "Capstone Tournament",
        description:
          "A community gaming event you help produce, then compete in.",
      },
      {
        icon: "🧭",
        title: "A Map to a Career",
        description:
          "Exposure to five future-facing fields and mentors inside each one.",
      },
    ],
    testimonial: {
      quote:
        "I thought coding was for other people. Then our robot finished the maze on my code. Mine. I haven't stopped building since.",
      name: "Jaylen T.",
      role: "Tech-Ready Youth Graduate, 17",
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
    heroImage: "/images/future/program-3dprint-kids.jpg",
    heroDescription:
      "Kids write the story of who they'll become, illustrate it with AI, publish it as a real book with their name on the cover, and 3D-print a piece of that future to take home.",
    overview: [
      "Kids write a story about their future self, illustrate it with AI art tools, and publish it as a real book with their name on the cover. Then they 3D-print an object straight out of that future: the firefighter's helmet, the astronaut's rocket, the engineer's robot.",
      "Parents and dads are welcome in the room. Half the magic is watching your kid become a published author before dinnertime.",
    ],
    atAGlance: {
      duration: "Single-day workshop",
      format: "In-person",
      schedule: "Weekends, year-round",
      ageRange: "Ages 6–12",
      cost: "Free at community events; $100/$200 private plans",
    },
    curriculum: [
      {
        phase: "Imagine",
        title: "The Story",
        topics: [
          "Who are you at 25? Write it down",
          "Story circles: share it out loud",
        ],
      },
      {
        phase: "Create",
        title: "The Design",
        topics: [
          "Illustrate your future with AI tools",
          "Design your object in kid-friendly CAD",
        ],
      },
      {
        phase: "Print",
        title: "The Proof",
        topics: [
          "Watch it print, layer by layer",
          "Take your future home with you",
        ],
      },
    ],
    deliverables: [
      {
        icon: "📖",
        title: "A Published Book",
        description: "Their future, written and illustrated with AI as the art department, with their name on the cover.",
      },
      {
        icon: "🚀",
        title: "A 3D-Printed Keepsake",
        description: "One object from their future self, printed and kept.",
      },
      {
        icon: "💡",
        title: "A New Default",
        description: "The quiet belief that technology is theirs to use.",
      },
    ],
    testimonial: {
      quote:
        "He printed a stethoscope. Six years old. Every night since, he tells me goodnight, Dad. Doctor Malik has patients in the morning.",
      name: "James H.",
      role: "Father of a Stories from My Future Kid",
    },
  },

};

export function getProgramBySlug(slug: string): ProgramDetail | undefined {
  return PROGRAM_DETAILS[slug];
}

export function getAllProgramSlugs(): string[] {
  return Object.keys(PROGRAM_DETAILS);
}
