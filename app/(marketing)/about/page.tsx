import type { Metadata } from "next";
import { AboutContentPremium } from "./about-content-premium";

export const metadata: Metadata = {
  title: "About Us | Our Story, Mission & Founder",
  description:
    "Learn about Forever Forward's dual-engine model: workforce development for fathers and youth combined with IT services for nonprofits. Founded by TJ Wilform, a Compton native and single father who turned his tech career into a mission.",
  keywords: [
    "Forever Forward about",
    "TJ Wilform",
    "nonprofit founder",
    "Los Angeles nonprofit",
    "workforce development",
    "IT services nonprofit",
    "dual-engine model",
    "Black fathers nonprofit",
    "community empowerment",
    "tech training programs",
  ],
  openGraph: {
    title: "About Forever Forward | Our Story & Mission",
    description:
      "From Compton to the Cloud. Learn how TJ Wilform built Forever Forward to empower fathers and serve nonprofits through technology.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/images/brand/founderpic.jpg",
        width: 1200,
        height: 630,
        alt: "TJ Wilform - Founder of Forever Forward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Forever Forward | Our Story & Mission",
    description:
      "From Compton to the Cloud. Learn how TJ Wilform built Forever Forward to empower fathers and serve nonprofits.",
    images: ["/images/brand/founderpic.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContentPremium />;
}
