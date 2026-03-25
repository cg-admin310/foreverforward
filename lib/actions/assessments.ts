"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  MspClientInsert,
  LeadInsert,
  SupportType,
  DecisionTimeline,
  BudgetRange,
  ITAssessmentData,
} from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AssessmentFormInput {
  // Step 1: Contact & Organization
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  userCount: number;

  // Step 2: Current IT
  hasItSupport: boolean;
  currentItProvider?: string;
  currentItSpendMonthly?: number;
  supportType?: SupportType;
  hasItStaff: boolean;
  itStaffCount?: number;
  deviceCount?: number;
  serverCount?: number;
  cloudServices: string[];

  // Step 3: Challenges
  painPoints: string[];
  topPriorities: string[];
  biggestChallenge?: string;
  idealOutcome?: string;

  // Step 4: Next Steps
  servicesInterested: string[];
  decisionTimeline: DecisionTimeline;
  budgetRange: BudgetRange;
  additionalNotes?: string;
}

// ============================================================================
// VALUE ESTIMATION
// ============================================================================

/**
 * Calculate estimated monthly value based on assessment data
 * Uses Forever Forward pricing tiers:
 * - Foundation (<15 users): $100-200/month base
 * - Growth (15-75 users): $50-65/user/month
 * - Enterprise (75+): $75-85/user/month
 */
function calculateEstimatedValue(input: AssessmentFormInput): number {
  const userCount = input.userCount || 1;
  let baseValue = 0;

  // Calculate based on user count and package tier
  if (userCount < 15) {
    // Foundation tier
    baseValue = 150; // Average of $100-$200
  } else if (userCount <= 75) {
    // Growth tier
    baseValue = userCount * 57.5; // Average of $50-$65
  } else {
    // Enterprise tier
    baseValue = userCount * 80; // Average of $75-$85
  }

  // Add premiums for additional services
  const serviceMultiplier: Record<string, number> = {
    security: 1.15, // +15% for security focus
    cloud: 1.10, // +10% for cloud services
    cabling: 0, // One-time, not included in monthly
    cctv: 0, // One-time, not included in monthly
    software: 1.20, // +20% for software/AI development
    network: 1.05, // +5% for network services
    hardware: 0, // One-time, not included in monthly
    managed_it: 1.0, // Base service
  };

  // Apply multipliers for recurring services
  let totalMultiplier = 1;
  for (const service of input.servicesInterested) {
    const multiplier = serviceMultiplier[service];
    if (multiplier && multiplier > 1) {
      totalMultiplier *= multiplier;
    }
  }

  // Round to nearest $50
  return Math.round((baseValue * totalMultiplier) / 50) * 50;
}

/**
 * Determine recommended service package based on assessment
 */
function determineServicePackage(input: AssessmentFormInput): string {
  const userCount = input.userCount || 1;

  if (userCount < 15) {
    return "foundation";
  } else if (userCount <= 75) {
    return "growth";
  } else {
    return "enterprise";
  }
}

/**
 * Calculate urgency score (1-10) based on timeline and challenges
 */
function calculateUrgencyScore(input: AssessmentFormInput): number {
  let score = 5; // Base score

  // Timeline impacts urgency significantly
  switch (input.decisionTimeline) {
    case "immediately":
      score += 4;
      break;
    case "1-2_weeks":
      score += 3;
      break;
    case "1_month":
      score += 1;
      break;
    case "3_months_plus":
      score -= 1;
      break;
    case "just_exploring":
      score -= 2;
      break;
  }

  // Pain points increase urgency
  const criticalPainPoints = ["security_concerns", "no_it_support", "compliance"];
  const criticalCount = input.painPoints.filter((p) => criticalPainPoints.includes(p)).length;
  score += criticalCount;

  // No current IT support increases urgency
  if (!input.hasItSupport) {
    score += 1;
  }

  // Clamp to 1-10
  return Math.max(1, Math.min(10, score));
}

// ============================================================================
// SUBMIT ASSESSMENT
// ============================================================================

