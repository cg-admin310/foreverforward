import {
  getProgramOutcomesReport,
  getFinancialSummaryReport,
  getMspServiceReport,
  getDonationSummaryReport,
  getEventAttendanceReport,
} from "@/lib/actions/reports";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  // Fetch all report data in parallel
  const [
    programOutcomesResult,
    financialSummaryResult,
    mspServiceResult,
    donationSummaryResult,
    eventAttendanceResult,
  ] = await Promise.all([
    getProgramOutcomesReport(),
    getFinancialSummaryReport(),
    getMspServiceReport(),
    getDonationSummaryReport(),
    getEventAttendanceReport(),
  ]);

  return (
    <ReportsClient
      programOutcomes={programOutcomesResult.success ? programOutcomesResult.data ?? null : null}
      financialSummary={financialSummaryResult.success ? financialSummaryResult.data ?? null : null}
      mspService={mspServiceResult.success ? mspServiceResult.data ?? null : null}
      donationSummary={donationSummaryResult.success ? donationSummaryResult.data ?? null : null}
      eventAttendance={eventAttendanceResult.success ? eventAttendanceResult.data ?? null : null}
    />
  );
}
