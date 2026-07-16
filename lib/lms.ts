import type { ProgramType, CourseLevel } from "@/types/database";

/** Friendly labels for the CRM program types courses attach to. */
export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  father_forward: "Father Forward",
  tech_ready_youth: "Tech-Ready Youth",
  making_moments: "Making Moments",
  from_script_to_screen: "From Script to Screen",
  stories_from_my_future: "Stories from My Future",
  lula: "LULA",
};

export function programLabel(program: ProgramType): string {
  return PROGRAM_TYPE_LABELS[program] ?? program;
}

/**
 * The programs a member can request to join from the portal. Admins can still
 * assign courses to any program type; this is just the member-facing menu.
 */
export const MEMBER_PROGRAMS: {
  program: ProgramType;
  label: string;
  audience: string;
  description: string;
}[] = [
  {
    program: "father_forward",
    label: "Father Forward",
    audience: "For fathers",
    description:
      "Career, leadership, and brotherhood: IT & Cybersecurity Foundations, Networking Live, and The Security Path.",
  },
  {
    program: "tech_ready_youth",
    label: "Tech-Ready Youth",
    audience: "For kids & youth",
    description:
      "Hands-on with the future: robotics, AI, 3D printing, and a real tech-company field trip.",
  },
  {
    program: "stories_from_my_future",
    label: "Stories from My Future",
    audience: "For kids",
    description:
      "Dream it, write it, hold it: a story you write with an AI partner and a 3D-printed hero you keep.",
  },
];

/** All program types (for the admin course-assignment picker). */
export const ALL_PROGRAM_TYPES: ProgramType[] = [
  "father_forward",
  "tech_ready_youth",
  "stories_from_my_future",
  "making_moments",
  "from_script_to_screen",
  "lula",
];

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
