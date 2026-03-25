import { notFound } from "next/navigation";
import { getCohortById, getCohortParticipants } from "@/lib/actions/cohorts";
import { CohortDetailClient } from "./cohort-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await getCohortById(id);

  if (!result.success || !result.data) {
    return { title: "Cohort Not Found | Forever Forward" };
  }

  return {
    title: `${result.data.name} | Forever Forward`,
    description: `Manage ${result.data.name} cohort details and participants`,
  };
}

export default async function CohortDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch cohort and participants in parallel
  const [cohortResult, participantsResult] = await Promise.all([
    getCohortById(id),
    getCohortParticipants(id),
  ]);

  if (!cohortResult.success || !cohortResult.data) {
    notFound();
  }

  const participants = participantsResult.success ? participantsResult.data || [] : [];

  return (
    <CohortDetailClient
      cohort={cohortResult.data}
      participants={participants}
    />
  );
}
