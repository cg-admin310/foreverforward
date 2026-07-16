// Detailed program data for individual program pages

export type ProgramAudience = "fathers" | "youth" | "families" | "kids" | "students";

/**
 * A single event or experience inside a program. Programs are umbrellas: a slate
 * of these events is what makes up Father Forward or Tech-Ready Youth. One event
 * can be flagged `flagship` to render larger with imagery.
 */
export interface ProgramEvent {
  name: string;
  /** Small badge, e.g. "Flagship · 12-Week Course", "Field Experience". */
  kind: string;
  description: string;
  /** FFIconName. */
  icon: string;
  flagship?: boolean;
  image?: string;
  imageAlt?: string;
  /** Short scannable bullets, used on featured (image) event cards. */
  highlights?: string[];
}

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
  // The events/experiences that make up the program. When present, they render
  // as a dedicated section framing the program as more than one class.
  eventsEyebrow?: string;
  eventsTitle?: string;
  eventsIntro?: string;
  events?: ProgramEvent[];
  // Optional framing for the curriculum timeline (defaults handle the rest).
  curriculumEyebrow?: string;
  curriculumTitle?: string;
  curriculumSubtitle?: string;
  // When true, render a "For Partners & Sponsors" call to action on the page.
  sponsorCta?: boolean;
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
  "it-foundations": {
    slug: "it-foundations",
    name: "IT & Cybersecurity Foundations",
    tagline: "Your First Cert. Your Next Career.",
    audience: "fathers",
    duration: "12 weeks",
    format: "Hybrid",
    icon: "certificate",
    heroImage: "/images/future/program-it-pathway.jpg",
    heroDescription:
      "Twelve weeks of free, hands-on IT training built around a father's real life. Earn your CompTIA Tech+, stand inside a working data center, and walk out with a credential, a portfolio, and a room full of people in your corner. IT is the first track. HVAC, auto, and the trades are next.",
    overview: [
      "IT & Cybersecurity Foundations is the flagship program inside Father Forward, built on one belief: the fastest way to change a family's future is to hand its father a real career. Right now, that career is IT. You'll earn your CompTIA Tech+, learn how networks actually run the world, stand inside a working data center, and see the road from help desk to network and systems engineer laid out clearly in front of you.",
      "Every week brings guest speakers who do this work today, a leadership thread on goals, money, and showing up for your kids, and Travis, our AI mentor, on call around the clock. It's completely free, and IT is only the first track. HVAC, auto and EV, and the skilled trades are coming next.",
      "For a company, this is more than goodwill. It's a pipeline of certified, motivated talent and a direct line into the neighborhoods you say you want to reach. Sponsor a cohort, send a speaker, or hire a graduate, and your name goes on a father's fresh start.",
    ],
    atAGlance: {
      duration: "12 weeks",
      format: "Hybrid (in-person labs + online)",
      schedule: "Evenings & Saturdays, built around work and kids",
      certification: "CompTIA Tech+ certification prep",
      cost: "Free for qualifying participants",
    },
    sponsorCta: true,
    curriculumEyebrow: "The Course",
    curriculumTitle: "Plotted week by week,",
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
          "What comes after Tech+ (A+, Network+, and up)",
          "Specializing: security, cloud, or infrastructure",
          "Leadership thread: thinking two moves ahead",
        ],
      },
      {
        week: 9,
        title: "Tech+ Certification Prep I",
        topics: [
          "CompTIA Tech+ deep prep and practice exams",
          "Knock out the topics that scare you",
          "Study crew sessions: nobody preps alone",
          "Leadership thread: handling pressure without passing it down",
        ],
        image: "/images/programs/ff-certprep.jpg",
        imageAlt: "A study group of fathers around a table with laptops and notebooks, prepping for their Tech+ exam together",
      },
      {
        week: 10,
        title: "Tech+ Prep II & Portfolio",
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
        title: "CompTIA Tech+",
        description:
          "Certification prep and exam support for CompTIA Tech+, your first real credential in tech.",
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
        "I came in not knowing what an IP address was. Twelve weeks later I passed my Tech+ and my son watched me walk across a stage. Now he tells everybody his dad works in tech.",
      name: "Marcus J.",
      role: "IT & Cybersecurity Foundations Graduate",
    },
  },

  "networking-live": {
    slug: "networking-live",
    name: "Networking Live",
    tagline: "Build It. Then Watch It Work.",
    audience: "fathers",
    duration: "Half-day",
    format: "Hands-On + Field Trip",
    icon: "network",
    heroImage: "/images/programs/ff-event-networking.jpg",
    heroDescription:
      "A hands-on day where dads learn how networks really work, build a live demo rig that sends video over ethernet until every screen lights up in sync, then head to Cosm in Inglewood to see that exact skill powering one of the wildest LED screens on earth.",
    overview: [
      "Networking Live turns a lunch into a launchpad. Over a meal, dads learn the real fundamentals: what an IP address is, what a router actually does, and how data moves across ethernet and fiber. No jargon, no lecture. Just the stuff that runs the modern world, explained like you belong in the room, because you do.",
      "Then it gets physical. With mentors from the field, each dad builds and tests a working network, wiring up a live demo rig that pushes video over ethernet across displays until they all move as one. From there, we roll to Cosm in Inglewood for a behind-the-scenes look at how a massive LED dome is run, and dads see the exact skill they just learned powering it. Suddenly a tech career isn't a far-off idea. It's a room they're standing in.",
    ],
    atAGlance: {
      duration: "Half-day experience",
      format: "Hands-on + field trip",
      schedule: "Scheduled cohorts, evenings & weekends",
      cost: "Free for qualifying participants",
    },
    sponsorCta: true,
    curriculumEyebrow: "How the Day Flows",
    curriculumTitle: "One day, start to finish,",
    curriculum: [
      {
        phase: "Learn",
        title: "How Networks Really Work",
        topics: [
          "What an IP address is and what a router actually does",
          "Ethernet vs. fiber, and how data really moves",
          "Lunch, fellowship, and zero jargon",
        ],
      },
      {
        phase: "Build",
        title: "Wire Up a Live Rig",
        topics: [
          "Build and test your own network cable",
          "Send video over ethernet across synced displays",
          "Break it, fix it, and prove it works",
        ],
        image: "/images/programs/ff-event-networking.jpg",
        imageAlt:
          "Black fathers building network cables and a demo rig with bright synced displays at a lunch-and-learn",
      },
      {
        phase: "See It Live",
        title: "Inside the Cosm Dome",
        topics: [
          "Behind-the-scenes tour at Cosm in Inglewood",
          "See the skill you just learned running a giant LED screen",
          "Meet people who do this for a living",
        ],
      },
    ],
    deliverables: [
      {
        icon: "network",
        title: "A Network You Built",
        description:
          "You wired it, tested it, and watched it carry live video. That's a real skill, in your hands.",
      },
      {
        icon: "compass",
        title: "A Look Inside Cosm",
        description:
          "A behind-the-scenes tour of one of the most advanced screens on earth, and how it's run.",
      },
      {
        icon: "briefcase",
        title: "A Career Connection",
        description:
          "A clear line from what you built to the jobs that pay for it, plus the people who hire for them.",
      },
      {
        icon: "crew",
        title: "The Brotherhood",
        description:
          "A day with mentors and other dads who show up, and keep showing up.",
      },
    ],
    testimonial: {
      quote:
        "I made a cable, plugged it in, and every screen lit up together. Then we're standing in Cosm looking at the same thing on a screen the size of a building. My son will not stop talking about it.",
      name: "Andre P.",
      role: "Networking Live participant",
    },
  },

  "security-path": {
    slug: "security-path",
    name: "The Security Path",
    tagline: "Safety First. Career Next.",
    audience: "fathers",
    duration: "One-day",
    format: "Safety Training + Career",
    icon: "bolt",
    heroImage: "/images/programs/ff-event-security.jpg",
    heroDescription:
      "A safety-first day built with Swift Security Solutions that opens the door to a real career in armed security. Certified training, discipline and respect on every rep, and targets made of donated e-waste, old office gear destroyed for good.",
    overview: [
      "The Security Path is about a real doorway to a career. Built with Swift Security Solutions, it starts where every professional starts: safety. Dads learn the fundamentals with a certified instructor, the four safety rules, safe handling, and the discipline the job demands, before anything else happens.",
      "From there it becomes a day of focus, respect, and brotherhood, and a real look at what an armed-security career takes and pays. The targets? Donated e-waste from organizations retiring old office equipment, hard drives and hardware destroyed for good. A career door for the dads, a clean data-disposal win for our partners, and a story everybody takes home.",
    ],
    atAGlance: {
      duration: "One-day experience",
      format: "Safety training + career door",
      schedule: "Scheduled cohorts",
      cost: "Free for qualifying participants",
    },
    sponsorCta: true,
    curriculumEyebrow: "How the Day Flows",
    curriculumTitle: "One day, start to finish,",
    curriculum: [
      {
        phase: "Safety First",
        title: "Ground Rules & Respect",
        topics: [
          "Sign in, gear up, and set expectations",
          "The four firearm-safety rules with a certified instructor",
          "Safe handling and range commands, dry practice first",
        ],
      },
      {
        phase: "The Fundamentals",
        title: "Do It Right",
        topics: [
          "Firearm parts, stance, and safe handling",
          "Supervised, one-on-one coaching",
          "Confidence built the right way",
        ],
        image: "/images/programs/ff-event-security.jpg",
        imageAlt:
          "A proud man in a professional security uniform with safety glasses beside a certified instructor at a range",
      },
      {
        phase: "The Career Door",
        title: "Where This Leads",
        topics: [
          "What an armed-security career takes and pays",
          "Start a guard-card or installer application with Swift Security",
          "Fellowship, food, and what comes next",
        ],
      },
    ],
    deliverables: [
      {
        icon: "certificate",
        title: "Certified Safety Training",
        description:
          "Hands-on firearm-safety training with a certified instructor, the foundation every security career is built on.",
      },
      {
        icon: "briefcase",
        title: "A Real Career Door",
        description:
          "A path toward armed-security and installer roles, with applications you can start on the spot.",
      },
      {
        icon: "bolt",
        title: "E-Waste, Destroyed for Good",
        description:
          "Old drives and hardware from partner orgs, wiped and physically retired. A disposal need turned into a win.",
      },
      {
        icon: "crew",
        title: "The Brotherhood",
        description:
          "A day of discipline, respect, and fellowship with dads walking the same road.",
      },
    ],
    testimonial: {
      quote:
        "I came in nervous and left with a plan. They taught safety first, treated us like men, and showed me a real career I could actually see myself in.",
      name: "Terrance W.",
      role: "The Security Path participant",
    },
  },

  "future-tech-lab": {
    slug: "future-tech-lab",
    name: "Future Tech Lab",
    tagline: "Get Your Hands on the Future",
    audience: "youth",
    duration: "8 weeks",
    format: "Hybrid",
    icon: "robot",
    heroImage: "/images/future/pillar-future-tech.jpg",
    heroDescription:
      "Eight weeks of hands-on access to the technology shaping tomorrow: robots you build, AI you direct, designs you print, satellites you track. Plus a field trip inside a real tech company to meet the people who do this for a living. It all ends with a capstone gaming tournament on machines you set up yourself.",
    overview: [
      "Talent is everywhere. Access isn't. Future Tech Lab throws the doors wide open. Over eight weeks, young people get their hands on the tools most kids only ever see on a screen: they build and program robots, direct AI instead of scrolling past it, design and 3D-print their own creations, and track the satellites crossing their own sky.",
      "The heart of it is exposure. We take the whole crew inside a real tech company, one of our sponsors, to see the machines up close and meet the engineers, builders, and creatives who run them. Suddenly a career in tech stops being a far-off idea. It becomes a real person, doing real work, in a room these kids are standing in.",
      "It all builds to a capstone gaming tournament on rigs they set up themselves, with the whole community cheering them on. Free for qualifying participants, and proof that this world is theirs to step into.",
    ],
    atAGlance: {
      duration: "8 weeks",
      format: "Hybrid (labs + a tech sponsor site visit)",
      schedule: "After school & Saturdays",
      ageRange: "16+",
      cost: "Free for qualifying participants",
    },
    sponsorCta: true,
    eventsEyebrow: "The Experiences",
    eventsTitle: "Every week, a new piece of the future in their hands.",
    eventsIntro:
      "Future Tech Lab is a program of experiences, each one built to spark curiosity and prove that this world belongs to them too. Innovation you can touch, encouragement at every step.",
    events: [
      {
        name: "Inside a Tech Company",
        kind: "Field Trip",
        description:
          "Go behind the scenes at a real tech sponsor, see the machines up close, and meet the engineers and creatives who do this for a living.",
        icon: "briefcase",
        flagship: true,
        image: "/images/programs/try-facility.jpg",
        imageAlt:
          "Teenagers on a field trip inside a tech company, an engineer showing them advanced equipment",
      },
      {
        name: "Build-a-Bot Robotics",
        kind: "Hands-On Lab",
        description:
          "Assemble and program a robot with your crew, then watch your own code make it move.",
        icon: "robot",
      },
      {
        name: "Direct the AI Studio",
        kind: "Creative Lab",
        description:
          "Stop scrolling past AI and start steering it, building real projects in your own words.",
        icon: "chip",
      },
      {
        name: "Design & Print Shop",
        kind: "Maker Lab",
        description:
          "Turn an idea in your head into something you can hold, printed on real 3D machines.",
        icon: "printer3d",
      },
      {
        name: "Satellite Night",
        kind: "Field Experience",
        description:
          "Track live satellites crossing your own sky and see how space internet reaches neighborhoods like ours.",
        icon: "satellite",
      },
      {
        name: "Capstone Gaming Tournament",
        kind: "Community Event",
        description:
          "Set up the rigs, run the network, then compete with the whole community cheering you on.",
        icon: "trophy",
      },
    ],
    curriculumEyebrow: "The 8-Week Journey",
    curriculumTitle: "Eight weeks of hands on the future,",
    curriculum: [
      {
        week: 1,
        title: "Welcome to the Future",
        topics: [
          "Tour of the tech: robots, printers, AI, and orbit",
          "How the technology around you actually works",
          "Set what you want to explore over 8 weeks",
        ],
      },
      {
        week: 2,
        title: "Hardware, Opened Up",
        topics: [
          "Tear down and rebuild a PC",
          "Components, from silicon to screen",
          "See how the machines are really put together",
        ],
      },
      {
        week: 3,
        title: "Robotics",
        topics: [
          "Assemble and program your team's robot",
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
          "Direct AI to do real work, in your own words",
          "Build a project with AI as your assistant",
          "See where AI shows up in real jobs",
        ],
      },
      {
        week: 5,
        title: "3D Printing & Design",
        topics: [
          "Design in CAD, print on Bambu Lab machines",
          "Iterate: fail fast, print again",
          "Turn an idea in your head into something you can hold",
        ],
        image: "/images/programs/try-3dprint.jpg",
        imageAlt: "A teenager watching a desktop 3D printer mid-print with amazement as their design takes shape",
      },
      {
        week: 6,
        title: "Inside a Tech Company",
        topics: [
          "Field trip behind the scenes at a tech sponsor's facility",
          "See the real machines up close, and how they're used",
          "Meet the engineers and creatives, and the jobs they do",
        ],
        image: "/images/programs/try-facility.jpg",
        imageAlt: "Teenagers on a field trip inside a tech company, an engineer showing them advanced equipment",
      },
      {
        week: 7,
        title: "The Sky Above Us",
        topics: [
          "Networking fundamentals, hands-on",
          "Low Earth orbit: track live satellites overhead",
          "How space internet reaches places like ours",
        ],
        image: "/images/programs/try-satellite.jpg",
        imageAlt: "A teenager looking through a telescope at night, tablet in hand tracking a satellite overhead",
      },
      {
        week: 8,
        title: "Capstone Gaming Tournament",
        topics: [
          "Configure the rigs, run the network",
          "Tournament day, community invited",
          "Celebrate the crew and what comes next",
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
        icon: "briefcase",
        title: "A Look Inside the Industry",
        description:
          "A field trip through a real tech company, face to face with the people who build tomorrow.",
      },
      {
        icon: "trophy",
        title: "Capstone Tournament",
        description:
          "A community gaming event you help produce, then compete in.",
      },
      {
        icon: "compass",
        title: "A Wider Sense of What's Possible",
        description:
          "Hands-on exposure to the tools, fields, and careers most kids never get to touch.",
      },
    ],
    testimonial: {
      quote:
        "I thought coding was for other people. Then our robot finished the maze on my code. Mine. I haven't stopped building since.",
      name: "Jaylen T.",
      role: "Future Tech Lab Graduate, 17",
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
