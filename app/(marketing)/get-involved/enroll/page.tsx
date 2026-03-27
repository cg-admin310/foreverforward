import type { Metadata } from "next";
import { EnrollContent } from "./enroll-content";

export const metadata: Metadata = {
  title: "Enroll | Apply for Programs",
  description:
    "Apply for Forever Forward programs: Father Forward workforce development, Tech-Ready Youth certification training, From Script to Screen filmmaking, and Stories from My Future for kids.",
  keywords: [
    "enroll Father Forward",
    "IT training enrollment",
    "youth tech program apply",
    "workforce development application",
    "Google IT certification program",
    "Los Angeles tech training",
    "filmmaking program enrollment",
    "STEM program kids",
  ],
  openGraph: {
    title: "Enroll in Forever Forward Programs",
    description:
      "Apply for workforce development, youth tech training, and creative programs.",
    type: "website",
    url: "/get-involved/enroll",
  },
  twitter: {
    card: "summary",
    title: "Enroll in Forever Forward Programs",
    description:
      "Apply for IT training, filmmaking, and youth programs.",
  },
  alternates: {
    canonical: "/get-involved/enroll",
  },
};

export default function EnrollPage() {
  return <EnrollContent />;
}
