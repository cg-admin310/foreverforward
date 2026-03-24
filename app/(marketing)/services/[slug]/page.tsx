import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ServicePageClient } from "./service-page-client";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/data/services";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name} | IT Services`,
    description: service.heroDescription,
    openGraph: {
      title: `${service.name} - ${service.tagline}`,
      description: service.heroDescription,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServicePageClient service={service} />;
}
