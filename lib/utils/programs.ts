import { ProgramType } from "@/types/database";

// =============================================================================
// PROGRAM UTILITIES
// =============================================================================

/**
 * Get human-readable display name for a program type
 */
export function getProgramDisplayName(program: ProgramType): string {
  const names: Record<ProgramType, string> = {
    father_forward: "Father Forward",
    tech_ready_youth: "Tech-Ready Youth",
    making_moments: "Making Moments",
    from_script_to_screen: "From Script to Screen",
    stories_from_my_future: "Stories from My Future",
    lula: "LULA",
  };
  return names[program] || program;
}

/**
 * Get brand color for a program type
 */
export function getProgramColor(program: ProgramType): string {
  const colors: Record<ProgramType, string> = {
    father_forward: "bg-[#C9A84C]",
    tech_ready_youth: "bg-[#5A7247]",
    making_moments: "bg-pink-500",
    from_script_to_screen: "bg-purple-500",
    stories_from_my_future: "bg-cyan-500",
    lula: "bg-orange-500",
  };
  return colors[program] || "bg-gray-500";
}

/**
 * Get text color for a program type
 */
export function getProgramTextColor(program: ProgramType): string {
  const colors: Record<ProgramType, string> = {
    father_forward: "text-[#C9A84C]",
    tech_ready_youth: "text-[#5A7247]",
    making_moments: "text-pink-500",
    from_script_to_screen: "text-purple-500",
    stories_from_my_future: "text-cyan-500",
    lula: "text-orange-500",
  };
  return colors[program] || "text-gray-500";
}

/**
 * Get all program options for select dropdowns
 */
export const PROGRAM_OPTIONS: { value: ProgramType; label: string }[] = [
  { value: "father_forward", label: "Father Forward" },
  { value: "tech_ready_youth", label: "Tech-Ready Youth" },
  { value: "making_moments", label: "Making Moments" },
  { value: "from_script_to_screen", label: "From Script to Screen" },
  { value: "stories_from_my_future", label: "Stories from My Future" },
  { value: "lula", label: "LULA" },
];
