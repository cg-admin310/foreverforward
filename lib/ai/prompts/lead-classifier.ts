// AI Lead Classification Prompts for Forever Forward
// Used to automatically classify leads, recommend programs, and score priority

import type {
  LeadType,
  ProgramType,
  ProgramAssessmentData,
  EnhancedITAssessmentData,
  BarrierType,
  SupportNeedType,
  ReadinessLevel,
  ComplianceRequirement,
} from "@/types/database";

// ============================================================================
// PROGRAM CLASSIFIER
// ============================================================================

export function getProgramClassifierSystemPrompt(): string {
  return `You are a program placement specialist for Forever Forward, a 501(c)(3) nonprofit in Los Angeles that empowers Black fathers and youth through workforce development and IT services.

## Available Programs

### 1. Father Forward
- **Duration**: 8 weeks
- **Audience**: Fathers seeking IT career entry
- **Focus**: IT fundamentals, cybersecurity, AI/automation, leadership, Google IT Certificate prep
- **Best For**: Unemployed/underemployed fathers wanting career change, those with basic tech interest
- **Requirements**: Must be a father, commitment to 8-week program, basic computer skills helpful
- **Outcomes**: Google IT certification, job placement support, ongoing mentorship via Travis AI

### 2. Tech-Ready Youth
- **Duration**: 8 weeks
- **Audience**: Youth ages 16+
- **Focus**: Google IT Certificate prep, hands-on labs, capstone Gaming Tournament
- **Best For**: Young adults seeking IT career entry, those preparing for workforce
- **Requirements**: Age 16+, commitment to certification track
- **Outcomes**: Google IT certification, career readiness

### 3. Making Moments
- **Duration**: Ongoing events
- **Audience**: Fathers and their families
- **Focus**: Movies on the Menu dinner+movie series, family bonding experiences
- **Best For**: Fathers wanting to strengthen family connections, community building
- **Requirements**: None - open to all families
- **Outcomes**: Stronger father-child relationships, community connections

### 4. From Script to Screen
- **Duration**: Multi-phase
- **Audience**: Students interested in media production
- **Focus**: Filmmaking with Dawnn Lewis, Unreal Engine, annual film festival
- **Best For**: Creative youth interested in storytelling and media
- **Requirements**: Interest in filmmaking/creative expression
- **Outcomes**: Portfolio pieces, film festival participation

### 5. Stories from My Future
- **Duration**: Workshop
- **Audience**: Kids/youth
- **Focus**: Storytelling + AI + Bambu Lab 3D printing
- **Best For**: Children interested in creativity and tech
- **Requirements**: Parent involvement
- **Outcomes**: 3D printed creation, storytelling skills

### 6. LULA (Level Up Learning Academy)
- **Duration**: Ongoing
- **Audience**: Youth
- **Focus**: STEM platform, gamified learning
- **Best For**: Those needing flexible, self-paced learning
- **Requirements**: Internet access
- **Outcomes**: STEM skills, badges/certifications

## Your Task
When given assessment data, you must:
1. Recommend 1-3 programs sorted by fit (highest first)
2. Provide fit scores (0-100) based on how well they match
3. Explain your reasoning
4. Identify barriers that need addressing
5. Identify support services they may need
6. Assess their readiness level (high/medium/low)

Be empathetic but practical. Consider their circumstances holistically.`;
}

export interface ProgramClassificationInput {
  assessment: ProgramAssessmentData;
  leadId?: string;
}

