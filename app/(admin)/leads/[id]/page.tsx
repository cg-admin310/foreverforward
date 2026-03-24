export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getLead, getLeadActivities } from "@/lib/actions/leads";
import { LeadDetailView } from "./lead-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [leadResult, activitiesResult] = await Promise.all([
    getLead(id),
    getLeadActivities(id),
  ]);

  if (!leadResult.success || !leadResult.data) {
    notFound();
  }

  return (
    <LeadDetailView
      lead={leadResult.data}
      activities={(activitiesResult.data?.activities || []) as Array<{
        id: string;
        activity_type: string;
        description: string;
        created_at: string;
        performed_by: string | null;
        metadata: Record<string, unknown> | null;
      }>}
    />
  );
}
