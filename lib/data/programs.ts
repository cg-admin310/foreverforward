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
    image?: string;
    imageAlt?: string;
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
    tagline: "Your First Cert. Your Next Career.",
    audience: "fathers",
    duration: "12 weeks",
    format: "Hybrid",
    icon: "briefcase",
    heroImage: "/images/future/program-it-pathway.jpg",
    heroDescription:
      "Twelve weeks of free IT training built for fathers. Earn your CompTIA ITF+, get real data center time, and walk out with a credential, a portfolio, and a community behind you. This track is IT. HVAC, auto, and the trades are next.",
    overview: [
      "Father Forward is our flagship program, built on a simple idea: the fastest way to change a family's future is to hand its father a real career. Right now, that career is IT. You'll earn your CompTIA ITF+, learn how networks actually run the world, get inside a working data center, and see the road from help desk to network and systems engineer laid out in front of you.",
      "Every week brings guest speakers who do this work today, a leadership thread on goals, money, and showing up for your kids, and Travis, our AI mentor, on call 24/7. It's free, and IT is only the first track. HVAC, auto and EV, and the skilled trades are coming next.",
    ],
    atAGlance: {
      duration: "12 weeks",
      format: "Hybrid (in-person labs + online)",
      schedule: "Evenings & Saturdays, built around work and kids",
      certification: "CompTIA ITF+ certification prep",
      cost: "Free for qualifying participants",
    },
    curriculum: [
      {
        week: 1,
        title: "Foundations & Your Path Forward Plan",
        topics: [
          "Orientation: what a real IT career actually looks like",
          "How the internet works, top to bottom",
          "Build your Path Forward Plan with your case worker",
          "Meet Travis, your 24/7 AI mentor",
        ],
        image: "/images/programs/ff-orientation.jpg",
        imageAlt: "Fathers in a bright classroom on orientation day, laptops open, building their Path Forward Plan",
      },
      {
        week: 2,
        title: "Computer Hardware",
        topics: [
          "Inside the machine: components and assembly",
          "Peripherals, mobile devices, and storage",
          "The troubleshooting method techs actually use",
          "Leadership thread: goals, habits, and accountability",
        ],
      },
      {
        week: 3,
        title: "Operating Systems",
        topics: [
          "Windows administration, hands-on",
          "Linux and the command line, made simple",
          "Files, users, and permissions",
          "Leadership thread: money talk, financial literacy for fathers",
        ],
      },
      {
        week: 4,
        title: "Networking + Guest Speakers",
        topics: [
          "How networks move data (TCP/IP and the OSI model, made simple)",
          "Wi-Fi, switches, and routers",
          "Guest speaker: how they broke into IT",
          "Leadership thread: asking questions like you belong (you do)",
        ],
      },
      {
        week: 5,
        title: "Hands-On Labs",
        topics: [
          "Build and configure a real network",
          "Stand up and share a small server",
          "Break it, fix it, document it",
          "Leadership thread: communication and conflict resolution",
        ],
      },
      {
        week: 6,
        title: "Inside the Data Center",
        topics: [
          "Field trip: where the internet actually lives",
          "Racks, cabling, cooling, and uptime",
          "What the jobs in that building really pay",
          "Leadership thread: showing your kids what work looks like",
        ],
        image: "/images/programs/ff-datacenter.jpg",
        imageAlt: "A father standing among glowing server racks inside a real data center, looking up in awe",
      },
      {
        week: 7,
        title: "Security & the Cloud",
        topics: [
          "Security fundamentals and staying safe online",
          "Intro to the cloud (AWS and Azure basics)",
          "Where AI fits into the IT job",
          "Leadership thread: being the example your kids study",
        ],
      },
      {
        week: 8,
        title: "Beyond Help Desk",
        topics: [
          "The road: help desk to network engineer to systems engineer",
          "What comes after ITF+ (A+, Network+, and up)",
          "Specializing: security, cloud, or infrastructure",
          "Leadership thread: thinking two moves ahead",
        ],
      },
      {
        week: 9,
        title: "ITF+ Certification Prep I",
        topics: [
          "CompTIA ITF+ deep prep and practice exams",
          "Knock out the topics that scare you",
          "Study crew sessions: nobody preps alone",
          "Leadership thread: handling pressure without passing it down",
        ],
        image: "/images/programs/ff-certprep.jpg",
        imageAlt: "A study group of fathers around a table with laptops and notebooks, prepping for their ITF+ exam together",
      },
      {
        week: 10,
        title: "ITF+ Prep II & Portfolio",
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
          "Capstone: present what you built",
          "Graduation ceremony: bring the kids, they earned this too",
          "Alumni network and continued mentorship",
          "Your next cert, on the calendar before you leave",
        ],
        image: "/images/programs/ff-graduation.jpg",
        imageAlt: "A father holding his certificate on graduation day while his kids and family cheer from the front row",
      },
    ],
    deliverables: [
      {
        icon: "certificate",
        title: "CompTIA ITF+",
        description:
          "Certification prep and exam support for CompTIA ITF+, your first real credential in tech.",
      },
      {
        icon: "route",
        title: "Path Forward Plan",
        description:
          "A personal roadmap covering career, family, and finances, built with your case worker and tracked with Travis.",
      },
      {
        icon: "crew",
        title: "A Crew for Life",
        description:
          "Your cohort, our alumni network, guest speakers who take your calls, and mentors who've walked the same road.",
      },
      {
        icon: "briefcase",
        title: "Job-Ready Portfolio",
        description:
          "Resume, interview reps, and direct introductions to employers and apprenticeship programs.",
      },
    ],
    testimonial: {
      quote:
        "I came in not knowing what an IP address was. Twelve weeks later I passed my ITF+ and my son watched me walk across a stage. Now he tells everybody his dad works in tech.",
      name: "Marcus J.",
      role: "Father Forward Graduate, IT Track",
    },
  },

  "tech-ready-youth": {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    tagline: "Build the Future With Your Own Hands",
    audience: "youth",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "robot",
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
        image: "/images/programs/try-robotics.jpg",
        imageAlt: "Teenagers gathered around a table building and programming a robot together",
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
        image: "/images/programs/try-3dprint.jpg",
        imageAlt: "A teenager watching a desktop 3D printer mid-print with amazement as their design takes shape",
      },
      {
        week: 6,
        title: "Networks & the Sky",
        topics: [
          "Networking fundamentals, hands-on",
          "Low Earth orbit: track live satellites overhead",
          "How space internet reaches underserved places",
        ],
        image: "/images/programs/try-satellite.jpg",
        imageAlt: "A teenager looking through a telescope at night, tablet in hand tracking a satellite overhead",
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
        image: "/images/programs/try-tournament.jpg",
        imageAlt: "Teenagers cheering and high-fiving at a community gaming tournament with colorful RGB-lit rigs",
      },
    ],
    deliverables: [
      {
        icon: "robot",
        title: "Projects You Built",
        description:
          "A robot your team programmed, parts you printed, and an AI project with your name on it.",
      },
      {
        icon: "certificate",
        title: "Certificate Momentum",
        description:
          "Google IT Support Certificate prep and a study plan to finish it.",
      },
      {
        icon: "trophy",
        title: "Capstone Tournament",
        description:
          "A community gaming event you help produce, then compete in.",
      },
      {
        icon: "compass",
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
    tagline: "Dream it. Write it. Hold it.",
    audience: "kids",
    duration: "Workshop",
    format: "In-person",
    icon: "spark",
    heroImage: "/images/programs/sfmf-figure.jpg",
    heroDescription:
      "A creative writing adventure where kids become authors. With a mentor in their corner, they dream up a hero, build a whole story with an AI writing partner, then draw their character and watch it become a 3D-printed figure to take home, along with their finished digital story.",
    overview: [
      "Stories from My Future is a guided creative writing experience for kids. It starts with the basics: what a story even is, what makes a hero, and how a journey unfolds. A mentor is right beside them the whole way, there to encourage, spark ideas, and show them how each tool works.",
      "From there, every kid invents their own main character and dreams up the adventure. They team up with AI writing agents to shape the full story in their own words, draw their hero by hand, and use AI to turn that drawing into a 3D-printed figure. They walk out with a story they wrote and a character they can hold.",
    ],
    atAGlance: {
      duration: "Guided workshop",
      format: "In-person, mentor-led",
      schedule: "Weekends, year-round",
      ageRange: "Ages 6–12",
      cost: "Free at community events; $100/$200 private plans",
    },
    curriculum: [
      {
        phase: "Imagine",
        title: "What Makes a Story",
        topics: [
          "Meet your mentor and warm up your imagination",
          "What every story needs: a hero, a want, a journey",
          "Read, react, and dream up ideas out loud",
        ],
        image: "/images/programs/sfmf-mentor.jpg",
        imageAlt: "A mentor guiding a small group of kids through storytelling in a bright creative space",
      },
      {
        phase: "Invent",
        title: "Meet Your Hero",
        topics: [
          "Dream up your main character: name, look, and mission",
          "Draw your hero by hand, exactly how you see them",
          "Decide what adventure they're headed into",
        ],
        image: "/images/programs/sfmf-character.jpg",
        imageAlt: "A kid joyfully drawing and coloring their own original hero character at a craft table",
      },
      {
        phase: "Write",
        title: "Build the Journey",
        topics: [
          "Team up with an AI writing partner, in your own words",
          "Shape the story scene by scene, start to finish",
          "Revise it until it sounds like you",
        ],
        image: "/images/programs/sfmf-aistory.jpg",
        imageAlt: "A kid building a story with an AI writing assistant on a laptop while a mentor guides",
      },
      {
        phase: "Create",
        title: "From Drawing to Figure",
        topics: [
          "AI turns your character drawing into a 3D model",
          "Watch the printer bring your hero to life",
          "Take home your figure and your finished digital story",
        ],
        image: "/images/programs/sfmf-figure.jpg",
        imageAlt: "A kid proudly holding the colorful 3D-printed figure of the character they created",
      },
    ],
    deliverables: [
      {
        icon: "book",
        title: "A Story of Your Own",
        description: "A finished digital story you wrote yourself, with an AI partner helping at every step.",
      },
      {
        icon: "printer3d",
        title: "A 3D-Printed Hero",
        description: "The character you dreamed up and drew, printed into a figure you take home and keep.",
      },
      {
        icon: "spark",
        title: "Storyteller Skills",
        description: "You learn what a story is, how to build one, and how to make the tools work for you.",
      },
      {
        icon: "compass",
        title: "The Confidence to Create",
        description: "You carried an idea from your head all the way to something you can hold.",
      },
    ],
    testimonial: {
      quote:
        "She drew this wild three-eyed dragon, and by the end she was holding it. A real figure, straight out of her own head. She reads me her story every single night now.",
      name: "Denise R.",
      role: "Mother of a Stories from My Future author",
    },
  },

};

export function getProgramBySlug(slug: string): ProgramDetail | undefined {
  return PROGRAM_DETAILS[slug];
}

export function getAllProgramSlugs(): string[] {
  return Object.keys(PROGRAM_DETAILS);
}
