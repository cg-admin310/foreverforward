import type { Metadata } from "next";
import { ProgramsContentPremium } from "./programs-content-premium";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Six programs. Three doors. One direction: forward. Career pathways for fathers, future tech in young hands, and family moments made on purpose — free across Greater Los Angeles.",
  keywords: [
    "father programs Los Angeles",
    "career pathways for fathers",
    "youth robotics program",
    "AI programs for kids",
    "3D printing workshops kids",
    "skilled trades training fathers",
    "EV mechanic training",
    "Black father programs",
    "family STEM events Los Angeles",
    "youth filmmaking program",
    "Father Forward program",
    "Tech-Ready Youth",
  ],
  openGraph: {
    title: "Programs | Forever Forward",
    description:
      "Six programs. Three doors. One direction: forward. Career pathways for fathers, future tech for youth, and family moments made on purpose.",
    type: "website",
    url: "/programs",
    images: [
      {
        url: "/images/future/pillar-future-tech.jpg",
        width: 1200,
        height: 630,
        alt: "Forever Forward Programs — young people building the future with real technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programs | Forever Forward",
    description:
      "Career pathways for fathers, future tech for youth, and family moments made on purpose — free for our community.",
    images: ["/images/future/pillar-future-tech.jpg"],
  },
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsPage() {
  return <ProgramsContentPremium />;
}
