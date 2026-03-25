// AI Document Generation Prompts for Forever Forward
// Used to generate proposals, contracts, and other business documents

import type { MspClient, ITAssessmentData } from "@/types/database";
import type { ClientAnalysisResult } from "./client-analysis";

export interface ProposalInput {
  client: MspClient;
  assessmentData?: ITAssessmentData;
  websiteAnalysis?: ClientAnalysisResult;
  customServices?: string[];
  customPricing?: string;
  additionalContext?: string;
}

export interface ContractInput {
  client: MspClient;
  servicePackage: string;
  monthlyValue: number;
  contractTermMonths: number;
  startDate: string;
  services: string[];
  additionalTerms?: string;
}

export function getDocumentGeneratorSystemPrompt(): string {
  return `You are a professional document writer for Forever Forward, a 501(c)(3) nonprofit that provides managed IT services to other nonprofits and schools in Los Angeles.

## About Forever Forward
- Founded by Thomas "TJ" Wilform
- Based at 6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047
- Phone: (951) 877-5196
- Email: 4ever4wardfoundation@gmail.com
- Website: forever4ward.org
- EIN: [501(c)(3) nonprofit]

## Our Unique Value Proposition
1. **Mission-Aligned**: We're a nonprofit serving nonprofits - we understand budget constraints and mission focus
2. **Workforce Development**: Our technicians come from our Father Forward and Tech-Ready Youth programs
3. **Community Impact**: Every contract supports job training for Black fathers and youth
4. **Enterprise Quality**: Dell, SonicWall, Ubiquiti, Microsoft 365 stack

## Service Packages
1. **Foundation Package** - $200-$2,000 setup + $50-150/month
   - For small nonprofits (1-15 users)
   - Microsoft 365 Nonprofit setup
   - Basic security & email support

2. **Growth Package** - $50-$85/user/month
   - For growing orgs (15-75 users)
   - Full managed IT
   - Help desk, monitoring, security

3. **IT Refresh** - $75-$150/device
4. **Structured Cabling** - $150-$300/drop
5. **CCTV Install** - $2,500-$8,000+
6. **Software Development** - $1,500-$10,000

## Document Style
- Professional but warm
- Clear and specific
- Nonprofit-friendly language
- Focus on value and impact
- Include specific deliverables and timelines`;
}

