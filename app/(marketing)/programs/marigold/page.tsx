import type { Metadata } from "next";
import { JsonLd } from "@/lib/seo/jsonld";
import { MarigoldContent } from "./marigold-content";

export const metadata: Metadata = {
  title: "Marigold: IEP Support for Parents",
  description:
    "Marigold is a free tool from Forever Forward that decodes your child's IEP into plain language and connects your family to matched therapies and programs. Their plan. Your language.",
  keywords: [
    "Marigold",
    "IEP help for parents",
    "understand my child's IEP",
    "special education support",
    "IEP translation tool",
    "free IEP resource",
    "Forever Forward",
    "special education advocacy",
  ],
  openGraph: {
    title: "Marigold: Their Plan. Your Language. | Forever Forward",
    description:
      "A free tool that decodes your child's IEP into plain language and connects you to the right resources. Walk into every meeting knowing.",
    type: "website",
    url: "/programs/marigold",
    images: [
      {
        url: "/images/programs/marigold-hero.jpg",
        width: 1200,
        height: 630,
        alt: "A parent and child understanding an IEP together with Marigold",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marigold: Their Plan. Your Language. | Forever Forward",
    description:
      "A free tool that decodes your child's IEP into plain language and connects you to the right resources.",
    images: ["/images/programs/marigold-hero.jpg"],
  },
  alternates: {
    canonical: "/programs/marigold",
  },
};

const marigoldSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Marigold",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://marigold.4everforward.net/",
  description:
    "Marigold is a free tool from Forever Forward that decodes a child's IEP into plain language for parents and connects families to matched therapies and programs.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  provider: {
    "@type": "NGO",
    name: "Forever Forward",
    url: "https://www.4everforward.net",
  },
};

export default function MarigoldPage() {
  return (
    <>
      <JsonLd data={marigoldSchema} />
      <MarigoldContent />
    </>
  );
}
