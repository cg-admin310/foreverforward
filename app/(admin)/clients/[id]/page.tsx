export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getClient, getClientActivities } from "@/lib/actions/clients";
import { ClientDetailView } from "./client-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [clientResult, activitiesResult] = await Promise.all([
    getClient(id),
    getClientActivities(id),
  ]);

  if (!clientResult.success || !clientResult.data) {
    notFound();
  }

  return (
    <ClientDetailView
      client={clientResult.data}
      activities={(activitiesResult.data?.activities || []) as Array<{
        id: string;
        activity_type: string;
        description: string;
        metadata?: Record<string, unknown>;
        created_at: string;
      }>}
    />
  );
}