export function getProgramClassificationPrompt(input: ProgramClassificationInput): string {
  const { assessment } = input;

  return `Analyze this program assessment and recommend the best Forever Forward programs.

## Assessment Data

**Personal Info:**
- Name: ${assessment.firstName} ${assessment.lastName}
- Is Father: ${assessment.isFather ? "Yes" : "No"}
${assessment.numberOfChildren ? `- Children: ${assessment.numberOfChildren} (Ages: ${assessment.childrenAges?.join(", ") || "Not specified"})` : ""}
- Minor: ${assessment.isMinor ? "Yes" : "No"}

**Current Situation:**
- Employment: ${formatEmploymentStatus(assessment.currentEmploymentStatus)}
${assessment.monthlyIncomeRange ? `- Income Range: ${formatIncomeRange(assessment.monthlyIncomeRange)}` : ""}
- Education: ${formatEducation(assessment.highestEducation)}
- Barriers: ${assessment.barriers.length > 0 ? assessment.barriers.join(", ") : "None identified"}
${assessment.otherBarrier ? `- Other Barrier: ${assessment.otherBarrier}` : ""}

**Tech Background:**
- IT Experience: ${assessment.itExperienceLevel}
- Has Computer: ${assessment.hasComputer ? "Yes" : "No"}
- Has Internet: ${assessment.hasInternet ? "Yes" : "No"}
- Tech Interests: ${assessment.techInterests.length > 0 ? assessment.techInterests.join(", ") : "None specified"}

**Goals & Availability:**
- Primary Goal: ${formatGoal(assessment.primaryGoal)}
${assessment.sixMonthVision ? `- 6-Month Vision: "${assessment.sixMonthVision}"` : ""}
${assessment.whatBroughtYouHere ? `- What Brought Them: "${assessment.whatBroughtYouHere}"` : ""}
- Preferred Schedule: ${assessment.preferredSchedule}
- Has Transportation: ${assessment.hasReliableTransportation ? "Yes" : "No"}
- Childcare Needs: ${assessment.hasChildcareNeeds ? "Yes" : "No"}

${assessment.isMinor ? `
**Youth Info:**
- Parent/Guardian: ${assessment.parentGuardianName || "Not provided"}
- School: ${assessment.schoolName || "Not provided"}
- Grade: ${assessment.gradeLevel || "Not provided"}
` : ""}

## Output Format
Return a JSON object:
{
  "recommended_programs": [
    {
      "program": "father_forward" | "tech_ready_youth" | "making_moments" | "from_script_to_screen" | "stories_from_my_future" | "lula",
      "fit_score": 0-100,
      "reasoning": "2-3 sentences explaining why this program fits"
    }
  ],
  "barriers_identified": ["transportation", "childcare", etc.],
  "support_needs": ["job_training", "certification", "mentorship", etc.],
  "readiness_level": "high" | "medium" | "low",
  "readiness_reasoning": "Why they are/aren't ready to start",
  "priority_score": 1-100,
  "urgency_level": "low" | "medium" | "high" | "critical",
  "next_steps": ["action 1", "action 2", "action 3"]
}`;
}

// ============================================================================
// MSP LEAD CLASSIFIER
// ============================================================================

export function getMspClassifierSystemPrompt(): string {
  return `You are an IT sales analyst for Forever Forward, a 501(c)(3) nonprofit providing managed IT services to nonprofits and schools in Greater Los Angeles.

## Service Packages

### Foundation Package ($200-$2,000 setup + $50-150/month)
- For small nonprofits (1-15 users)
- Microsoft 365 Nonprofit setup and management
- Basic cybersecurity essentials
- Email and phone support
- Quarterly check-ins

### Growth Package / Managed IT ($50-$85/user/month)
- For established orgs (15-75 users)
- Full IT management and help desk
- 24/7 monitoring and proactive maintenance
- Complete cybersecurity suite
- On-site support as needed
- Technology planning and budgeting

### Enterprise/Custom (75+ users)
- Tailored solutions for larger organizations
- Dedicated account manager
- Custom SLA

### Project-Based Services
- IT Refresh & Rollouts: $75-$150/device
- Structured Cabling: $150-$300/drop
- CCTV Installation: $2,500-$8,000+
- Software & AI Development: $1,500-$10,000

## Compliance Premiums
- HIPAA compliance: +20-25%
- FERPA compliance: +15-20%
- PCI-DSS compliance: +15-20%
- SOC 2 readiness: +20-25%

## Your Task
Analyze IT assessments to:
1. Recommend service package
2. Estimate monthly value
3. Identify pain points and priorities
4. Assess urgency level
5. Calculate priority score
6. Suggest next steps for sales team`;
}

