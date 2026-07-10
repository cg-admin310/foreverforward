/**
 * Forever Forward icon set.
 * Hand-drawn 24px geometric strokes with a small orbital accent dot,
 * matching the "Afro-futurist observatory" design language.
 * Single color (currentColor) so context sets the tone: gold on dark,
 * olive/black on light. Use instead of emojis everywhere.
 */

import { cn } from "@/lib/utils";

export type FFIconName =
  | "chip"
  | "robot"
  | "printer3d"
  | "satellite"
  | "blocks"
  | "bolt"
  | "network"
  | "certificate"
  | "route"
  | "crew"
  | "briefcase"
  | "trophy"
  | "compass"
  | "book"
  | "rocket"
  | "spark";

const PATHS: Record<FFIconName, React.ReactNode> = {
  // AI & machine learning — processor die with radiating pins
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <rect x="10.5" y="10.5" width="3" height="3" rx="0.75" />
      <path d="M9 7V4M15 7V4M9 20v-3M15 20v-3M7 9H4M7 15H4M20 9h-3M20 15h-3" />
    </>
  ),
  // Robotics — friendly head, antenna, eyes
  robot: (
    <>
      <rect x="5" y="9" width="14" height="10" rx="3" />
      <path d="M12 9V6" />
      <circle cx="12" cy="4.5" r="1.5" />
      <circle cx="9.25" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.75" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  // 3D printing — gantry laying down a part, build layers
  printer3d: (
    <>
      <path d="M4 5h16M6 5v4M18 5v4" />
      <path d="M12 5v3.5" />
      <path d="M10.5 8.5h3l-.6 2h-1.8l-.6-2Z" />
      <path d="M8 19h8M9.5 16h5" />
      <circle cx="19.5" cy="13" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Low earth orbit — satellite body, panels, orbit arc
  satellite: (
    <>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(45 12 12)" />
      <path d="M7.5 7.5 5 5M16.5 16.5 19 19" />
      <path d="M3.5 8.5 8 4M16 20l4.5-4.5" />
      <path d="M18.5 6.5a9 9 0 0 1-1.4 9.9" />
      <circle cx="19" cy="4.8" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Blockchain — linked cubes
  blocks: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
      <path d="M11 7.5h3.5a2 2 0 0 1 2 2V13M13 16.5H9.5a2 2 0 0 1-2-2V11" />
    </>
  ),
  // Renewable energy — bolt inside a sun arc
  bolt: (
    <>
      <path d="M13 3 7 13.5h4L11 21l6-10.5h-4L13 3Z" />
      <path d="M4.5 9a9 9 0 0 1 3-4.5" />
      <circle cx="4.5" cy="14.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Networks — nodes and uplinks
  network: (
    <>
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="5.5" cy="18" r="2" />
      <circle cx="18.5" cy="18" r="2" />
      <path d="M10.8 7.2 6.7 16.2M13.2 7.2l4.1 9M7.5 18h9" />
    </>
  ),
  // Certification — ribbon seal
  certificate: (
    <>
      <circle cx="12" cy="9" r="5" />
      <circle cx="12" cy="9" r="2" />
      <path d="M9.5 13.2 8 21l4-2.4L16 21l-1.5-7.8" />
    </>
  ),
  // Path forward plan — waypointed route
  route: (
    <>
      <circle cx="6" cy="5.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
      <path d="M8 5.5h6.5a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7" />
    </>
  ),
  // The crew — three heads, shoulder to shoulder
  crew: (
    <>
      <circle cx="12" cy="7.5" r="2.5" />
      <circle cx="5.5" cy="9.5" r="2" />
      <circle cx="18.5" cy="9.5" r="2" />
      <path d="M8 19a4 4 0 0 1 8 0" />
      <path d="M2.5 17.5a3.2 3.2 0 0 1 3.6-3M21.5 17.5a3.2 3.2 0 0 0-3.6-3" />
    </>
  ),
  // Career — briefcase with latch
  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="2" />
      <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
      <path d="M3.5 12.5h17" />
      <path d="M10.75 12.5h2.5v2h-2.5z" />
    </>
  ),
  // Capstone — trophy
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" />
      <path d="M12 13v3M9 19h6M10 16h4" />
    </>
  ),
  // Direction — compass needle
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  // Published author — open book with bookmark
  book: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v14c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-14c-4.5 0-6.5.5-8 2Z" />
      <path d="M12 6.5v14" />
      <path d="M16.5 4.7v5.3l1.75-1.2L20 10V4.6" />
    </>
  ),
  // Launch — rocket with window
  rocket: (
    <>
      <path d="M12 3c3 2 4.5 5.5 4.5 9l-2 3.5h-5L7.5 12C7.5 8.5 9 5 12 3Z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M9.5 15.5 7 18M14.5 15.5 17 18M12 16v4" />
    </>
  ),
  // The spark — four-point star with orbit dot
  spark: (
    <>
      <path d="M12 3.5c.7 3.8 2.7 5.8 6.5 6.5-3.8.7-5.8 2.7-6.5 6.5-.7-3.8-2.7-5.8-6.5-6.5 3.8-.7 5.8-2.7 6.5-6.5Z" />
      <circle cx="18.5" cy="18.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function FFIcon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: FFIconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}

/** True when a string is a known FFIcon key (for data-driven icon fields). */
export function isFFIconName(value: string): value is FFIconName {
  return value in PATHS;
}
