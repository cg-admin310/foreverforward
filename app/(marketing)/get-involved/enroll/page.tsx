import type { Metadata } from "next";
import { EnrollContent } from "./enroll-content";

export const metadata: Metadata = {
  title: "Enroll | Start Your Path Forward",
  description:
    "Apply for Forever Forward programs: career pathways for fathers (IT & cybersecurity, skilled trades, auto & EV), Tech-Ready Youth robotics and future tech, From Script to Screen filmmaking, and Stories from My Future for kids.",
  keywords: [
    "enroll Father Forward",
    "career training for fathers",
    "youth robotics program apply",
    "skilled trades training Los Angeles",
    "EV mechanic training",
    "Los Angeles tech training",
    "filmmaking program enrollment",
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
