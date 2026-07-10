import type { Metadata } from "next";
import { PartnerContent } from "./partner-content";

export const metadata: Metadata = {
  title: "Partner With Us | Join Forces on the Mission",
  description:
    "Join forces with Forever Forward: community organizations co-running programs and sharing tech, employers hiring graduates and hosting apprenticeships, sponsors funding cohorts and events, and schools hosting future-tech workshops.",
  keywords: [
    "nonprofit partnership",
    "community collaboration",
    "hire workforce program graduates",
    "apprenticeship partner",
    "sponsor a cohort",
    "nonprofit technology collaboration",
    "school STEM workshops",
    "social impact partnership",
  ],
  openGraph: {
    title: "Join Forces with Forever Forward",
    description:
      "Community organizations, employers, sponsors, and schools, joining forces so the whole neighborhood levels up.",
    type: "website",
    url: "/get-involved/partner",
  },
  twitter: {
    card: "summary",
    title: "Join Forces with Forever Forward",
    description:
      "Partnerships for community orgs, employers, sponsors, and schools.",
  },
  alternates: {
    canonical: "/get-involved/partner",
  },
};

export default function PartnerPage() {
  return <PartnerContent />;
}