export function getProposalGenerationPrompt(input: ProposalInput): string {
  const { client, assessmentData, websiteAnalysis, customServices, customPricing, additionalContext } = input;

  let prompt = `Generate a professional IT services proposal for this potential client.

## Client Information
- **Organization**: ${client.organization_name}
- **Type**: ${client.organization_type || "Nonprofit"}
- **Contact**: ${client.primary_contact_name}
- **Email**: ${client.primary_contact_email}
- **Phone**: ${client.primary_contact_phone || "N/A"}
- **User Count**: ${client.user_count || "TBD"}
- **Website**: ${client.website || "N/A"}
`;

  // Include assessment data if available (provides rich context)
  if (assessmentData || client.assessment_data) {
    const data = assessmentData || client.assessment_data;
    if (data) {
      prompt += `
## IT Assessment Results (Client Completed Form)
This client completed our detailed IT assessment form, providing valuable context:

### Current IT Situation
- **Has IT Support**: ${data.hasItSupport ? "Yes" : "No"}
${data.currentItProvider ? `- **Current Provider**: ${data.currentItProvider}` : ""}
${data.currentItSpendMonthly ? `- **Current Monthly IT Spend**: $${data.currentItSpendMonthly} (use this for value comparison)` : ""}
${data.supportType ? `- **Support Type Needed**: ${data.supportType}` : ""}
- **Has Internal IT Staff**: ${data.hasItStaff ? `Yes (${data.itStaffCount || 1} staff)` : "No"}

### Technology Inventory
${data.deviceCount ? `- **Devices**: ${data.deviceCount} computers/laptops` : ""}
${data.serverCount ? `- **Servers**: ${data.serverCount}` : ""}
${data.cloudServices && data.cloudServices.length > 0 ? `- **Cloud Services in Use**: ${data.cloudServices.join(", ")}` : ""}

### Pain Points & Priorities (CRITICAL - address these directly in proposal)
${data.painPoints && data.painPoints.length > 0 ? `- **Pain Points**: ${data.painPoints.join(", ")}` : ""}
${data.topPriorities && data.topPriorities.length > 0 ? `- **Top Priorities (ranked)**: ${data.topPriorities.join(" > ")}` : ""}
${data.biggestChallenge ? `- **Their Biggest Challenge**: "${data.biggestChallenge}"` : ""}
${data.idealOutcome ? `- **Their Ideal Outcome**: "${data.idealOutcome}"` : ""}

### Decision Context
${data.decisionTimeline ? `- **Timeline**: ${formatTimeline(data.decisionTimeline)}` : ""}
${data.budgetRange ? `- **Budget Range**: ${formatBudgetRange(data.budgetRange)}` : ""}
${data.servicesInterested && data.servicesInterested.length > 0 ? `- **Services Interested In**: ${data.servicesInterested.join(", ")}` : ""}
${data.additionalNotes ? `- **Additional Notes**: "${data.additionalNotes}"` : ""}

**IMPORTANT**: This proposal should directly address their pain points, align with their priorities, and compare favorably to their current spend (if provided). Use their own words where appropriate.
`;
    }
  }

  if (websiteAnalysis) {
    prompt += `
## Website Analysis Insights
- **Summary**: ${websiteAnalysis.organization_summary}
- **Mission**: ${websiteAnalysis.mission_statement || "N/A"}
- **Target Audience**: ${websiteAnalysis.target_audience || "N/A"}
- **Staff Size**: ${websiteAnalysis.staff_size_estimate || "Unknown"}
- **Potential Pain Points**: ${websiteAnalysis.pain_points?.join(", ") || "N/A"}
- **Recommended Services**: ${websiteAnalysis.recommended_services?.join(", ") || "N/A"}
- **Key Talking Points**: ${websiteAnalysis.proposal_talking_points?.join("; ") || "N/A"}
`;
  }

  if (client.services && client.services.length > 0) {
    prompt += `\n## Services of Interest\n${client.services.join(", ")}\n`;
  }

  if (customServices) {
    prompt += `\n## Custom Services Requested\n${customServices.join(", ")}\n`;
  }

  if (customPricing) {
    prompt += `\n## Custom Pricing Notes\n${customPricing}\n`;
  }

  if (additionalContext) {
    prompt += `\n## Additional Context\n${additionalContext}\n`;
  }

  prompt += `
## Output Format
Generate a complete proposal in markdown format with these sections:

1. **Cover/Title** - Professional header with Forever Forward branding
2. **Executive Summary** - 2-3 paragraphs personalized to their organization
3. **Understanding Your Needs** - Show you understand their challenges (reference their assessment responses!)
4. **Proposed Solution** - Detailed service description aligned with their priorities
5. **Implementation Timeline** - Realistic phases with milestones
6. **Investment** - Clear pricing table${assessmentData?.currentItSpendMonthly ? " (show value comparison to current spend)" : " (use realistic estimates)"}
7. **Why Forever Forward** - Our unique value (mission alignment, community impact)
8. **Next Steps** - Clear call to action matching their decision timeline
9. **About Forever Forward** - Brief company overview

Make the proposal specific to their organization, not generic. Reference their mission, programs, and ESPECIALLY their stated pain points and ideal outcomes where possible.`;

  return prompt;
}

// Helper functions for formatting assessment data
function formatTimeline(timeline: string): string {
  const map: Record<string, string> = {
    immediately: "As soon as possible (HOT LEAD)",
    "1-2_weeks": "Within 1-2 weeks (warm lead)",
    "1_month": "Within a month",
    "3_months_plus": "3+ months out",
    just_exploring: "Just exploring options",
  };
  return map[timeline] || timeline;
}

function formatBudgetRange(range: string): string {
  const map: Record<string, string> = {
    under_500: "Under $500/month",
    "500_1000": "$500 - $1,000/month",
    "1000_2500": "$1,000 - $2,500/month",
    "2500_5000": "$2,500 - $5,000/month",
    "5000_plus": "$5,000+/month",
    not_sure: "Not sure yet",
  };
  return map[range] || range;
}

export interface AssessmentSummaryInput {
  client: MspClient;
  assessmentData: ITAssessmentData;
}

