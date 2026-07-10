import type { Metadata } from "next";
import { VolunteerContent } from "./volunteer-content";

export const metadata: Metadata = {
  title: "Volunteer | Share Your Skills & Time",
  description:
    "Volunteer with Forever Forward as a career pathway mentor, event crew for Movies on the Menu and robot races, instructor or guest speaker, or tech volunteer building community apps.",
  keywords: [
    "volunteer Los Angeles",
    "nonprofit volunteering",
    "mentor fathers",
    "career mentor volunteer",
    "community service LA",
    "STEM event volunteer",
    "guest speaker volunteer",
    "youth mentorship",
  ],
  openGraph: {
    title: "Volunteer with Forever Forward",
    description:
      "Mentor a father into a new career, crew a family event, teach a skill, or build community tech.",
    type: "website",
    url: "/get-involved/volunteer",
  },
  twitter: {
    card: "summary",
    title: "Volunteer with Forever Forward",
    description:
      "Share your skills to help fathers, kids, and families in Los Angeles move forward.",
  },
  alternates: {
    canonical: "/get-involved/volunteer",
  },
};

export default function VolunteerPage() {
  return <VolunteerContent />;
}
