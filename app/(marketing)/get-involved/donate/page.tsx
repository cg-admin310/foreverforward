import type { Metadata } from "next";
import { Suspense } from "react";
import { DonateContent } from "./donate-content";

export const metadata: Metadata = {
  title: "Donate | Support Fathers, Youth & Families",
  description:
    "Your donation to Forever Forward directly funds workforce development for Black fathers, youth tech programs, and family events. Every dollar creates lasting impact in Los Angeles communities.",
  keywords: [
    "donate to nonprofit",
    "support Black fathers",
    "youth tech programs donation",
    "Los Angeles nonprofit donation",
    "workforce development donation",
    "charitable giving",
    "tax deductible donation",
    "family programs support",
  ],
  openGraph: {
    title: "Donate to Forever Forward",
    description:
      "Your gift funds workforce development, youth programs, and family events. Every dollar creates lasting impact.",
    type: "website",
    url: "/get-involved/donate",
  },
  twitter: {
    card: "summary",
    title: "Donate to Forever Forward",
    description:
      "Support workforce development for fathers and youth in Los Angeles.",
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
