"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Lead,
  LeadInsert,
  LeadType,
  ProgramType,
  ProgramAssessmentData,
  EnhancedITAssessmentData,
  AILeadClassification,
  BarrierType,
  SupportNeedType,
  ReadinessLevel,
} from "@/types/database";
import { classifyLead } from "@/lib/ai/classify-lead";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type FormType =
  | "program_enrollment"
  | "program_assessment"
  | "it_assessment"
  | "contact"
  | "volunteer"
  | "partner"
  | "donation"
  | "newsletter"
  | "event_ticket";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadRoutingInput {
  formType: FormType;
  formData: Record<string, unknown>;
  utmParams?: UTMParams;
}

export interface LeadRoutingResult {
  leadId: string;
  leadType: LeadType;
  nextSteps: string[];
  aiClassification?: AILeadClassification;
  secondaryRecordId?: string;
  secondaryRecordType?: "participant" | "msp_client" | "donation" | "attendee";
}

// Form type to lead type mapping
const FORM_TO_LEAD_TYPE: Record<FormType, LeadType> = {
  program_enrollment: "program",
  program_assessment: "program",
  it_assessment: "msp",
  contact: "general",
  volunteer: "volunteer",
  partner: "partner",
  donation: "donation",
  newsletter: "general",
  event_ticket: "general",
};

// Form types that create secondary records
const CREATES_SECONDARY_RECORD: FormType[] = [
  "program_enrollment",
  "it_assessment",
  "donation",
  "event_ticket",
];

// ============================================================================
// MAIN ROUTING FUNCTION
// ============================================================================

