import type { Metadata } from "next";
import { EnrollContent } from "./enroll-content";

export const metadata: Metadata = {
  title: "Enroll | Start Your Path Forward",
  description:
    "Apply for Forever Forward programs: Father Forward free IT training toward your CompTIA ITF+, Tech-Ready Youth robotics and future tech, and Stories from My Future for kids.",
  keywords: [
    "enroll Father Forward",
    "free IT training for fathers",
    "CompTIA ITF+ training Los Angeles",
    "youth robotics program apply",
    "Los Angeles tech training",
    "STEM program kids",
  ],
  openGraph: {
    title: "Enroll in Forever Forward Programs",
    description:
      "Career pathways for fathers, future tech for kids and youth. It costs nothing but the decision.",
    type: "website",
    url: "/get-involved/enroll",
  },
  twitter: {
    card: "summary",
    title: "Enroll in Forever Forward Programs",
    description:
      "Apply for career pathways, robotics, filmmaking, and youth programs.",
  },
  alternates: {
    canonical: "/get-involved/enroll",
  },
};

export default function EnrollPage() {
  return <EnrollContent />;
}