export function getAssessmentSummaryPrompt(input: AssessmentSummaryInput): string {
  const { client, assessmentData } = input;

  return `Analyze this IT assessment submission and generate a sales brief for the team.

## Assessment Data
- **Organization**: ${assessmentData.organizationName}
- **Type**: ${assessmentData.organizationType}
- **User Count**: ${assessmentData.userCount}
- **Contact**: ${assessmentData.firstName} ${assessmentData.lastName} (${assessmentData.email})

### Current IT Situation
- Has IT Support: ${assessmentData.hasItSupport ? "Yes" : "No"}
${assessmentData.currentItProvider ? `- Current Provider: ${assessmentData.currentItProvider}` : "- No current provider"}
${assessmentData.currentItSpendMonthly ? `- Monthly Spend: $${assessmentData.currentItSpendMonthly}` : ""}
${assessmentData.supportType ? `- Support Type: ${assessmentData.supportType}` : ""}
- Internal IT Staff: ${assessmentData.hasItStaff ? `Yes (${assessmentData.itStaffCount || 1})` : "No"}

### Technology
${assessmentData.deviceCount ? `- Devices: ${assessmentData.deviceCount}` : ""}
${assessmentData.serverCount ? `- Servers: ${assessmentData.serverCount}` : ""}
${assessmentData.cloudServices.length > 0 ? `- Cloud Services: ${assessmentData.cloudServices.join(", ")}` : "- No cloud services"}

### Pain Points & Priorities
- Pain Points: ${assessmentData.painPoints.join(", ") || "None specified"}
- Top Priorities: ${assessmentData.topPriorities.join(" > ") || "None specified"}
${assessmentData.biggestChallenge ? `- Biggest Challenge: "${assessmentData.biggestChallenge}"` : ""}
${assessmentData.idealOutcome ? `- Ideal Outcome: "${assessmentData.idealOutcome}"` : ""}

### Decision Context
- Timeline: ${formatTimeline(assessmentData.decisionTimeline)}
- Budget: ${formatBudgetRange(assessmentData.budgetRange)}
- Services Interested: ${assessmentData.servicesInterested.join(", ") || "Not specified"}
${assessmentData.additionalNotes ? `- Notes: "${assessmentData.additionalNotes}"` : ""}

## Output Format
Generate a structured JSON object with:

\`\`\`json
{
  "executive_summary": "2-3 sentence summary of this lead's situation and potential",
  "recommended_package": "foundation | growth | enterprise",
  "estimated_monthly_value": number,
  "urgency_score": 1-10,
  "urgency_reason": "Why this score",
  "key_pain_points": ["top 3 pain points to address"],
  "talking_points": ["3-5 points to discuss in first call"],
  "competitive_intel": "Notes about their current provider if applicable",
  "red_flags": ["Any concerns about this lead"],
  "next_action": "Recommended next step"
}
\`\`\`

Be honest and realistic in your assessment. This helps the sales team prioritize and prepare.`;
}

export function getContractGenerationPrompt(input: ContractInput): string {
  const { client, servicePackage, monthlyValue, contractTermMonths, startDate, services, additionalTerms } = input;

  return `Generate a professional IT services contract for this client.

## Client Information
- **Organization**: ${client.organization_name}
- **Contact**: ${client.primary_contact_name}
- **Email**: ${client.primary_contact_email}
- **Address**: ${[client.address_line1, client.city, client.state, client.zip_code].filter(Boolean).join(", ")}

## Contract Terms
- **Service Package**: ${servicePackage}
- **Monthly Value**: $${monthlyValue}
- **Contract Term**: ${contractTermMonths} months
- **Start Date**: ${startDate}
- **Services Included**: ${services.join(", ")}
${additionalTerms ? `- **Additional Terms**: ${additionalTerms}` : ""}

## Output Format
Generate a professional services agreement in markdown with these sections:

1. **Header** - Contract title, parties, effective date
2. **Scope of Services** - Detailed description of what's included
3. **Service Level Agreement** - Response times, uptime guarantees
4. **Fees and Payment** - Monthly amount, payment terms, invoicing
5. **Term and Termination** - Contract length, renewal, early termination
6. **Client Responsibilities** - What the client must provide
7. **Limitation of Liability** - Standard nonprofit-friendly terms
8. **Confidentiality** - Data protection provisions
9. **Signature Block** - Spaces for both parties

Use professional legal language but keep it readable. This is a nonprofit serving a nonprofit.`;
}
