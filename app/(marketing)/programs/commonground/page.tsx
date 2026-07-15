import type { Metadata } from "next";
import { JsonLd } from "@/lib/seo/jsonld";
import { CommonGroundContent } from "./commonground-content";

export const metadata: Metadata = {
  title: "CommonGround: Co-Parenting, Made Calmer",
  description:
    "CommonGround is a co-parenting app Forever Forward partners with. It cools tense messages, keeps the schedule straight, splits shared costs, and keeps kids out of the middle. Free to start.",
  keywords: [
    "CommonGround",
    "co-parenting app",
    "co-parenting communication",
    "custody schedule app",
    "divorced parents app",
    "reduce co-parenting conflict",
    "Forever Forward partner",
  ],
  openGraph: {
    title: "CommonGround: Less Conflict. More Childhood. | Forever Forward",
    description:
      "A co-parenting app that cools tense messages, keeps the schedule straight, and keeps kids out of the middle. Free to start.",
    type: "website",
    url: "/programs/commonground",
    images: [
      {
        url: "/images/programs/commonground-hero.jpg",
        width: 1200,
        height: 630,
        alt: "A father laughing with his child, co-parenting at peace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CommonGround: Less Conflict. More Childhood. | Forever Forward",
    description:
      "A co-parenting app that cools tense messages, keeps the schedule straight, and keeps kids out of the middle.",
    images: ["/images/programs/commonground-hero.jpg"],
  },
  alternates: {
    canonical: "/programs/commonground",
  },
};

const commonGroundSchema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "CommonGround",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web, iOS, Android",
  url: "https://www.find-commonground.com/",
  description:
    "CommonGround is a co-parenting app that lowers conflict between separated parents: it cools tense messages, coordinates schedules, splits shared costs, and keeps children out of the middle.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to start, with optional paid plans.",
  },
};

export default function CommonGroundPage() {
  return (
    <>
      <JsonLd data={commonGroundSchema} />
      <CommonGroundContent />
    </>
  );
}
