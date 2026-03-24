"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Donation, DonationInsert, DonationFrequency } from "@/types/database";

// =============================================================================
// TYPES
// =============================================================================

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

interface DonationStats {
  totalThisMonth: number;
  totalThisYear: number;
  recurringDonors: number;
  pendingAcknowledgments: number;
}

interface DonorSummary {
  id: string;
  name: string;
  email: string;
  totalGiven: number;
  donationCount: number;
  lastDonation: string;
  type: "one_time" | "recurring";
  recurringAmount: number | null;
  acknowledged: boolean;
}

// =============================================================================
// CREATE DONATION
// =============================================================================

export async function createDonation(data: {
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;
  donorPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  amount: number;
  frequency: DonationFrequency;
  designation?: string;
  stripePaymentIntentId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  paymentStatus?: string;
  campaign?: string;
  source?: string;
  isAnonymous?: boolean;
  notes?: string;
}): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    const donationData: DonationInsert = {
      donor_first_name: data.donorFirstName,
      donor_last_name: data.donorLastName,
      donor_email: data.donorEmail,
      donor_phone: data.donorPhone || null,
      address_line1: data.addressLine1 || null,
      address_line2: data.addressLine2 || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zipCode || null,
      amount: data.amount,
      frequency: data.frequency,
      designation: data.designation || null,
      stripe_payment_intent_id: data.stripePaymentIntentId || null,
      stripe_subscription_id: data.stripeSubscriptionId || null,
      stripe_customer_id: data.stripeCustomerId || null,
      payment_status: data.paymentStatus || "pending",
      acknowledgment_sent: false,
      acknowledgment_sent_at: null,
      campaign: data.campaign || null,
      source: data.source || "website",
      is_anonymous: data.isAnonymous || false,
      notes: data.notes || null,
    };

    const { data: donation, error } = await adminClient
      .from("donations")
      .insert(donationData)
      .select()
      .single();

    if (error) {
      console.error("Error creating donation:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/donations");
    return { success: true, data: donation };
  } catch (error) {
    console.error("Error in createDonation:", error);
    return { success: false, error: "Failed to create donation" };
  }
}

// =============================================================================
// UPDATE DONATION
// =============================================================================

export async function updateDonation(
  id: string,
  data: Partial<{
    paymentStatus: string;
    stripePaymentIntentId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    acknowledgmentSent: boolean;
    acknowledgmentSentAt: string;
    notes: string;
  }>
): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (data.paymentStatus !== undefined) updateData.payment_status = data.paymentStatus;
    if (data.stripePaymentIntentId !== undefined) updateData.stripe_payment_intent_id = data.stripePaymentIntentId;
    if (data.stripeSubscriptionId !== undefined) updateData.stripe_subscription_id = data.stripeSubscriptionId;
    if (data.stripeCustomerId !== undefined) updateData.stripe_customer_id = data.stripeCustomerId;
    if (data.acknowledgmentSent !== undefined) updateData.acknowledgment_sent = data.acknowledgmentSent;
    if (data.acknowledgmentSentAt !== undefined) updateData.acknowledgment_sent_at = data.acknowledgmentSentAt;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: donation, error } = await adminClient
      .from("donations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating donation:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/donations");
    return { success: true, data: donation };
  } catch (error) {
    console.error("Error in updateDonation:", error);
    return { success: false, error: "Failed to update donation" };
  }
}

// =============================================================================
// GET DONATIONS
// =============================================================================

