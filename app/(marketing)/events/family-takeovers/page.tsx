import type { Metadata } from "next";
import { FtContent } from "./ft-content";

export const metadata: Metadata = {
  title: "Family Takeovers",
  description:
    "Forever Forward rents out the fun spots for the whole family: trampoline parks, paintball, bowling, theme parks, block parties. We book it, you bring everybody. Free or low-cost for families, always.",
  keywords: [
    "Family Takeovers",
    "family events Los Angeles",
    "free family activities LA",
    "trampoline park family event",
    "family bowling night",
    "Forever Forward events",
    "Making Moments",
    "block party Los Angeles",
  ],
  openGraph: {
    title: "Family Takeovers | Forever Forward",
    description:
      "We rent out the fun spot. You bring everybody. Trampoline parks, paintball, bowling, theme parks, block parties.",
    type: "website",
    url: "/events/family-takeovers",
    images: [
      {
        url: "/images/events/ft-hero.jpg",
        width: 1200,
        height: 630,
        alt: "A family mid-air at a trampoline park, everyone laughing at the top of the bounce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Takeovers | Forever Forward",
    description:
      "We rent out the fun spot. You bring everybody. Trampoline parks, paintball, bowling, theme parks, block parties.",
    images: ["/images/events/ft-hero.jpg"],
  },
  alternates: {
    canonical: "/events/family-takeovers",
  },
};

export default function FamilyTakeoversPage() {
  return <FtContent />;
}
