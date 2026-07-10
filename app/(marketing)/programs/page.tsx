import type { Metadata } from "next";
import { ProgramsContentPremium } from "./programs-content-premium";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Three programs, events all year, one direction: forward. Free IT training for fathers toward a CompTIA ITF+, future tech in young hands, and Making Moments events, across Greater Los Angeles.",
  keywords: [
    "father programs Los Angeles",
    "free IT training for fathers",
    "CompTIA ITF+ training",
    "youth robotics program",
    "AI programs for kids",
    "3D printing workshops kids",
    "Black father programs",
    "family events Los Angeles",
    "Father Forward program",
    "Tech-Ready Youth",
  ],
  openGraph: {
    title: "Programs | Forever Forward",
    description:
      "Three programs, events all year, one direction: forward. Free IT training for fathers, future tech for youth, and Making Moments events.",
    type: "website",
    url: "/programs",
    images: [
      {
        url: "/images/future/pillar-future-tech.jpg",
        width: 1200,
        height: 630,
        alt: "Forever Forward Programs: young people building the future with real technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programs | Forever Forward",
    description:
      "Free IT training for fathers, future tech for youth, and Making Moments events. Free for our community.",
    images: ["/images/future/pillar-future-tech.jpg"],
  },
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsPage() {
  return <ProgramsContentPremium />;
}
