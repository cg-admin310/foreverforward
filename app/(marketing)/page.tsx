import type { Metadata } from "next";
import { HomeContentPremium } from "./home-content-premium";

export const metadata: Metadata = {
  title: { absolute: "Forever Forward | The Future Belongs to Our Families" },
  description:
    "Forever Forward is a Los Angeles 501(c)(3) that introduces Black and brown communities to the technologies shaping tomorrow: AI, robotics, 3D printing, satellites, and more. We train fathers for real careers in IT, skilled trades, and auto mechanics, and bring families together through unforgettable events.",
  keywords: [
    "Forever Forward",
    "nonprofit Los Angeles",
    "Black fathers",
    "career training",
    "workforce development",
    "robotics for kids",
    "AI education",
    "3D printing workshops",
    "skilled trades",
    "auto mechanics training",
    "youth programs",
    "family events",
    "father empowerment",
    "community development",
  ],
  openGraph: {
    title: "Forever Forward | The Future Belongs to Our Families",
    description:
      "Career training for fathers. Future tech for kids. Unforgettable moments for families. Built in Los Angeles, moving forever forward.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/images/future/hero-father-future.jpg",
        width: 1200,
        height: 630,
        alt: "A father and daughter looking up at a glowing hologram of Earth and its satellites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Forward | The Future Belongs to Our Families",
    description:
      "Career training for fathers. Future tech for kids. Unforgettable moments for families.",
    images: ["/images/future/hero-father-future.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeContentPremium />;
}
