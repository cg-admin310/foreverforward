import { getCohorts, getCohortStats } from "@/lib/actions/cohorts";
import { CohortsClient } from "./cohorts-client";

export const metadata = {
  title: "Cohorts | Forever Forward",
  description: "Manage program cohorts and track participant progress",
};

export default async function CohortsPage() {
  // Fetch cohorts and stats in parallel
  const [cohortsResult, statsResult] = await Promise.all([
    getCohorts({ status: "all" }),
    getCohortStats(),
  ]);

  const cohorts = cohortsResult.success ? cohortsResult.data || [] : [];
  const stats = statsResult.success
    ? statsResult.data!
    : {
        activeCohorts: 0,
        upcomingCohorts: 0,
        completedCohorts: 0,
        totalEnrolled: 0,
      };

  return <CohortsClient cohorts={cohorts} stats={stats} />;
}
