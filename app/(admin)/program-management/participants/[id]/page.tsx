import { notFound } from "next/navigation";
import { getParticipantWithAllData } from "@/lib/actions/participants";
import { ParticipantDetailClient } from "./participant-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ParticipantDetailPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getParticipantWithAllData(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const {
    participant,
    checkins,
    activities,
    documents,
    travisConversations,
    cohort,
    caseWorker,
  } = result.data;

  return (
    <ParticipantDetailClient
      participant={participant}
      checkins={checkins}
      activities={activities}
      documents={documents}
      travisConversations={travisConversations}
      cohort={cohort}
      caseWorker={caseWorker}
    />
  );
}
