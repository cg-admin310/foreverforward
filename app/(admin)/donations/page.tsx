export const dynamic = "force-dynamic";

import {
  getDonationStats,
  getDonorSummaries,
  getRecentDonations,
  getDonorTierStats,
  getImpactMetrics,
  getCurrentAllocation,
  getPendingDonorActions,
} from "@/lib/actions/donations";
import { DonationsClient } from "./donations-client";

export default async function DonationsPage() {
  // Fetch all data in parallel
  const [
    statsResult,
    donorsResult,
    recentResult,
    tierStatsResult,
    impactResult,
    allocationResult,
    actionsResult,
  ] = await Promise.all([
    getDonationStats(),
    getDonorSummaries({ limit: 50 }),
    getRecentDonations(10),
    getDonorTierStats(),
    getImpactMetrics(),
    getCurrentAllocation(),
    getPendingDonorActions(),
  ]);

  const stats = statsResult.data || {
    totalThisMonth: 0,
    totalThisYear: 0,
    recurringDonors: 0,
    pendingAcknowledgments: 0,
    totalDonors: 0,
    averageDonation: 0,
  };

  const donors = donorsResult.data?.donors || [];
  const recentDonations = recentResult.data || [];
  const tierStats = tierStatsResult.data || {
    founding: 0,
    champion: 0,
    supporter: 0,
    friend: 0,
    total: 0,
  };
  const impactMetrics = impactResult.data || [];
  const allocation = allocationResult.data || null;
  const pendingActions = actionsResult.data || [];

  return (
    <DonationsClient
      stats={stats}
      donors={donors}
      recentDonations={recentDonations}
      tierStats={tierStats}
      impactMetrics={impactMetrics}
      allocation={allocation}
      pendingActions={pendingActions}
    />
  );
}
