// Umbrella programs. Father Forward and Tech-Ready Youth are not single classes;
// each is an umbrella over several distinct sub-programs (which live in
// lib/data/programs.ts as ProgramDetail entries and get their own pages).
// An umbrella page introduces the umbrella and links out to each program.

export interface UmbrellaProgramCard {
  /** Links to /programs/[slug] — a ProgramDetail page. */
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  /** Small badge, e.g. "Certification Course · 12 Weeks". */
  kind: string;
  image: string;
  imageAlt: string;
  /** FFIconName. */
  icon: string;
}

export interface UmbrellaDetail {
  slug: string;
  name: string;
  kicker: string;
  pillar: string;
  audience: "fathers" | "youth";
  tagline: string;
  heroImage: string;
  heroDescription: string;
  overview: string[];
  programsEyebrow: string;
  programsTitle: string;
  programsIntro: string;
  programs: UmbrellaProgramCard[];
  sponsorCta?: boolean;
}

export const UMBRELLAS: Record<string, UmbrellaDetail> = {
  "father-forward": {
    slug: "father-forward",
    name: "Father Forward",
    kicker: "For Fathers",
    pillar: "Career Forward",
    audience: "fathers",
    tagline: "Career. Leadership. Brotherhood.",
    heroImage: "/images/future/program-it-pathway.jpg",
    heroDescription:
      "Father Forward is the umbrella over everything we do for dads: a certification course that launches a tech career, hands-on programs that build real skills, and a brotherhood that keeps showing up. Pick a program, or walk through all of them. Every one is free.",
    overview: [
      "Father Forward is built on one belief: the fastest way to change a family's future is to move its father forward. It isn't a single class. It's a set of programs, each one designed to advance a father's career, sharpen his leadership, and put real people in his corner.",
      "Start with IT & Cybersecurity Foundations and earn your first credential. Come to Networking Live and build a real network with your hands. Step onto The Security Path and open the door to a security career. Come for one. Stay for all of them. Travis, our AI mentor, is on call the whole way.",
      "For a company, this is more than goodwill. It's a pipeline of certified, motivated talent and a direct line into the neighborhoods you say you want to reach. Sponsor a program, send a speaker, host a visit, or hire a graduate, and your name goes on a father's fresh start.",
    ],
    programsEyebrow: "The Programs",
    programsTitle: "Three ways forward, one brotherhood.",
    programsIntro:
      "Each is a real program with its own focus. Click any one to see exactly what a father walks away with.",
    programs: [
      {
        slug: "it-foundations",
        name: "IT & Cybersecurity Foundations",
        tagline: "Your first cert. Your next career.",
        kind: "Certification Course · 12 Weeks",
        blurb:
          "Earn your CompTIA Tech+, stand inside a real data center, and start the climb from help desk to network engineer.",
        image: "/images/future/program-it-pathway.jpg",
        imageAlt: "A father in IT training, hands-on with networks and hardware",
        icon: "certificate",
      },
      {
        slug: "networking-live",
        name: "Networking Live",
        tagline: "Build it. Then watch it work.",
        kind: "Hands-On + Field Trip",
        blurb:
          "Learn networking over lunch, build a live demo rig that sends video over ethernet, then tour the Cosm LED dome in Inglewood.",
        image: "/images/programs/ff-event-networking.jpg",
        imageAlt:
          "Black fathers building network cables and a demo rig with synced displays",
        icon: "network",
      },
      {
        slug: "security-path",
        name: "The Security Path",
        tagline: "Safety first. Career next.",
        kind: "Safety Training + Career Door",
        blurb:
          "Certified safety training with Swift Security Solutions that opens the door to an armed-security career. Targets are donated e-waste.",
        image: "/images/programs/ff-event-security.jpg",
        imageAlt:
          "A proud man in a security uniform with safety glasses beside a certified instructor at a range",
        icon: "bolt",
      },
    ],
    sponsorCta: true,
  },

  "tech-ready-youth": {
    slug: "tech-ready-youth",
    name: "Tech-Ready Youth",
    kicker: "For Kids & Youth",
    pillar: "Future Builders",
    audience: "youth",
    tagline: "The Future, in Their Hands.",
    heroImage: "/images/future/pillar-future-tech.jpg",
    heroDescription:
      "Tech-Ready Youth is the umbrella over how we spark the next generation. One program puts real technology in their hands and takes them inside a real tech company. The other turns their imagination into a story and a 3D-printed hero they take home. Both prove the future belongs to them.",
    overview: [
      "The first time a kid sees the future up close, everything changes. Tech-Ready Youth is how we make that moment happen, through two programs built around curiosity, creativity, and encouragement.",
      "In Future Tech Lab, young people build robots, direct AI, print their own designs, and step inside a real tech company to meet the people who do this for a living. In Stories from My Future, kids invent a hero, write a full story with an AI partner, and watch it become a figure they can hold. Pick one, or do both.",
    ],
    programsEyebrow: "The Programs",
    programsTitle: "Two doors into what's next.",
    programsIntro:
      "Each is its own program. Click to see what a young person builds, makes, and takes home.",
    programs: [
      {
        slug: "future-tech-lab",
        name: "Future Tech Lab",
        tagline: "Get your hands on the future.",
        kind: "Intro to Tech · 8 Weeks",
        blurb:
          "Robots, AI, 3D printing, and satellites in real hands, plus a field trip inside a real tech company and a capstone gaming tournament.",
        image: "/images/programs/try-facility.jpg",
        imageAlt:
          "Teenagers on a field trip inside a tech company with an engineer showing them equipment",
        icon: "robot",
      },
      {
        slug: "stories-from-my-future",
        name: "Stories from My Future",
        tagline: "Dream it. Write it. Hold it.",
        kind: "Creative Writing · AI + 3D Printing",
        blurb:
          "Kids invent a hero, build a full story with an AI writing partner, then 3D-print their character to take home along with their digital story.",
        image: "/images/programs/sfmf-character.jpg",
        imageAlt:
          "A kid drawing their own original hero character at a creative writing workshop",
        icon: "spark",
      },
    ],
    sponsorCta: true,
  },
};

export function getUmbrellaBySlug(slug: string): UmbrellaDetail | undefined {
  return UMBRELLAS[slug];
}

export function isUmbrellaSlug(slug: string): boolean {
  return slug in UMBRELLAS;
}

export function getAllUmbrellaSlugs(): string[] {
  return Object.keys(UMBRELLAS);
}