export async function routeFormSubmission(
  input: LeadRoutingInput
): Promise<ActionResult<LeadRoutingResult>> {
  try {
    const adminClient = createAdminClient();
    const { formType, formData, utmParams } = input;
    const leadType = FORM_TO_LEAD_TYPE[formType];

    // Step 1: Prepare lead data based on form type
    const leadData = prepareLeadData(formType, formData, utmParams);

    // Step 2: Create lead record
    const { data: lead, error: leadError } = await adminClient
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error("Error creating lead:", leadError);
      return { success: false, error: leadError.message };
    }

    // Step 3: Create secondary record if applicable
    let secondaryResult: { id: string; type: "participant" | "msp_client" | "donation" | "attendee" } | null = null;

    if (CREATES_SECONDARY_RECORD.includes(formType)) {
      secondaryResult = await createSecondaryRecord(adminClient, formType, lead, formData);
    }

    // Step 4: Trigger AI classification (immediate, as per user preference)
    let aiClassification: AILeadClassification | undefined;
    try {
      const classificationResult = await classifyLead(lead.id);
      if (classificationResult.success && classificationResult.data) {
        aiClassification = classificationResult.data;
      }
    } catch (classifyError) {
      console.error("AI classification failed (non-blocking):", classifyError);
      // Don't fail the submission if AI classification fails
    }

    // Step 5: Log activity
    await adminClient.from("activities").insert({
      activity_type: "lead_created",
      description: `New ${leadType} lead from ${formType.replace(/_/g, " ")}`,
      lead_id: lead.id,
      metadata: {
        form_type: formType,
        source: formData.source || "website",
        ai_classified: !!aiClassification,
      },
      performed_by: null,
    });

    // Step 6: Determine next steps
    const nextSteps = determineNextSteps(leadType, formType, aiClassification);

    // Revalidate relevant paths
    revalidatePath("/leads");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        leadId: lead.id,
        leadType,
        nextSteps,
        aiClassification,
        secondaryRecordId: secondaryResult?.id,
        secondaryRecordType: secondaryResult?.type,
      },
    };
  } catch (error) {
    console.error("Error in routeFormSubmission:", error);
    return { success: false, error: "Failed to process form submission" };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function prepareLeadData(
  formType: FormType,
  formData: Record<string, unknown>,
  utmParams?: UTMParams
): LeadInsert {
  const leadType = FORM_TO_LEAD_TYPE[formType];
  const now = new Date().toISOString();

  // Base lead data that all forms share
  const baseData: LeadInsert = {
    first_name: (formData.firstName as string) || (formData.first_name as string) || "",
    last_name: (formData.lastName as string) || (formData.last_name as string) || "",
    email: (formData.email as string) || "",
    phone: (formData.phone as string) || null,
    organization: (formData.organization as string) || (formData.organizationName as string) || null,
    title: (formData.title as string) || null,
    lead_type: leadType,
    status: "new",
    source: formType,
    utm_source: utmParams?.utm_source || null,
    utm_medium: utmParams?.utm_medium || null,
    utm_campaign: utmParams?.utm_campaign || null,
    priority_score: null,
    estimated_value: null,
    referral_source: null,
    ai_classification: null,
    assigned_to: null,
    tags: null,
    contacted_at: null,
    converted_at: null,
    program_interest: null,
    service_interests: null,
    notes: null,
    // New assessment fields
    assessment_data: null,
    assessment_completed_at: null,
    fit_score: null,
    recommended_programs: null,
    barriers: null,
    support_needs: null,
    readiness_level: null,
    compliance_requirements: null,
    disaster_recovery_status: null,
    growth_projection_users: null,
    office_count: null,
    remote_worker_percent: null,
  };

  // Form-specific enrichment
  switch (formType) {
    case "program_enrollment":
      return {
        ...baseData,
        program_interest: (formData.program as ProgramType) || (formData.programInterest as ProgramType) || null,
        notes: formData.notes as string || formData.goals as string || null,
      };

    case "program_assessment":
      const programAssessment = formData as unknown as ProgramAssessmentData;
      return {
        ...baseData,
        assessment_data: programAssessment,
        assessment_completed_at: now,
        barriers: programAssessment.barriers as BarrierType[] || null,
        notes: programAssessment.whatBroughtYouHere || null,
      };

    case "it_assessment":
      const itAssessment = formData as unknown as EnhancedITAssessmentData;
      return {
        ...baseData,
        service_interests: itAssessment.servicesInterested || null,
        estimated_value: calculateEstimatedValue(itAssessment),
        assessment_data: itAssessment,
        assessment_completed_at: now,
        compliance_requirements: itAssessment.complianceRequirements || null,
        disaster_recovery_status: itAssessment.disasterRecoveryStatus || null,
        growth_projection_users: itAssessment.growthProjectionUsers || null,
        office_count: itAssessment.officeCount || null,
        remote_worker_percent: itAssessment.remoteWorkerPercent || null,
        notes: itAssessment.biggestChallenge || null,
      };

    case "contact":
      return {
        ...baseData,
        notes: `Subject: ${formData.subject || "General Inquiry"}\n\n${formData.message || ""}`,
      };

    case "volunteer":
      return {
        ...baseData,
        notes: `Availability: ${formData.availability || "Not specified"}\nSkills: ${(formData.skills as string[])?.join(", ") || "Not specified"}\n\n${formData.message || ""}`,
        tags: formData.skills as string[] || null,
      };

    case "partner":
      return {
        ...baseData,
        notes: `Partnership Type: ${formData.partnershipType || "Not specified"}\nOrg Size: ${formData.organizationSize || "Not specified"}\n\n${formData.message || ""}`,
      };

    case "donation":
      return {
        ...baseData,
        notes: `Donation Amount: $${formData.amount || 0}\nDesignation: ${formData.designation || "General"}`,
      };

    case "newsletter":
      return {
        ...baseData,
        tags: formData.interests as string[] || null,
      };

    case "event_ticket":
      return {
        ...baseData,
        notes: `Event: ${formData.eventTitle || formData.eventId}\nTickets: ${formData.ticketQuantity || 1}`,
      };

    default:
      return baseData;
  }
}

async function createSecondaryRecord(
  adminClient: ReturnType<typeof createAdminClient>,
  formType: FormType,
  lead: Lead,
  formData: Record<string, unknown>
): Promise<{ id: string; type: "participant" | "msp_client" | "donation" | "attendee" } | null> {
  try {
    switch (formType) {
      case "program_enrollment": {
        const { data: participant, error } = await adminClient
          .from("participants")
          .insert({
            lead_id: lead.id,
            first_name: lead.first_name,
            last_name: lead.last_name,
            email: lead.email,
            phone: lead.phone,
            program: (formData.program as ProgramType) || "father_forward",
            status: "applicant",
            goals: formData.goals as string || null,
            barriers: formData.barriers as string || null,
            employment_status: formData.employmentStatus as string || null,
            it_experience_level: formData.itExperienceLevel as string || null,
            how_did_you_hear: "website",
            state: "CA",
            parent_guardian_name: formData.parentGuardianName as string || null,
            parent_guardian_phone: formData.parentGuardianPhone as string || null,
            parent_guardian_email: formData.parentGuardianEmail as string || null,
          })
          .select("id")
          .single();

        if (error) throw error;
        return { id: participant.id, type: "participant" };
      }

      case "it_assessment": {
        const itData = formData as unknown as EnhancedITAssessmentData;
        const { data: client, error } = await adminClient
          .from("msp_clients")
          .insert({
            lead_id: lead.id,
            organization_name: lead.organization || `${lead.first_name} ${lead.last_name}`,
            organization_type: itData.organizationType || "nonprofit",
            website: itData.website || null,
            primary_contact_name: `${lead.first_name} ${lead.last_name}`,
            primary_contact_email: lead.email,
            primary_contact_phone: lead.phone,
            pipeline_stage: "assessment",
            services_interested: itData.servicesInterested || null,
            user_count: itData.userCount || null,
            monthly_value: calculateEstimatedValue(itData),
            assessment_completed_at: new Date().toISOString(),
            assessment_data: itData,
            device_count: itData.deviceCount || null,
            server_count: itData.serverCount || null,
            cloud_services: itData.cloudServices || null,
            pain_points: itData.painPoints || null,
            top_priorities: itData.topPriorities || null,
            biggest_challenge: itData.biggestChallenge || null,
            ideal_outcome: itData.idealOutcome || null,
            decision_timeline: itData.decisionTimeline || null,
            budget_range: itData.budgetRange || null,
            current_it_spend_monthly: itData.currentItSpendMonthly || null,
            current_it_provider: itData.currentItProvider || null,
            support_type: itData.supportType || null,
            has_it_staff: itData.hasItStaff || false,
            it_staff_count: itData.itStaffCount || null,
            compliance_requirements: itData.complianceRequirements || null,
            disaster_recovery_status: itData.disasterRecoveryStatus || null,
            growth_projection_users: itData.growthProjectionUsers || null,
            office_count: itData.officeCount || null,
            remote_worker_percent: itData.remoteWorkerPercent || null,
            state: "CA",
            days_in_stage: 0,
            stage_entered_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (error) throw error;
        return { id: client.id, type: "msp_client" };
      }

      // Add donation and event_ticket handling as needed
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error creating secondary record for ${formType}:`, error);
    return null;
  }
}

function calculateEstimatedValue(assessment: EnhancedITAssessmentData): number {
  const userCount = assessment.userCount || 0;
  let baseValue: number;

  // Tier-based pricing
  if (userCount < 15) {
    baseValue = 150; // Foundation
  } else if (userCount <= 75) {
    baseValue = userCount * 57.5; // Growth
  } else {
    baseValue = userCount * 80; // Enterprise
  }

  // Service multipliers
  const services = assessment.servicesInterested || [];
  let multiplier = 1;
  if (services.includes("security") || services.includes("cybersecurity")) multiplier += 0.15;
  if (services.includes("cloud") || services.includes("cloud_services")) multiplier += 0.10;
  if (services.includes("software") || services.includes("software_ai")) multiplier += 0.20;
  if (services.includes("network") || services.includes("network_wifi")) multiplier += 0.05;

  // Compliance premium
  const compliance = assessment.complianceRequirements || [];
  if (compliance.length > 0 && !compliance.includes("none")) {
    multiplier += 0.20;
  }

  // Round to nearest $50
  return Math.round((baseValue * multiplier) / 50) * 50;
}

function determineNextSteps(
  leadType: LeadType,
  formType: FormType,
  aiClassification?: AILeadClassification
): string[] {
  const steps: string[] = [];

  switch (leadType) {
    case "program":
      if (formType === "program_assessment") {
        if (aiClassification?.recommended_programs?.length) {
          steps.push(`Review recommended programs: ${aiClassification.recommended_programs.join(", ")}`);
        }
        steps.push("Schedule follow-up call with case worker");
        if (aiClassification?.barriers_identified?.length) {
          steps.push("Address identified barriers before enrollment");
        }
      } else {
        steps.push("Review application in Programs CRM");
        steps.push("Assign to appropriate cohort");
      }
      break;

    case "msp":
      steps.push("Review IT assessment in Clients CRM");
      if (aiClassification?.urgency_level === "critical" || aiClassification?.urgency_level === "high") {
        steps.push("PRIORITY: Schedule discovery call within 24 hours");
      } else {
        steps.push("Schedule discovery call");
      }
      steps.push("Generate initial proposal based on assessment");
      break;

    case "volunteer":
      steps.push("Review volunteer skills and availability");
      steps.push("Match with current volunteer opportunities");
      steps.push("Schedule orientation call");
      break;

    case "partner":
      steps.push("Review partnership opportunity");
      steps.push("Schedule partnership discussion");
      break;

    case "donation":
      steps.push("Process donation");
      steps.push("Send acknowledgment");
      break;

    default:
      if (aiClassification?.lead_type && aiClassification.lead_type !== "general") {
        steps.push(`AI detected ${aiClassification.lead_type} intent - consider reclassifying`);
      }
      steps.push("Review inquiry and respond within 24 hours");
  }

  return steps;
}

// ============================================================================
// PROGRAM ASSESSMENT SUBMISSION
// ============================================================================

export interface ProgramAssessmentResult {
  leadId: string;
  recommendedPrograms: Array<{
    program: ProgramType;
    fitScore: number;
    reasoning: string;
  }>;
  barriers: BarrierType[];
  supportNeeds: SupportNeedType[];
  readinessLevel: ReadinessLevel;
}

export async function submitProgramAssessment(
  input: ProgramAssessmentData,
  utmParams?: UTMParams
): Promise<ActionResult<ProgramAssessmentResult>> {
  try {
    // Route through the unified system
    const routeResult = await routeFormSubmission({
      formType: "program_assessment",
      formData: input as unknown as Record<string, unknown>,
      utmParams,
    });

    if (!routeResult.success || !routeResult.data) {
      return { success: false, error: routeResult.error || "Failed to submit assessment" };
    }

    // Calculate program fit scores
    const recommendations = calculateProgramFit(input);

    // Update lead with calculated recommendations
    const adminClient = createAdminClient();
    await adminClient
      .from("leads")
      .update({
        recommended_programs: recommendations.map((r) => r.program),
        fit_score: recommendations[0]?.fitScore || 0,
        barriers: input.barriers,
        support_needs: identifySupportNeeds(input),
        readiness_level: calculateReadinessLevel(input),
      })
      .eq("id", routeResult.data.leadId);

    return {
      success: true,
      data: {
        leadId: routeResult.data.leadId,
        recommendedPrograms: recommendations,
        barriers: input.barriers,
        supportNeeds: identifySupportNeeds(input),
        readinessLevel: calculateReadinessLevel(input),
      },
    };
  } catch (error) {
    console.error("Error in submitProgramAssessment:", error);
    return { success: false, error: "Failed to submit program assessment" };
  }
}

function calculateProgramFit(
  assessment: ProgramAssessmentData
): Array<{ program: ProgramType; fitScore: number; reasoning: string }> {
  const scores: Array<{ program: ProgramType; fitScore: number; reasoning: string; criteria: string[] }> = [];

  // Father Forward
  let ffScore = 0;
  const ffCriteria: string[] = [];
  if (assessment.isFather) { ffScore += 30; ffCriteria.push("Is a father"); }
  if (["unemployed_looking", "unemployed_not", "employed_part"].includes(assessment.currentEmploymentStatus)) {
    ffScore += 20; ffCriteria.push("Seeking employment or underemployed");
  }
  if (assessment.techInterests.some(t => ["it_support", "cybersecurity", "cloud"].includes(t))) {
    ffScore += 15; ffCriteria.push("Interested in IT career");
  }
  if (assessment.primaryGoal === "career_change" || assessment.primaryGoal === "certification") {
    ffScore += 15; ffCriteria.push("Goals align with IT certification");
  }
  if (ffCriteria.length > 0) {
    scores.push({
      program: "father_forward",
      fitScore: Math.min(ffScore, 100),
      reasoning: `Strong fit for IT-focused career development. ${ffCriteria.join(". ")}.`,
      criteria: ffCriteria,
    });
  }

  // Tech-Ready Youth
  let tryScore = 0;
  const tryCriteria: string[] = [];
  if (assessment.isMinor || assessment.currentEmploymentStatus === "student") {
    tryScore += 30; tryCriteria.push("Youth/student status");
  }
  if (assessment.primaryGoal === "certification" || assessment.primaryGoal === "career_change") {
    tryScore += 20; tryCriteria.push("Seeking certification");
  }
  if (assessment.techInterests.length > 0) {
    tryScore += 15; tryCriteria.push("Has tech interests");
  }
  if (tryCriteria.length > 0) {
    scores.push({
      program: "tech_ready_youth",
      fitScore: Math.min(tryScore, 100),
      reasoning: `Good fit for youth IT certification program. ${tryCriteria.join(". ")}.`,
      criteria: tryCriteria,
    });
  }

  // Making Moments
  let mmScore = 0;
  const mmCriteria: string[] = [];
  if (assessment.isFather) { mmScore += 30; mmCriteria.push("Is a father"); }
  if (assessment.primaryGoal === "help_family") { mmScore += 25; mmCriteria.push("Focused on family"); }
  if (assessment.numberOfChildren && assessment.numberOfChildren > 0) {
    mmScore += 15; mmCriteria.push("Has children to engage with");
  }
  if (mmCriteria.length > 0) {
    scores.push({
      program: "making_moments",
      fitScore: Math.min(mmScore, 100),
      reasoning: `Great fit for family-focused events and bonding. ${mmCriteria.join(". ")}.`,
      criteria: mmCriteria,
    });
  }

  // From Script to Screen
  let fssScore = 0;
  const fssCriteria: string[] = [];
  if (assessment.techInterests.includes("filmmaking") || assessment.primaryGoal === "creative_expression") {
    fssScore += 35; fssCriteria.push("Creative/filmmaking interest");
  }
  if (assessment.isMinor || assessment.currentEmploymentStatus === "student") {
    fssScore += 20; fssCriteria.push("Student status");
  }
  if (fssCriteria.length > 0) {
    scores.push({
      program: "from_script_to_screen",
      fitScore: Math.min(fssScore, 100),
      reasoning: `Excellent match for filmmaking and creative expression. ${fssCriteria.join(". ")}.`,
      criteria: fssCriteria,
    });
  }

  // Stories from My Future
  let sfmfScore = 0;
  const sfmfCriteria: string[] = [];
  if (assessment.isMinor) { sfmfScore += 35; sfmfCriteria.push("Youth participant"); }
  if (assessment.techInterests.includes("3d_printing") || assessment.primaryGoal === "creative_expression") {
    sfmfScore += 25; sfmfCriteria.push("Creative/maker interest");
  }
  if (sfmfCriteria.length > 0) {
    scores.push({
      program: "stories_from_my_future",
      fitScore: Math.min(sfmfScore, 100),
      reasoning: `Perfect for creative storytelling workshop. ${sfmfCriteria.join(". ")}.`,
      criteria: sfmfCriteria,
    });
  }

  // LULA
  let lulaScore = 0;
  const lulaCriteria: string[] = [];
  if (assessment.preferredSchedule === "flexible") { lulaScore += 25; lulaCriteria.push("Needs flexible learning"); }
  if (!assessment.hasReliableTransportation) { lulaScore += 20; lulaCriteria.push("Online access beneficial"); }
  if (assessment.isMinor) { lulaScore += 20; lulaCriteria.push("Youth participant"); }
  if (lulaCriteria.length > 0) {
    scores.push({
      program: "lula",
      fitScore: Math.min(lulaScore, 100),
      reasoning: `Good option for self-paced online learning. ${lulaCriteria.join(". ")}.`,
      criteria: lulaCriteria,
    });
  }

  // Sort by fit score and return top 3
  return scores
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3)
    .map(({ program, fitScore, reasoning }) => ({ program, fitScore, reasoning }));
}

function identifySupportNeeds(assessment: ProgramAssessmentData): SupportNeedType[] {
  const needs: SupportNeedType[] = [];

  // Based on barriers
  if (assessment.barriers.includes("transportation")) needs.push("transportation_assistance");
  if (assessment.barriers.includes("childcare") || assessment.hasChildcareNeeds) needs.push("childcare_assistance");
  if (assessment.barriers.includes("housing")) needs.push("housing_resources");
  if (assessment.barriers.includes("legal")) needs.push("legal_aid");
  if (assessment.barriers.includes("health")) needs.push("mental_health");
  if (assessment.barriers.includes("financial")) needs.push("financial_literacy");

  // Based on goals
  if (assessment.primaryGoal === "employment") {
    needs.push("job_training", "resume_help", "interview_prep");
  }
  if (assessment.primaryGoal === "certification") {
    needs.push("certification");
  }
  if (assessment.primaryGoal === "career_change") {
    needs.push("career_counseling", "mentorship");
  }

  return [...new Set(needs)];
}

function calculateReadinessLevel(assessment: ProgramAssessmentData): ReadinessLevel {
  let readinessScore = 50; // Base score

  // Positive factors
  if (assessment.hasComputer) readinessScore += 10;
  if (assessment.hasInternet) readinessScore += 10;
  if (assessment.hasReliableTransportation) readinessScore += 10;
  if (!assessment.hasChildcareNeeds) readinessScore += 5;
  if (assessment.barriers.length === 0) readinessScore += 15;

  // Negative factors
  readinessScore -= assessment.barriers.length * 5;
  if (assessment.preferredSchedule === "flexible") readinessScore -= 5; // May indicate scheduling challenges

  // Determine level
  if (readinessScore >= 75) return "high";
  if (readinessScore >= 50) return "medium";
  return "low";
}
