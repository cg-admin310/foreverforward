import type { Metadata } from "next";
import { OtcContent } from "./otc-content";

export const metadata: Metadata = {
  title: "Off the Clock",
  description:
    "Dads-only outings from Forever Forward: fishing trips, range days, cigar lounges, golf. No kids, no pressure, no agenda. Fellowship, a few new skills, and grown-man time on the calendar. Free for enrolled fathers.",
  keywords: [
    "Off the Clock",
    "dads only events Los Angeles",
    "fatherhood fellowship LA",
    "fishing trips for dads",
    "range day events",
    "Forever Forward events",
    "Making Moments",
    "father community Los Angeles",
  ],
  openGraph: {
    title: "Off the Clock | Forever Forward",
    description:
      "No kids. No pressure. No agenda. Just dads, doing something worth leaving the house for.",
    type: "website",
    url: "/events/off-the-clock",
    images: [
      {
        url: "/images/events/otc-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Fathers fishing off a pier at golden hour, laughing together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Off the Clock | Forever Forward",
    description:
      "No kids. No pressure. No agenda. Just dads, doing something worth leaving the house for.",
    images: ["/images/events/otc-hero.jpg"],
  },
  alternates: {
    canonical: "/events/off-the-clock",
  },
};

export default function OffTheClockPage() {
  return <OtcContent />;
}
