// Assessment Summary Utilities
// For generating human-readable summaries of assessment data

import type { ITAssessmentData } from "@/types/database";

/**
 * Generate a formatted text summary of assessment data
 * Used for AI consumption and display purposes
 */
export function generateAssessmentSummary(data: ITAssessmentData): string {
  const lines: string[] = [];

  lines.push(`## Organization: ${data.organizationName}`);
  lines.push(`- Type: ${data.organizationType}`);
  lines.push(`- Staff/Users: ${data.userCount}`);
  if (data.website) lines.push(`- Website: ${data.website}`);

  lines.push("\n## Current IT Situation");
  lines.push(`- Has IT Support: ${data.hasItSupport ? "Yes" : "No"}`);
  if (data.currentItProvider) lines.push(`- Current Provider: ${data.currentItProvider}`);
  if (data.currentItSpendMonthly) lines.push(`- Monthly IT Spend: $${data.currentItSpendMonthly}`);
  if (data.supportType) lines.push(`- Support Type: ${data.supportType}`);
  lines.push(`- Has Internal IT Staff: ${data.hasItStaff ? `Yes (${data.itStaffCount || 1})` : "No"}`);

  lines.push("\n## Technology Inventory");
  if (data.deviceCount) lines.push(`- Devices: ${data.deviceCount}`);
  if (data.serverCount) lines.push(`- Servers: ${data.serverCount}`);
  if (data.cloudServices.length > 0) lines.push(`- Cloud Services: ${data.cloudServices.join(", ")}`);

  lines.push("\n## Challenges & Priorities");
  if (data.painPoints.length > 0) lines.push(`- Pain Points: ${data.painPoints.join(", ")}`);
  if (data.topPriorities.length > 0) lines.push(`- Top Priorities (ranked): ${data.topPriorities.join(" > ")}`);
  if (data.biggestChallenge) lines.push(`- Biggest Challenge: "${data.biggestChallenge}"`);
  if (data.idealOutcome) lines.push(`- Ideal Outcome: "${data.idealOutcome}"`);

  lines.push("\n## Decision Context");
  lines.push(`- Timeline: ${data.decisionTimeline}`);
  lines.push(`- Budget Range: ${data.budgetRange}`);
  if (data.servicesInterested.length > 0) {
    lines.push(`- Services Interested: ${data.servicesInterested.join(", ")}`);
  }
  if (data.additionalNotes) lines.push(`- Additional Notes: "${data.additionalNotes}"`);

  return lines.join("\n");
}
