export const dynamic = "force-dynamic";

import { getEmails, getEmailStats } from "@/lib/actions/emails";
import { EmailsClient } from "./emails-client";

export default async function EmailsPage() {
  // Fetch email data
  const [emailsResult, statsResult] = await Promise.all([
    getEmails({ limit: 50 }),
    getEmailStats(),
  ]);

  const emails = emailsResult.data?.emails || [];
  const total = emailsResult.data?.total || 0;
  const stats = statsResult.data || {
    sentThisMonth: 0,
    openRate: 0,
    clickRate: 0,
    scheduled: 0,
    drafts: 0,
  };

  return (
    <EmailsClient
      initialEmails={emails}
      initialTotal={total}
      stats={stats}
    />
  );
}
