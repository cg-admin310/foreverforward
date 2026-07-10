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
      "Twelve weeks of career training built for dads, by a dad. Pick your lane: IT & cybersecurity, plumbing & skilled trades, or auto & EV mechanics. Then walk out with a real credential, real confidence, and a crew that's got your back.",
    overview: [
      "Let's be honest: nobody hands fathers a manual. Father Forward is the next best thing. It's our flagship program, built by a dad from Compton who figured out that the fastest way to change a family's future is to hand its father a career. Not a gig. Not a hustle. A career.",
      "You pick one of three lanes. IT & Cybersecurity starts with CompTIA ITF+ certification and goes way past help desk. You'll get inside real data centers, learn how networks actually run the world, and see the road to network engineer and systems engineer laid out in front of you. Plumbing & Skilled Trades gets you apprenticeship-ready in the work that keeps every city standing. Auto & EV Mechanics puts you under the hood of the electric future every shop is scrambling to hire for.",
      "Every week you'll hear from guest speakers who work in these industries right now, people who'll tell you the truth about what the work is like and how they got in. And whichever lane you pick, the leadership thread runs through all twelve weeks: goals, money, showing up for your kids, and a Path Forward Plan you build with us. Travis, our AI mentor, is on call 24/7 for the midnight study sessions and the pre-interview pep talks.",
      "One more thing, because it matters: we're not looking for perfect. Show up, put in the reps, let your cohort hold you down. Progress over perfection, every single week.",
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
          "CompTIA ITF+ prep and exam support on the IT lane, or trade credential prep on yours. Proof, on paper, that you put in the work.",
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
      "Robots you build. AI you get to boss around. Real hardware, real projects, and a capstone gaming tournament to put it all on the line.",
    overview: [
      "Tech-Ready Youth exists because talent is everywhere but exposure isn't. Most of our young people have never watched a robot respond to their own code, or seen a 3D printer turn their idea into something they can hold. One afternoon with those tools and the question flips from \"could I ever?\" to \"what's next?\"",
      "Over 8 weeks, youth 16 and up go hands-on with the technologies that will define their generation: building and programming robots, directing AI tools instead of just scrolling past them, printing their own designs, and tracing the satellites passing over their neighborhood every 90 minutes.",
      "The program closes with a capstone gaming tournament: machines they helped configure, brackets they run, and a community cheering them on. Skills, confidence, and proof they can finish what they start.",
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

  "making-moments": {
    slug: "making-moments",
    name: "Making Moments",
    tagline: "Joy Is a Strategy",
    audience: "families",
    duration: "Ongoing",
    format: "In-person",
    icon: "❤️",
    heroImage: "/images/future/pillar-moments.jpg",
    heroDescription:
      "Dinner-and-a-movie nights, robot races in the park, festivals where dads and kids show up as a team. The memories that hold families together, made on purpose.",
    overview: [
      "Programs build skills. Moments build families. Making Moments is our ongoing series of community experiences built on one truth: a father and child who laugh together, build together, and celebrate together grow stronger together. That's not a slogan. That's the whole strategy.",
      "Our signature Movies on the Menu nights pair a family dinner with a film under the stars: no cost, no catch, just an evening designed so a dad can be fully present. Around it we run robot races, 3D-printing pop-ups, stargazing and satellite-spotting nights, and an annual festival that turns a neighborhood park into a glimpse of the future.",
      "Every event is a doorway. A family comes for the movie, and leaves knowing there's a career program for dad, a robotics lab for the kids, and a community that wants them both to win.",
    ],
    atAGlance: {
      duration: "Ongoing, multiple events monthly",
      format: "In-person, across Greater LA",
      schedule: "Evenings & weekends",
      cost: "Free, dinner included",
    },
    curriculum: [
      {
        phase: "Signature",
        title: "Movies on the Menu",
        topics: [
          "Family dinner and a movie under the stars",
          "Father-focused: designed for presence, not programming",
          "Community resource tables: no pressure, just doors",
        ],
      },
      {
        phase: "Hands-On",
        title: "Future Tech Pop-Ups",
        topics: [
          "Robot races and build stations",
          "3D-printing corners: design it, print it, keep it",
          "AI photo booths and creative stations",
        ],
      },
      {
        phase: "Look Up",
        title: "Night Sky & Orbit Nights",
        topics: [
          "Telescopes and satellite tracking with the kids",
          "Watch the ISS pass over your own block",
          "The story of who builds what's up there",
        ],
      },
      {
        phase: "Annual",
        title: "Forever Forward Festival",
        topics: [
          "A neighborhood park becomes a future fair",
          "Graduations celebrated in public, out loud",
          "Partners, food, music, and family",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🍿",
        title: "Movies on the Menu",
        description:
          "Our signature dinner-and-a-movie series for fathers and their kids.",
      },
      {
        icon: "🤖",
        title: "Tech the Kids Can Touch",
        description:
          "Robots, printers, and telescopes at every event. Curiosity included.",
      },
      {
        icon: "📸",
        title: "Memories on Purpose",
        description:
          "Photos, keepsakes, and 3D-printed mementos from every gathering.",
      },
      {
        icon: "🚪",
        title: "A Doorway In",
        description:
          "Every event connects families to programs, resources, and each other.",
      },
    ],
    testimonial: {
      quote:
        "My daughter still has the little rocket she printed at the park. It sits on her dresser. She calls it the night we saw the satellites.",
      name: "Andre W.",
      role: "Making Moments Regular",
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
      "Students write it, AI and Unreal Engine help build it, and a real festival premieres it. Filmmaking with Dawnn Lewis from first line to final cut.",
    overview: [
      "Every neighborhood is full of stories the world never hears. From Script to Screen, created in partnership with actress and producer Dawnn Lewis and A New Day Foundation, hands students the most advanced storytelling tools on earth and says: tell yours.",
      "Students move through the full production pipeline: writing their script, storyboarding with AI image tools, building worlds in Unreal Engine, and directing scenes that would have needed a studio budget five years ago. Working artists and technologists mentor every phase.",
      "It ends the way every film should: with a premiere. Our annual student film festival puts their work on a big screen in front of family, friends, and industry guests.",
    ],
    atAGlance: {
      duration: "Multi-phase (semester)",
      format: "Hybrid workshops + production labs",
      schedule: "After school & weekends",
      ageRange: "Middle & high school",
      cost: "Free for qualifying students",
    },
    curriculum: [
      {
        phase: "Phase 1",
        title: "Story",
        topics: [
          "Finding the story only you can tell",
          "Script structure and dialogue",
          "Table reads and feedback",
        ],
      },
      {
        phase: "Phase 2",
        title: "World",
        topics: [
          "Storyboarding with AI image tools",
          "Building sets in Unreal Engine",
          "Sound, light, and mood",
        ],
      },
      {
        phase: "Phase 3",
        title: "Production",
        topics: [
          "Directing and performance",
          "Virtual production techniques",
          "Editing the final cut",
        ],
      },
      {
        phase: "Phase 4",
        title: "Premiere",
        topics: [
          "Festival submission and screening",
          "Q&A with the audience",
          "Where a storytelling career starts",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎬",
        title: "A Finished Film",
        description: "A real short film, produced start to finish by the student.",
      },
      {
        icon: "🎪",
        title: "Festival Premiere",
        description: "A big-screen debut at our annual student film festival.",
      },
      {
        icon: "🛠️",
        title: "Studio-Grade Skills",
        description: "Unreal Engine, AI-assisted production, and editing experience.",
      },
      {
        icon: "🌟",
        title: "Industry Mentors",
        description: "Guidance from working artists, led by Dawnn Lewis.",
      },
    ],
    testimonial: {
      quote:
        "Seeing my film on that screen with my mom in the audience... I can't even describe it. I'm writing my next one already.",
      name: "Destiny R.",
      role: "From Script to Screen Filmmaker, 16",
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
      "Ask a kid what they want to be, and you get an answer. Ask them to hold it in their hands, and you get a believer. Stories from My Future is a workshop where kids write a story about their future self, illustrate it with AI art tools, and publish it as a real book, author credit and all. Then they 3D-print an object straight out of that future on Bambu Lab printers.",
      "A future firefighter prints her helmet. A future astronaut prints his rocket. A future engineer prints the robot she'll build one day. The book goes on the shelf, the object goes on the dresser, and the belief goes everywhere with them.",
      "Parents and dads are welcome in the room. Honestly, half the magic is watching your kid become a published author before dinnertime.",
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
      "A gamified STEM platform with AI-powered tutoring, where leveling up in the game means leveling up in real life.",
    overview: [
      "LULA, short for Level Up Learning Academy, is our answer to a simple observation: kids will grind for hours to level up a character, so we built a world where the character they're leveling up is themselves.",
      "LULA wraps real STEM learning in game mechanics: quests, streaks, boss challenges, and unlockables. An AI tutor adapts to each learner, explaining concepts as many times and as many ways as it takes, with infinite patience.",
      "Because it's online, LULA travels anywhere: a phone on the bus, a laptop at the library, a family computer at grandma's. Learning that meets kids exactly where they are.",
    ],
    atAGlance: {
      duration: "Ongoing, self-paced",
      format: "Online: phone, tablet, or computer",
      schedule: "Anytime",
      ageRange: "Ages 8–16",
      cost: "Free for enrolled families",
    },
    curriculum: [
      {
        phase: "Explore",
        title: "STEM Quests",
        topics: [
          "Math, science, and coding quest lines",
          "Real-world projects between levels",
        ],
      },
      {
        phase: "Practice",
        title: "AI Tutor",
        topics: [
          "One-on-one help, infinite patience",
          "Adapts to how each kid learns",
        ],
      },
      {
        phase: "Compete",
        title: "Challenges & Streaks",
        topics: [
          "Boss challenges and leaderboards",
          "Streaks that reward showing up",
        ],
      },
    ],
    deliverables: [
      {
        icon: "🎮",
        title: "Learning That Feels Like Play",
        description: "Game mechanics wrapped around real STEM mastery.",
      },
      {
        icon: "🤖",
        title: "An AI Tutor",
        description: "Personal help that never runs out of patience or time.",
      },
      {
        icon: "📈",
        title: "Visible Progress",
        description: "Dashboards for students and parents to track learning.",
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
