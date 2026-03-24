import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProgramPageClient } from "./program-page-client";
import { getProgramBySlug, getAllProgramSlugs } from "@/lib/data/programs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProgramSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found",
    };
  }

  return {
    title: `${program.name} | Programs`,
    description: program.heroDescription,
    openGraph: {
      title: `${program.name} - ${program.tagline}`,
      description: program.heroDescription,
    },
  };
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return <ProgramPageClient program={program} />;
}