export interface MspClassificationInput {
  assessment: EnhancedITAssessmentData;
  leadId?: string;
}

export function getMspClassificationPrompt(input: MspClassificationInput): string {
  const { assessment } = input;

  return `Analyze this IT assessment and provide classification for the sales team.

## Assessment Data

**Organization:**
- Name: ${assessment.organizationName}
- Type: ${assessment.organizationType}
${assessment.website ? `- Website: ${assessment.website}` : ""}
- User Count: ${assessment.userCount}
${assessment.officeCount ? `- Office Locations: ${assessment.officeCount}` : ""}
${assessment.remoteWorkerPercent ? `- Remote Workers: ${assessment.remoteWorkerPercent}%` : ""}

**Current IT Situation:**
- Has IT Support: ${assessment.hasItSupport ? "Yes" : "No"}
${assessment.currentItProvider ? `- Current Provider: ${assessment.currentItProvider}` : ""}
${assessment.currentItSpendMonthly ? `- Monthly IT Spend: $${assessment.currentItSpendMonthly}` : ""}
- Support Type Needed: ${assessment.supportType || "Not specified"}
- Has Internal IT Staff: ${assessment.hasItStaff ? `Yes (${assessment.itStaffCount || "?"} staff)` : "No"}

**Infrastructure:**
- Devices: ${assessment.deviceCount || "Unknown"}
- Servers: ${assessment.serverCount || "Unknown"}
- Cloud Services: ${assessment.cloudServices?.join(", ") || "None specified"}

**Compliance:**
- Requirements: ${assessment.complianceRequirements?.join(", ") || "None"}
- Disaster Recovery: ${assessment.disasterRecoveryStatus || "Unknown"}
${assessment.currentBackupSolution ? `- Current Backup: ${assessment.currentBackupSolution}` : ""}
${assessment.growthProjectionUsers ? `- Expected Growth: +${assessment.growthProjectionUsers} users in 12 months` : ""}

**Challenges:**
- Pain Points: ${assessment.painPoints?.join(", ") || "None specified"}
- Top Priorities: ${assessment.topPriorities?.join(", ") || "None specified"}
${assessment.biggestChallenge ? `- Biggest Challenge: "${assessment.biggestChallenge}"` : ""}
${assessment.idealOutcome ? `- Ideal Outcome: "${assessment.idealOutcome}"` : ""}

**Decision Context:**
- Services Interested: ${assessment.servicesInterested?.join(", ") || "None specified"}
- Timeline: ${assessment.decisionTimeline || "Unknown"}
- Budget Range: ${assessment.budgetRange || "Unknown"}
${assessment.stakeholderConcerns?.length ? `- Stakeholder Concerns: ${assessment.stakeholderConcerns.join(", ")}` : ""}

## Output Format
Return a JSON object:
{
  "recommended_package": "foundation" | "growth" | "enterprise" | "custom",
  "estimated_monthly_value": number,
  "service_recommendations": ["managed_it", "security", "cloud", etc.],
  "pain_points": ["identified", "pain", "points"],
  "infrastructure_summary": {
    "users": number,
    "devices": number,
    "servers": number,
    "locations": number,
    "compliance_needs": ["hipaa", etc.]
  },
  "priority_score": 1-100,
  "urgency_level": "low" | "medium" | "high" | "critical",
  "fit_score": 0-100,
  "reasoning": "Why they're a good/poor fit for FF services",
  "next_steps": ["schedule discovery call", "send proposal", etc.],
  "proposal_talking_points": ["key", "points", "for", "proposal"]
}`;
}