export async function getDonations(options?: {
  limit?: number;
  offset?: number;
  frequency?: DonationFrequency;
  paymentStatus?: string;
  search?: string;
}): Promise<ActionResult<{ donations: Donation[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("donations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.frequency) {
      query = query.eq("frequency", options.frequency);
    }

    if (options?.paymentStatus) {
      query = query.eq("payment_status", options.paymentStatus);
    }

    if (options?.search) {
      query = query.or(
        `donor_first_name.ilike.%${options.search}%,donor_last_name.ilike.%${options.search}%,donor_email.ilike.%${options.search}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching donations:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { donations: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getDonations:", error);
    return { success: false, error: "Failed to fetch donations" };
  }
}

// =============================================================================
// GET DONATION BY ID
// =============================================================================

export async function getDonationById(id: string): Promise<ActionResult<Donation>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching donation:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getDonationById:", error);
    return { success: false, error: "Failed to fetch donation" };
  }
}

// =============================================================================
// GET DONATION BY STRIPE IDS
// =============================================================================

export async function getDonationByStripePaymentIntent(
  paymentIntentId: string
): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("donations")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (error) {
      console.error("Error fetching donation by payment intent:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getDonationByStripePaymentIntent:", error);
    return { success: false, error: "Failed to fetch donation" };
  }
}

export async function getDonationByStripeSubscription(
  subscriptionId: string
): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("donations")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .single();

    if (error) {
      console.error("Error fetching donation by subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getDonationByStripeSubscription:", error);
    return { success: false, error: "Failed to fetch donation" };
  }
}

// =============================================================================
// GET DONATION STATS
// =============================================================================

export async function getDonationStats(): Promise<ActionResult<DonationStats>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get start of current month and year
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

    // Total this month
    const { data: monthlyData } = await supabase
      .from("donations")
      .select("amount")
      .gte("created_at", startOfMonth)
      .eq("payment_status", "succeeded");

    const totalThisMonth = monthlyData?.reduce((sum, d) => sum + d.amount, 0) || 0;

    // Total this year
    const { data: yearlyData } = await supabase
      .from("donations")
      .select("amount")
      .gte("created_at", startOfYear)
      .eq("payment_status", "succeeded");

    const totalThisYear = yearlyData?.reduce((sum, d) => sum + d.amount, 0) || 0;

    // Recurring donors (unique by email with active recurring)
    const { data: recurringData } = await supabase
      .from("donations")
      .select("donor_email")
      .eq("frequency", "monthly")
      .eq("payment_status", "succeeded");

    const uniqueRecurring = new Set(recurringData?.map((d) => d.donor_email) || []);
    const recurringDonors = uniqueRecurring.size;

    // Pending acknowledgments
    const { count: pendingCount } = await supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("acknowledgment_sent", false)
      .eq("payment_status", "succeeded");

    return {
      success: true,
      data: {
        totalThisMonth,
        totalThisYear,
        recurringDonors,
        pendingAcknowledgments: pendingCount || 0,
      },
    };
  } catch (error) {
    console.error("Error in getDonationStats:", error);
    return { success: false, error: "Failed to fetch donation stats" };
  }
}

// =============================================================================
// GET DONOR SUMMARY (Aggregated by email)
// =============================================================================

export async function getDonorSummaries(options?: {
  limit?: number;
  offset?: number;
  type?: "one_time" | "recurring" | "all";
  search?: string;
}): Promise<ActionResult<{ donors: DonorSummary[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all successful donations
    let query = supabase
      .from("donations")
      .select("*")
      .eq("payment_status", "succeeded")
      .order("created_at", { ascending: false });

    if (options?.search) {
      query = query.or(
        `donor_first_name.ilike.%${options.search}%,donor_last_name.ilike.%${options.search}%,donor_email.ilike.%${options.search}%`
      );
    }

    const { data: donations, error } = await query;

    if (error) {
      console.error("Error fetching donations for summary:", error);
      return { success: false, error: error.message };
    }

    // Aggregate by email
    const donorMap = new Map<string, DonorSummary>();

    for (const donation of donations || []) {
      const existing = donorMap.get(donation.donor_email);

      if (existing) {
        existing.totalGiven += donation.amount;
        existing.donationCount += 1;
        if (donation.created_at > existing.lastDonation) {
          existing.lastDonation = donation.created_at;
        }
        if (donation.frequency === "monthly") {
          existing.type = "recurring";
          existing.recurringAmount = donation.amount;
        }
        if (!donation.acknowledgment_sent) {
          existing.acknowledged = false;
        }
      } else {
        donorMap.set(donation.donor_email, {
          id: donation.id,
          name: `${donation.donor_first_name} ${donation.donor_last_name}`,
          email: donation.donor_email,
          totalGiven: donation.amount,
          donationCount: 1,
          lastDonation: donation.created_at,
          type: donation.frequency === "monthly" ? "recurring" : "one_time",
          recurringAmount: donation.frequency === "monthly" ? donation.amount : null,
          acknowledged: donation.acknowledgment_sent || false,
        });
      }
    }

    let donors = Array.from(donorMap.values());

    // Filter by type
    if (options?.type && options.type !== "all") {
      donors = donors.filter((d) => d.type === options.type);
    }

    // Sort by total given (descending)
    donors.sort((a, b) => b.totalGiven - a.totalGiven);

    const total = donors.length;

    // Paginate
    if (options?.offset !== undefined && options?.limit !== undefined) {
      donors = donors.slice(options.offset, options.offset + options.limit);
    } else if (options?.limit) {
      donors = donors.slice(0, options.limit);
    }

    return { success: true, data: { donors, total } };
  } catch (error) {
    console.error("Error in getDonorSummaries:", error);
    return { success: false, error: "Failed to fetch donor summaries" };
  }
}

// =============================================================================
// GET RECENT DONATIONS
// =============================================================================

export async function getRecentDonations(
  limit = 10
): Promise<ActionResult<Donation[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("payment_status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent donations:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getRecentDonations:", error);
    return { success: false, error: "Failed to fetch recent donations" };
  }
}

// =============================================================================
// MARK DONATION ACKNOWLEDGED
// =============================================================================

export async function markDonationAcknowledged(
  id: string
): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("donations")
      .update({
        acknowledgment_sent: true,
        acknowledgment_sent_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking donation acknowledged:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/donations");
    return { success: true, data };
  } catch (error) {
    console.error("Error in markDonationAcknowledged:", error);
    return { success: false, error: "Failed to mark donation acknowledged" };
  }
}
