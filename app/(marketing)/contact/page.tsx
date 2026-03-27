import type { Metadata } from "next";
import { ContactContent } from "./contact-content";

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
  },
  twitter: {
    card: "summary",
    title: "Contact Forever Forward",
    description:
      "Questions about programs, IT services, or how to get involved? We'd love to hear from you.",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
