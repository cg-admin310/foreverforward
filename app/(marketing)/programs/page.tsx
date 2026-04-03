import type { Metadata } from "next";
import { ProgramsContentPremium } from "./programs-content-premium";

export const metadata: Metadata = {
  title: "Programs | Father Forward, Tech-Ready Youth & More",
  description:
    "Explore Forever Forward's transformative programs: Father Forward workforce development, Tech-Ready Youth certifications, Making Moments family events, From Script to Screen filmmaking, Stories from My Future, and LULA learning academy.",
  keywords: [
    "father programs Los Angeles",
    "workforce development fathers",
    "youth tech training",
    "Google IT certification program",
    "Black father programs",
    "family enrichment programs",
    "youth filmmaking program",
    "STEM programs kids",
    "tech training nonprofit",
    "Father Forward program",
    "Tech-Ready Youth",
  ],
  openGraph: {
    title: "Programs | Forever Forward",
    description:
      "From workforce development to family enrichment—programs designed to uplift fathers, youth, and families.",
    type: "website",
    url: "/programs",
    images: [
      {
        url: "/images/authentic/fathers/father-teaching-daughter.jpg",
        width: 1200,
        height: 630,
        alt: "Forever Forward Programs - Father teaching technology skills",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programs | Forever Forward",
    description:
      "Workforce development, youth training, and family programs designed to uplift our community.",
    images: ["/images/authentic/fathers/father-teaching-daughter.jpg"],
  },
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsPage() {
  return <ProgramsContentPremium />;
}
