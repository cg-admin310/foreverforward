import type { Metadata } from "next";
import { Suspense } from "react";
import { DonateContent } from "./donate-content";

export const metadata: Metadata = {
  title: "Donate | Fund the Future You Want to See",
  description:
    "Your donation to Forever Forward puts real technology in real hands: career training for fathers, robotics and 3D-printing workshops for kids, and family events across Los Angeles.",
  keywords: [
    "donate to nonprofit",
    "support Black fathers",
    "sponsor robotics kit",
    "Los Angeles nonprofit donation",
    "career training donation",
    "charitable giving",
    "tax deductible donation",
    "family programs support",
  ],
  openGraph: {
    title: "Donate to Forever Forward",
    description:
      "Sponsor a kid's robotics kit, a father's certification exam, or a family movie night. Every dollar moves a family forward.",
    type: "website",
    url: "/get-involved/donate",
  },
  twitter: {
    card: "summary",
    title: "Donate to Forever Forward",
    description:
      "Fund career pathways for fathers and future tech for kids in Los Angeles.",
  },
  alternates: {
    canonical: "/get-involved/donate",
  },
};

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <DonateContent />
    </Suspense>
  );
}
