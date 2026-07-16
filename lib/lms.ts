import type { CourseLevel } from "@/types/database";

/**
 * LMS "programs" are the website programs (the units members join and courses
 * attach to), keyed by their slug. Grouped under their umbrella for display.
 */
export interface LmsProgram {
  slug: string;
  label: string;
  umbrella: string;
  audience: string;
  description: string;
}

export const LMS_PROGRAMS: LmsProgram[] = [
  {
    slug: "it-foundations",
    label: "IT & Cybersecurity Foundations",
    umbrella: "Father Forward",
    audience: "For fathers",
    description: "Earn your CompTIA Tech+ and start a real tech career.",
  },
  {
    slug: "networking-live",
    label: "Networking Live",
    umbrella: "Father Forward",
    audience: "For fathers & youth",
    description: "Learn networking hands-on and build a real home network.",
  },
  {
    slug: "security-path",
    label: "The Security Path",
    umbrella: "Father Forward",
    audience: "For fathers",
    description: "Safety training and a door into a security career.",
  },
  {
    slug: "future-tech-lab",
    label: "Future Tech Lab",
    umbrella: "Tech-Ready Youth",
    audience: "For kids & youth",
    description: "Robotics, AI, 3D printing, satellites, and a real tech-company visit.",
  },
  {
    slug: "stories-from-my-future",
    label: "Stories from My Future",
    umbrella: "Tech-Ready Youth",
    audience: "For kids",
    description: "Write a story with an AI partner and 3D-print your own hero.",
  },
];

const BY_SLUG = new Map(LMS_PROGRAMS.map((p) => [p.slug, p]));

export function lmsProgramLabel(slug: string): string {
  return BY_SLUG.get(slug)?.label ?? slug;
}

/** Programs a member can request to join from the portal. */
export const MEMBER_PROGRAMS = LMS_PROGRAMS;

/** All program slugs (for the admin course-assignment picker). */
export const ALL_LMS_PROGRAMS: string[] = LMS_PROGRAMS.map((p) => p.slug);

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  intro: "Intro",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** URL-safe slug from a title (used for AI-generated courses). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
