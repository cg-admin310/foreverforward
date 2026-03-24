// AI Document Generation Prompts for Forever Forward
// Used to generate proposals, contracts, and other business documents

import type { MspClient } from "@/types/database";
import type { ClientAnalysisResult } from "./client-analysis";

export interface ProposalInput {
  client: MspClient;
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
  const { client, websiteAnalysis, customServices, customPricing, additionalContext } = input;

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
3. **Understanding Your Needs** - Show you understand their challenges
4. **Proposed Solution** - Detailed service description
5. **Implementation Timeline** - Realistic phases with milestones
6. **Investment** - Clear pricing table (use realistic estimates)
7. **Why Forever Forward** - Our unique value (mission alignment, community impact)
8. **Next Steps** - Clear call to action
9. **About Forever Forward** - Brief company overview

Make the proposal specific to their organization, not generic. Reference their mission and programs where possible.`;

  return prompt;
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
