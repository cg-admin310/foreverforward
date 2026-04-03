import type { Metadata } from "next";
import { ContactContentPremium } from "./contact-content-premium";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Contact Forever Forward for program enrollment, IT services, volunteering, partnerships, or general inquiries. Located in Los Angeles, serving LA County and the Inland Empire.",
  keywords: [
    "contact Forever Forward",
    "nonprofit contact",
    "Los Angeles nonprofit",
    "IT services inquiry",
    "program enrollment",
    "volunteer opportunities",
    "partnership inquiry",
    "South LA nonprofits",
  ],
  openGraph: {
    title: "Contact Forever Forward | Get in Touch",
    description:
      "Questions about programs, IT services, or how to get involved? We'd love to hear from you.",
    type: "website",
    url: "/contact",
    images: [
      {
        url: "/images/authentic/family/family-outdoor-portrait.jpg",
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
      "Questions about programs, IT services, or how to get involved? We'd love to hear from you.",
    images: ["/images/authentic/family/family-outdoor-portrait.jpg"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContentPremium />;
}
