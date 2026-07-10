import type { Metadata } from "next";
import { ContactContentPremium } from "./contact-content-premium";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Contact Forever Forward about career pathways for fathers, robotics and future-tech programs for kids, family events, volunteering, or partnerships. Based in Los Angeles, serving Greater LA.",
  keywords: [
    "contact Forever Forward",
    "nonprofit contact",
    "Los Angeles nonprofit",
    "career training for fathers",
    "program enrollment",
    "volunteer opportunities",
    "partnership inquiry",
    "South LA nonprofits",
  ],
  openGraph: {
    title: "Contact Forever Forward | Get in Touch",
    description:
      "Questions about programs, family events, or how to join the mission? We'd love to hear from you.",
    type: "website",
    url: "/contact",
    images: [
      {
        url: "/images/future/hero-father-future.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Forever Forward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Forever Forward",
    description:
      "Questions about programs, family events, or how to join the mission? We'd love to hear from you.",
    images: ["/images/future/hero-father-future.jpg"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContentPremium />;
}
