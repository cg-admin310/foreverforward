import type { Metadata } from "next";
import { ServicesContent } from "./services-content";

export const metadata: Metadata = {
  title: "IT Services | Managed IT, Software & Low Voltage for Nonprofits",
  description:
    "Enterprise IT services for nonprofits and schools at mission-friendly prices. Managed IT ($50-85/user), custom software & AI development, structured cabling, and CCTV installation across Los Angeles and Inland Empire.",
  keywords: [
    "nonprofit IT services",
    "managed IT Los Angeles",
    "nonprofit technology support",
    "school IT services",
    "IT for nonprofits",
    "managed service provider nonprofit",
    "Inland Empire IT services",
    "structured cabling",
    "CCTV installation nonprofit",
    "custom software nonprofits",
    "AI development nonprofit",
    "Microsoft 365 nonprofit",
  ],
  openGraph: {
    title: "IT Services for Nonprofits | Forever Forward",
    description:
      "Enterprise IT. Nonprofit heart. Managed IT, software development, and low voltage solutions for mission-driven organizations.",
    type: "website",
    url: "/services",
    images: [
      {
        url: "/images/generated/service-managed-it.png",
        width: 1200,
        height: 630,
        alt: "Forever Forward IT Services for Nonprofits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Services for Nonprofits | Forever Forward",
    description:
      "Enterprise IT at nonprofit-friendly prices. Managed IT, software, and low voltage solutions.",
    images: ["/images/generated/service-managed-it.png"],
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
