import type { Metadata } from "next";
import { PartnerContent } from "./partner-content";

export const metadata: Metadata = {
  title: "Partner With Us | Corporate & Community Partnerships",
  description:
    "Partner with Forever Forward through corporate sponsorships, training partnerships, or community collaboration. Connect your organization with workforce development and IT services for nonprofits.",
  keywords: [
    "nonprofit partnership",
    "corporate sponsorship",
    "workforce development partner",
    "community partnership",
    "IT training partnership",
    "nonprofit collaboration",
    "CSR partnership",
    "social impact partnership",
  ],
  openGraph: {
    title: "Partner with Forever Forward",
    description:
      "Corporate sponsorships, training partnerships, and community collaboration opportunities.",
    type: "website",
    url: "/get-involved/partner",
  },
  twitter: {
    card: "summary",
    title: "Partner with Forever Forward",
    description:
      "Explore corporate and community partnership opportunities.",
  },
  alternates: {
    canonical: "/get-involved/partner",
  },
};

export default function PartnerPage() {
  return <PartnerContent />;
}
