import type { Metadata } from "next";
import { HomeContentPremium } from "./home-content-premium";

export const metadata: Metadata = {
  title: "Forever Forward | Empowering Fathers, Strengthening Families, Building the Future",
  description:
    "Forever Forward is a 501(c)(3) nonprofit delivering workforce development for Black fathers and youth while providing enterprise IT services to nonprofits and schools across Los Angeles and the Inland Empire.",
  keywords: [
    "Forever Forward",
    "nonprofit Los Angeles",
    "Black fathers",
    "workforce development",
    "IT training programs",
    "Google IT certification",
    "tech careers",
    "youth programs",
    "managed IT services",
    "nonprofit IT support",
    "Inland Empire nonprofits",
    "father empowerment",
    "family programs",
    "community development",
  ],
  openGraph: {
    title: "Forever Forward | Empowering Fathers, Strengthening Families",
    description:
      "Workforce development for Black fathers and youth. Enterprise IT services for nonprofits. A self-sustaining cycle of empowerment.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/images/authentic/fathers/father-teaching-daughter.jpg",
        width: 1200,
        height: 630,
        alt: "Forever Forward - Empowering fathers through tech education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forever Forward | Empowering Fathers, Strengthening Families",
    description:
      "Workforce development for Black fathers and youth. Enterprise IT services for nonprofits.",
    images: ["/images/authentic/fathers/father-teaching-daughter.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeContentPremium />;
}