export async function submitITAssessment(
  input: AssessmentFormInput
): Promise<ActionResult<{ clientId: string; leadId: string }>> {
  try {
    const adminClient = createAdminClient();

    // Build assessment data object
    const assessmentData: ITAssessmentData = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      organizationName: input.organizationName,
      organizationType: input.organizationType,
      website: input.website,
      userCount: input.userCount,
      hasItSupport: input.hasItSupport,
      currentItProvider: input.currentItProvider,
      currentItSpendMonthly: input.currentItSpendMonthly,
      supportType: input.supportType,
      hasItStaff: input.hasItStaff,
      itStaffCount: input.itStaffCount,
      deviceCount: input.deviceCount,
      serverCount: input.serverCount,
      cloudServices: input.cloudServices,
      painPoints: input.painPoints,
      topPriorities: input.topPriorities,
      biggestChallenge: input.biggestChallenge,
      idealOutcome: input.idealOutcome,
      servicesInterested: input.servicesInterested,
      decisionTimeline: input.decisionTimeline,
      budgetRange: input.budgetRange,
      additionalNotes: input.additionalNotes,
      submittedAt: new Date().toISOString(),
      formVersion: "1.0",
    };

    // Calculate values
    const estimatedValue = calculateEstimatedValue(input);
    const urgencyScore = calculateUrgencyScore(input);
    const servicePackage = determineServicePackage(input);

    // 1. Create lead
    const leadData: LeadInsert = {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone || null,
      organization: input.organizationName,
      title: null,
      lead_type: "msp",
      status: "qualified", // Auto-qualified since they completed assessment
      priority_score: urgencyScore,
      program_interest: null,
      service_interests: input.servicesInterested,
      estimated_value: estimatedValue,
      source: "it_assessment_form",
      referral_source: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      ai_classification: {
        assessment_completed: true,
        urgency_score: urgencyScore,
        recommended_package: servicePackage,
        pain_points: input.painPoints,
        top_priorities: input.topPriorities,
      },
      assigned_to: null,
      notes: `Assessment completed. Biggest challenge: ${input.biggestChallenge || "Not specified"}. Ideal outcome: ${input.idealOutcome || "Not specified"}.`,
      tags: ["assessment_completed", servicePackage],
      contacted_at: null,
      converted_at: new Date().toISOString(),
    };

    const { data: lead, error: leadError } = await adminClient
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (leadError) {
      console.error("Error creating lead:", leadError);
      return { success: false, error: leadError.message };
    }

    // 2. Create MSP client with all assessment data
    const clientData: MspClientInsert = {
      lead_id: lead.id,
      organization_name: input.organizationName,
      organization_type: input.organizationType,
      website: input.website || null,
      primary_contact_name: `${input.firstName} ${input.lastName}`,
      primary_contact_email: input.email,
      primary_contact_phone: input.phone || null,
      primary_contact_title: null,
      address_line1: null,
      address_line2: null,
      city: null,
      state: "CA",
      zip_code: null,
      pipeline_stage: "assessment", // Start at assessment stage
      days_in_stage: 0,
      stage_entered_at: new Date().toISOString(),
      service_package: servicePackage,
      services: input.servicesInterested,
      user_count: input.userCount,
      monthly_value: estimatedValue,
      contract_start_date: null,
      contract_end_date: null,
      stripe_customer_id: null,
      payment_status: null,
      account_manager: null,
      assigned_technicians: null,
      notes: input.additionalNotes || null,
      tags: ["assessment_completed", `urgency_${urgencyScore >= 7 ? "high" : urgencyScore >= 4 ? "medium" : "low"}`],

      // Assessment tracking
      assessment_completed_at: new Date().toISOString(),
      assessment_data: assessmentData,

      // Current IT situation
      current_it_spend_monthly: input.currentItSpendMonthly || null,
      current_it_provider: input.currentItProvider || null,
      support_type: input.supportType || null,
      has_it_staff: input.hasItStaff,
      it_staff_count: input.itStaffCount || null,

      // Technology inventory
      device_count: input.deviceCount || null,
      server_count: input.serverCount || null,
      cloud_services: input.cloudServices.length > 0 ? input.cloudServices : null,
      current_tools: null,

      // Challenges & priorities
      pain_points: input.painPoints.length > 0 ? input.painPoints : null,
      top_priorities: input.topPriorities.length > 0 ? input.topPriorities : null,
      biggest_challenge: input.biggestChallenge || null,
      ideal_outcome: input.idealOutcome || null,

      // Decision context
      decision_timeline: input.decisionTimeline,
      budget_range: input.budgetRange,
      services_interested: input.servicesInterested.length > 0 ? input.servicesInterested : null,
    };

    const { data: client, error: clientError } = await adminClient
      .from("msp_clients")
      .insert(clientData)
      .select()
      .single();

    if (clientError) {
      console.error("Error creating client:", clientError);
      // Still return success with lead if client creation fails
      return { success: true, data: { clientId: "", leadId: lead.id } };
    }

    // 3. Log activity
    await adminClient.from("activities").insert({
      activity_type: "assessment_completed",
      description: `IT assessment completed by ${input.firstName} ${input.lastName} from ${input.organizationName}. Urgency: ${urgencyScore}/10, Estimated value: $${estimatedValue}/month.`,
      lead_id: lead.id,
      client_id: client.id,
      metadata: {
        urgency_score: urgencyScore,
        estimated_value: estimatedValue,
        service_package: servicePackage,
        services_interested: input.servicesInterested,
        pain_points: input.painPoints,
        top_priorities: input.topPriorities,
        decision_timeline: input.decisionTimeline,
        budget_range: input.budgetRange,
      },
      performed_by: null,
    });

    // 4. Update lead with client_id reference
    await adminClient
      .from("leads")
      .update({
        status: "converted",
        converted_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // Revalidate relevant paths
    revalidatePath("/clients");
    revalidatePath("/leads");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { clientId: client.id, leadId: lead.id },
    };
  } catch (error) {
    console.error("Error in submitITAssessment:", error);
    return { success: false, error: "Failed to submit assessment" };
  }
}

// ============================================================================
// GET ASSESSMENT DATA
// ============================================================================

export async function getAssessmentData(
  clientId: string
): Promise<ActionResult<ITAssessmentData | null>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("msp_clients")
      .select("assessment_data")
      .eq("id", clientId)
      .single();

    if (error) {
      console.error("Error fetching assessment data:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data?.assessment_data as ITAssessmentData | null,
    };
  } catch (error) {
    console.error("Error in getAssessmentData:", error);
    return { success: false, error: "Failed to fetch assessment data" };
  }
}

// NOTE: generateAssessmentSummary utility function moved to lib/utils/assessment-summary.ts
// Import from there if needed for AI consumption or display purposes
