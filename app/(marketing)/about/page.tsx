import type { Metadata } from "next";
import { AboutContentPremium } from "./about-content-premium";

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "Forever Forward is a Los Angeles 501(c)(3) founded in 2023 by TJ Wilform — a Black father from Compton who built data centers for a living. We introduce underserved communities to AI, robotics, 3D printing, and satellites, and turn that spark into careers, confidence, and legacy.",
  keywords: [
    "Forever Forward about",
    "TJ Wilform",
    "nonprofit founder",
    "Los Angeles nonprofit",
    "Black fathers nonprofit",
    "future technology education",
    "career training for fathers",
    "youth robotics Los Angeles",
    "community empowerment",
    "STEM nonprofit",
  ],
  openGraph: {
    title: "Our Mission | Forever Forward",
    description:
      "We started with what we knew. We're building what comes next. Meet the LA nonprofit putting tomorrow's technology in today's families' hands.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/images/future/about-legacy.jpg",
        width: 1200,
        height: 630,
        alt: "A father carries his daughter on his shoulders at sunrise, looking out over the Los Angeles skyline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Mission | Forever Forward",
    description:
      "We started with what we knew. We're building what comes next. Meet the LA nonprofit putting tomorrow's technology in today's families' hands.",
    images: ["/images/future/about-legacy.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContentPremium />;
}
