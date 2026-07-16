import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProgramPageClient } from "./program-page-client";
import { UmbrellaPageClient } from "./umbrella-page-client";
import { getProgramBySlug, getAllProgramSlugs } from "@/lib/data/programs";
import { getUmbrellaBySlug, getAllUmbrellaSlugs } from "@/lib/data/umbrellas";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [...getAllUmbrellaSlugs(), ...getAllProgramSlugs()].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const umbrella = getUmbrellaBySlug(slug);
  const program = getProgramBySlug(slug);
  const entity = umbrella ?? program;

  if (!entity) {
    return {
      title: "Program Not Found",
    };
  }

  return {
    title: `${entity.name} | Programs`,
    description: entity.heroDescription,
    openGraph: {
      title: `${entity.name}: ${entity.tagline}`,
      description: entity.heroDescription,
      type: "website",
      url: `/programs/${entity.slug}`,
      images: [
        {
          url: entity.heroImage,
          width: 1200,
          height: 630,
          alt: `${entity.name}: ${entity.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entity.name}: ${entity.tagline}`,
      description: entity.heroDescription,
      images: [entity.heroImage],
    },
    alternates: {
      canonical: `/programs/${entity.slug}`,
    },
  };
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params;

  const umbrella = getUmbrellaBySlug(slug);
  if (umbrella) {
    return <UmbrellaPageClient umbrella={umbrella} />;
  }

  const program = getProgramBySlug(slug);
  if (program) {
    return <ProgramPageClient program={program} />;
  }

  notFound();
}
