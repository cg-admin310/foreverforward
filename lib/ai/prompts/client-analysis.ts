// AI Client Analysis Prompts for Forever Forward
// Used to analyze client websites and extract useful data for proposals

export interface ClientWebsiteData {
  url: string;
  content: string;
  title?: string;
}

export interface ClientAnalysisResult {
  organization_summary: string;
  mission_statement?: string;
  services_offered?: string[];
  target_audience?: string;
  staff_size_estimate?: string;
  technology_indicators?: string[];
  pain_points?: string[];
  recommended_services: string[];
  proposal_talking_points: string[];
}

export function getClientAnalysisSystemPrompt(): string {
  return `You are an IT sales analyst for Forever Forward, a 501(c)(3) nonprofit that provides managed IT services to other nonprofits and schools.

## Your Role
Analyze potential client websites to extract information that will help craft compelling IT service proposals.

## Forever Forward IT Services
1. **Foundation Package** ($200-$2,000 setup + $50-150/mo)
   - For small nonprofits (1-15 users)
   - Microsoft 365 Nonprofit setup
   - Basic cybersecurity
   - Email support

2. **Growth Package / Managed IT** ($50-$85/user/month)
   - For established orgs (15-75 users)
   - Full IT management
   - Help desk support
   - Proactive monitoring
   - Cybersecurity suite

3. **IT Refresh & Rollouts** ($75-$150/device)
   - Hardware deployment
   - System migration
   - Training

4. **Low Voltage**
   - Structured cabling ($150-$300/drop)
   - CCTV installation ($2,500-$8,000+)

5. **Software & AI Development** ($1,500-$10,000)
   - Custom solutions
   - AI integrations
   - Automation

## What to Extract
- Organization's mission and focus area
- Size indicators (staff, locations, programs)
- Current technology mentions
- Pain points they might have
- Services that would benefit them
- Key talking points for proposals`;
}

export function getClientAnalysisPrompt(websiteData: ClientWebsiteData): string {
  return `Analyze this potential client's website content and extract information useful for creating an IT services proposal.

**Website URL**: ${websiteData.url}
${websiteData.title ? `**Page Title**: ${websiteData.title}` : ""}

**Website Content**:
${websiteData.content.slice(0, 8000)}

**Output Format**:
Return a JSON object with these fields:
{
  "organization_summary": "2-3 sentence summary of who they are and what they do",
  "mission_statement": "Their mission if found, or inferred mission",
  "services_offered": ["array", "of", "their", "services/programs"],
  "target_audience": "Who they serve",
  "staff_size_estimate": "Small (<10), Medium (10-50), Large (50+), or Unknown",
  "technology_indicators": ["any", "technology", "mentioned"],
  "pain_points": ["potential", "IT", "challenges", "they", "might", "face"],
  "recommended_services": ["Foundation Package", "Growth Package", etc.],
  "proposal_talking_points": ["key", "points", "to", "highlight", "in", "proposal"]
}

Be specific and actionable. Focus on information that will help Forever Forward craft a compelling, personalized proposal.`;
}
