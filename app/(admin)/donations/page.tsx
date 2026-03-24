export const dynamic = "force-dynamic";

import { getDonationStats, getDonorSummaries, getRecentDonations } from "@/lib/actions/donations";
import { DonationsClient } from "./donations-client";

export default async function DonationsPage() {
  // Fetch all data in parallel
  const [statsResult, donorsResult, recentResult] = await Promise.all([
    getDonationStats(),
    getDonorSummaries({ limit: 50 }),
    getRecentDonations(10),
  ]);

  const stats = statsResult.data || {
    totalThisMonth: 0,
    totalThisYear: 0,
    recurringDonors: 0,
    pendingAcknowledgments: 0,
  };

  const donors = donorsResult.data?.donors || [];
  const recentDonations = recentResult.data || [];

  return (
    <DonationsClient
      stats={stats}
      donors={donors}
      recentDonations={recentDonations}
    />
  );
}