// ============================================================================
// GENERAL INTENT DETECTOR
// ============================================================================

export function getIntentDetectorSystemPrompt(): string {
  return `You are an intent analyzer for Forever Forward, helping classify general inquiries into appropriate lead types.

## Lead Types
- **program**: Interested in workforce development programs (Father Forward, Tech-Ready Youth, etc.)
- **msp**: Interested in IT services for their organization
- **volunteer**: Wants to volunteer time/skills
- **partner**: Interested in organizational partnership
- **donation**: Interested in donating
- **general**: General inquiry, unclear intent

## Signals
**Program Intent:**
- Mentions being a father, youth, family
- Asks about training, certification, career change
- Mentions employment challenges, skill building
- References specific programs

**MSP Intent:**
- Mentions organization/nonprofit/school
- Asks about IT support, technology, cybersecurity
- Mentions tech problems, upgrades, compliance
- References specific services

**Volunteer Intent:**
- Wants to help, give back, contribute time
- Mentions skills they can offer
- Asks about volunteer opportunities

**Partner Intent:**
- Represents another organization
- Mentions collaboration, joint programs
- Asks about referral relationships

**Donation Intent:**
- Mentions giving, supporting financially
- Asks about tax deductions, donation methods

Analyze the contact form message and classify the true intent.`;
}

export interface IntentDetectionInput {
  message: string;
  subject?: string;
  name?: string;
  organization?: string;
}

export function getIntentDetectionPrompt(input: IntentDetectionInput): string {
  return `Analyze this contact form submission and determine the true intent.

**From:** ${input.name || "Unknown"}
${input.organization ? `**Organization:** ${input.organization}` : ""}
${input.subject ? `**Subject:** ${input.subject}` : ""}

**Message:**
"${input.message}"

## Output Format
{
  "detected_intent": "program" | "msp" | "volunteer" | "partner" | "donation" | "general",
  "confidence": 0-1,
  "reasoning": "Why you classified it this way",
  "suggested_program_interest": "father_forward" | "tech_ready_youth" | etc. (if program),
  "suggested_services": ["managed_it", "security", etc.] (if msp),
  "priority_score": 1-100,
  "urgency_level": "low" | "medium" | "high",
  "recommended_response": "Brief suggestion for how to respond"
}`;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatEmploymentStatus(status: string): string {
  const mapping: Record<string, string> = {
    employed_full: "Employed Full-Time",
    employed_part: "Employed Part-Time",
    unemployed_looking: "Unemployed - Seeking Work",
    unemployed_not: "Unemployed - Not Seeking",
    self_employed: "Self-Employed",
    student: "Student",
    retired: "Retired",
    disabled: "Disabled",
  };
  return mapping[status] || status;
}

function formatIncomeRange(range: string): string {
  const mapping: Record<string, string> = {
    under_1000: "Under $1,000/month",
    "1000_2500": "$1,000-$2,500/month",
    "2500_5000": "$2,500-$5,000/month",
    "5000_plus": "$5,000+/month",
    prefer_not_say: "Prefer not to say",
  };
  return mapping[range] || range;
}

function formatEducation(level: string): string {
  const mapping: Record<string, string> = {
    less_than_high_school: "Less than High School",
    high_school_ged: "High School/GED",
    some_college: "Some College",
    associates: "Associate's Degree",
    bachelors: "Bachelor's Degree",
    masters_plus: "Master's or Higher",
  };
  return mapping[level] || level;
}

function formatGoal(goal: string): string {
  const mapping: Record<string, string> = {
    career_change: "Career Change",
    certification: "Earn Certification",
    skills_upgrade: "Upgrade Current Skills",
    employment: "Find Employment",
    personal_growth: "Personal Growth",
    help_family: "Help My Family",
    creative_expression: "Creative Expression",
  };
  return mapping[goal] || goal;
}
