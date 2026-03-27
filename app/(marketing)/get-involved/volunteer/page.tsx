import type { Metadata } from "next";
import { VolunteerContent } from "./volunteer-content";

export const metadata: Metadata = {
  title: "Volunteer | Share Your Skills & Time",
  description:
    "Volunteer with Forever Forward as a mentor, IT instructor, career coach, or event helper. Help fathers and youth in Los Angeles build tech careers and stronger families.",
  keywords: [
    "volunteer Los Angeles",
    "nonprofit volunteering",
    "mentor fathers",
    "IT instructor volunteer",
    "community service LA",
    "career coaching volunteer",
    "event volunteer",
    "youth mentorship",
  ],
  openGraph: {
    title: "Volunteer with Forever Forward",
    description:
      "Share your skills as a mentor, instructor, or event volunteer. Help fathers and youth build tech careers.",
    type: "website",
    url: "/get-involved/volunteer",
  },
  twitter: {
    card: "summary",
    title: "Volunteer with Forever Forward",
    description:
      "Share your skills to help fathers and youth in Los Angeles.",
  },
  alternates: {
    canonical: "/get-involved/volunteer",
  },
};

export default function VolunteerPage() {
  return <VolunteerContent />;
}
