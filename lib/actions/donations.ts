"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Donation,
  DonationInsert,
  DonationFrequency,
  DonorProfile,
  ImpactMetric,
  DonationAllocation,
  DonorTier,
} from "@/types/database";
import { sendEmail, donationThankYouEmail, donationReceiptEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe";

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
  totalDonors: number;
  averageDonation: number;
}

interface DonorTierStats {
  founding: number;
  champion: number;
  supporter: number;
  friend: number;
  total: number;
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
  tier?: DonorTier;
}

interface PendingDonorAction {
  type: "thank_you" | "impact_update" | "milestone" | "tier_upgrade";
  donorId?: string;
  donationId?: string;
  email: string;
  name: string;
  description: string;
  dueDate?: string;
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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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

    // Total unique donors
    const { data: allDonors } = await supabase
      .from("donations")
      .select("donor_email")
      .eq("payment_status", "succeeded");

    const uniqueDonors = new Set(allDonors?.map((d) => d.donor_email) || []);
    const totalDonors = uniqueDonors.size;

    // All-time donations for average
    const { data: allDonations } = await supabase
      .from("donations")
      .select("amount")
      .eq("payment_status", "succeeded");

    const totalAmount = allDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const averageDonation = allDonations?.length ? totalAmount / allDonations.length : 0;

    return {
      success: true,
      data: {
        totalThisMonth,
        totalThisYear,
        recurringDonors,
        pendingAcknowledgments: pendingCount || 0,
        totalDonors,
        averageDonation: Math.round(averageDonation),
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
    const supabase = createAdminClient();

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
    const supabase = createAdminClient();

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
// MARK DONATION ACKNOWLEDGED (Sends Thank You Email)
// =============================================================================

export async function markDonationAcknowledged(
  id: string
): Promise<ActionResult<Donation>> {
  try {
    const adminClient = createAdminClient();

    // First, get the donation details for the email
    const { data: donation, error: fetchError } = await adminClient
      .from("donations")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !donation) {
      console.error("Error fetching donation:", fetchError);
      return { success: false, error: "Donation not found" };
    }

    // Don't send if already acknowledged
    if (donation.acknowledgment_sent) {
      return { success: true, data: donation };
    }

    // Prepare and send the thank you email
    const donorName = `${donation.donor_first_name} ${donation.donor_last_name}`;
    const emailContent = donationThankYouEmail({
      donorName,
      amount: donation.amount,
      donationDate: donation.created_at,
      isRecurring: donation.frequency === "monthly",
      designation: donation.designation || undefined,
    });

    const emailResult = await sendEmail({
      to: donation.donor_email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error("Failed to send thank you email:", emailResult.error);
      // Continue anyway - we'll mark as acknowledged but note the email failure
    }

    // Update the donation record
    const { data: updatedDonation, error: updateError } = await adminClient
      .from("donations")
      .update({
        acknowledgment_sent: true,
        acknowledgment_sent_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating donation:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/donations");
    return { success: true, data: updatedDonation };
  } catch (error) {
    console.error("Error in markDonationAcknowledged:", error);
    return { success: false, error: "Failed to send acknowledgment" };
  }
}

// =============================================================================
// SEND DONATION RECEIPT (Tax Receipt Email)
// =============================================================================

export async function sendDonationReceipt(
  id: string
): Promise<ActionResult<{ sent: boolean }>> {
  try {
    const adminClient = createAdminClient();

    // Get the donation details
    const { data: donation, error: fetchError } = await adminClient
      .from("donations")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !donation) {
      console.error("Error fetching donation:", fetchError);
      return { success: false, error: "Donation not found" };
    }

    // Build address string if available
    let donorAddress: string | undefined;
    if (donation.address_line1) {
      donorAddress = donation.address_line1;
      if (donation.address_line2) donorAddress += `, ${donation.address_line2}`;
      if (donation.city) donorAddress += `, ${donation.city}`;
      if (donation.state) donorAddress += `, ${donation.state}`;
      if (donation.zip_code) donorAddress += ` ${donation.zip_code}`;
    }

    // Prepare and send the receipt email
    const donorName = `${donation.donor_first_name} ${donation.donor_last_name}`;
    const emailContent = donationReceiptEmail({
      donorName,
      donorAddress,
      amount: donation.amount,
      donationDate: donation.created_at,
      donationId: donation.id,
      isRecurring: donation.frequency === "monthly",
    });

    const emailResult = await sendEmail({
      to: donation.donor_email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error("Failed to send receipt email:", emailResult.error);
      return { success: false, error: "Failed to send receipt email" };
    }

    return { success: true, data: { sent: true } };
  } catch (error) {
    console.error("Error in sendDonationReceipt:", error);
    return { success: false, error: "Failed to send receipt" };
  }
}

// =============================================================================
// EXPORT DONATIONS TO CSV
// =============================================================================

export async function exportDonationsToCSV(options?: {
  startDate?: string;
  endDate?: string;
  frequency?: DonationFrequency;
}): Promise<ActionResult<string>> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("donations")
      .select("*")
      .eq("payment_status", "succeeded")
      .order("created_at", { ascending: false });

    if (options?.startDate) {
      query = query.gte("created_at", options.startDate);
    }

    if (options?.endDate) {
      query = query.lte("created_at", options.endDate);
    }

    if (options?.frequency) {
      query = query.eq("frequency", options.frequency);
    }

    const { data: donations, error } = await query;

    if (error) {
      console.error("Error fetching donations for export:", error);
      return { success: false, error: error.message };
    }

    if (!donations || donations.length === 0) {
      return { success: false, error: "No donations found for export" };
    }

    // Build CSV
    const headers = [
      "Date",
      "First Name",
      "Last Name",
      "Email",
      "Amount",
      "Frequency",
      "Designation",
      "Campaign",
      "Acknowledgment Sent",
      "Donation ID",
    ];

    const rows = donations.map((d) => [
      new Date(d.created_at).toLocaleDateString(),
      d.donor_first_name,
      d.donor_last_name,
      d.donor_email,
      d.amount.toString(),
      d.frequency,
      d.designation || "",
      d.campaign || "",
      d.acknowledgment_sent ? "Yes" : "No",
      d.id,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Error in exportDonationsToCSV:", error);
    return { success: false, error: "Failed to export donations" };
  }
}

// =============================================================================
// SYNC DONATIONS FROM STRIPE
// Syncs donations made directly in Stripe Dashboard that aren't in the database
// =============================================================================

export async function syncStripeDonations(startDate?: Date): Promise<ActionResult<{
  synced: number;
  skipped: number;
  errors: number;
}>> {
  try {
    const adminClient = createAdminClient();

    // Default to last 30 days if no start date
    const sinceTimestamp = startDate
      ? Math.floor(startDate.getTime() / 1000)
      : Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

    // Get all charges from Stripe (donations come through as charges)
    const charges = await stripe.charges.list({
      created: { gte: sinceTimestamp },
      limit: 100,
    });

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const charge of charges.data) {
      // Skip failed or refunded charges
      if (charge.status !== "succeeded" || charge.refunded) {
        skipped++;
        continue;
      }

      // Check if this charge is already in our database
      const { data: existing } = await adminClient
        .from("donations")
        .select("id")
        .or(
          `stripe_payment_intent_id.eq.${charge.payment_intent || ""},stripe_charge_id.eq.${charge.id}`
        )
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      // Get customer info if available
      let donorEmail = charge.receipt_email || charge.billing_details?.email || "";
      let donorName = charge.billing_details?.name || "";

      // Try to get more info from the customer object
      if (charge.customer && typeof charge.customer === "string") {
        try {
          const customer = await stripe.customers.retrieve(charge.customer);
          if (customer && !("deleted" in customer)) {
            donorEmail = donorEmail || customer.email || "";
            donorName = donorName || customer.name || "";
          }
        } catch (e) {
          console.error("Error fetching Stripe customer:", e);
        }
      }

      // Parse name into first/last
      const nameParts = donorName.split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || "Donor";

      // Determine if this looks like a donation based on metadata or description
      const metadata = charge.metadata || {};
      const isDonation =
        metadata.type === "donation" ||
        charge.description?.toLowerCase().includes("donation") ||
        charge.description?.toLowerCase().includes("forever forward");

      // If it doesn't look like a donation, skip it
      if (!isDonation && !metadata.donation_id) {
        skipped++;
        continue;
      }

      // Create the donation record
      try {
        await adminClient.from("donations").insert({
          donor_first_name: firstName,
          donor_last_name: lastName,
          donor_email: donorEmail,
          donor_phone: charge.billing_details?.phone || null,
          address_line1: charge.billing_details?.address?.line1 || null,
          address_line2: charge.billing_details?.address?.line2 || null,
          city: charge.billing_details?.address?.city || null,
          state: charge.billing_details?.address?.state || null,
          zip_code: charge.billing_details?.address?.postal_code || null,
          amount: charge.amount / 100,
          frequency: metadata.frequency === "monthly" ? "monthly" : "one_time",
          designation: metadata.designation || null,
          stripe_payment_intent_id:
            typeof charge.payment_intent === "string"
              ? charge.payment_intent
              : null,
          stripe_customer_id:
            typeof charge.customer === "string" ? charge.customer : null,
          payment_status: "succeeded",
          acknowledgment_sent: false,
          campaign: metadata.campaign || null,
          source: "stripe_sync",
          is_anonymous: false,
          notes: `Synced from Stripe charge ${charge.id}`,
        });

        synced++;
      } catch (insertError) {
        console.error("Error inserting synced donation:", insertError);
        errors++;
      }
    }

    // Also check for subscription invoices (recurring donations)
    const invoices = await stripe.invoices.list({
      created: { gte: sinceTimestamp },
      status: "paid",
      limit: 100,
    });

    for (const invoice of invoices.data) {
      // Check metadata for donation type
      const metadata = invoice.metadata || {};
      if (metadata.type !== "donation") {
        skipped++;
        continue;
      }

      // Check if already synced
      // Cast to access properties which may not be in Stripe v20 types
      const invoiceAny = invoice as unknown as {
        payment_intent?: string | { id?: string } | null;
        subscription?: string | null;
      };
      const paymentIntentId =
        typeof invoiceAny.payment_intent === "string"
          ? invoiceAny.payment_intent
          : (invoiceAny.payment_intent as { id?: string })?.id;

      const { data: existing } = await adminClient
        .from("donations")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntentId || "")
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      // Get customer info
      let customer = null;
      if (invoice.customer && typeof invoice.customer === "string") {
        try {
          customer = await stripe.customers.retrieve(invoice.customer);
        } catch (e) {
          console.error("Error fetching customer for invoice:", e);
        }
      }

      const donorName = (customer && !("deleted" in customer) ? customer.name : null) || "Unknown Donor";
      const donorEmail = (customer && !("deleted" in customer) ? customer.email : null) || "";
      const nameParts = donorName.split(" ");

      try {
        await adminClient.from("donations").insert({
          donor_first_name: nameParts[0] || "Unknown",
          donor_last_name: nameParts.slice(1).join(" ") || "Donor",
          donor_email: donorEmail,
          amount: (invoice.amount_paid || 0) / 100,
          frequency: invoiceAny.subscription ? "monthly" : "one_time",
          designation: metadata.designation || null,
          stripe_payment_intent_id: paymentIntentId || null,
          stripe_subscription_id: invoiceAny.subscription || null,
          stripe_customer_id:
            typeof invoice.customer === "string" ? invoice.customer : null,
          payment_status: "succeeded",
          acknowledgment_sent: false,
          campaign: metadata.campaign || null,
          source: "stripe_sync",
          is_anonymous: false,
          notes: `Synced from Stripe invoice ${invoice.id}`,
        });

        synced++;
      } catch (insertError) {
        console.error("Error inserting synced donation from invoice:", insertError);
        errors++;
      }
    }

    revalidatePath("/donations");
    return { success: true, data: { synced, skipped, errors } };
  } catch (error) {
    console.error("Error in syncStripeDonations:", error);
    return { success: false, error: "Failed to sync Stripe donations" };
  }
}

// =============================================================================
// DONOR PROFILES
// =============================================================================

export async function getDonorProfiles(options?: {
  limit?: number;
  offset?: number;
  tier?: DonorTier;
  isRecurring?: boolean;
  search?: string;
}): Promise<ActionResult<{ donors: DonorProfile[]; total: number }>> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("donor_profiles")
      .select("*", { count: "exact" })
      .order("total_given", { ascending: false });

    if (options?.tier) {
      query = query.eq("tier", options.tier);
    }

    if (options?.isRecurring !== undefined) {
      query = query.eq("is_recurring", options.isRecurring);
    }

    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,company_name.ilike.%${options.search}%`
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
      console.error("Error fetching donor profiles:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { donors: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getDonorProfiles:", error);
    return { success: false, error: "Failed to fetch donor profiles" };
  }
}

export async function getDonorProfileByEmail(email: string): Promise<ActionResult<DonorProfile>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("donor_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching donor profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getDonorProfileByEmail:", error);
    return { success: false, error: "Failed to fetch donor profile" };
  }
}

// =============================================================================
// DONOR TIER STATISTICS
// =============================================================================

export async function getDonorTierStats(): Promise<ActionResult<DonorTierStats>> {
  try {
    const supabase = createAdminClient();

    // Get counts by tier
    const { data: tiers, error } = await supabase
      .from("donor_profiles")
      .select("tier");

    if (error) {
      console.error("Error fetching tier stats:", error);
      return { success: false, error: error.message };
    }

    const stats: DonorTierStats = {
      founding: 0,
      champion: 0,
      supporter: 0,
      friend: 0,
      total: 0,
    };

    for (const row of tiers || []) {
      const tier = row.tier as DonorTier;
      if (tier in stats) {
        stats[tier]++;
      }
      stats.total++;
    }

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getDonorTierStats:", error);
    return { success: false, error: "Failed to fetch tier stats" };
  }
}

// =============================================================================
// IMPACT METRICS
// =============================================================================

export async function getImpactMetrics(options?: {
  type?: string;
  periodType?: string;
}): Promise<ActionResult<ImpactMetric[]>> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("impact_metrics")
      .select("*")
      .order("metric_type")
      .order("metric_name");

    if (options?.type) {
      query = query.eq("metric_type", options.type);
    }

    if (options?.periodType) {
      query = query.eq("period_type", options.periodType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching impact metrics:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getImpactMetrics:", error);
    return { success: false, error: "Failed to fetch impact metrics" };
  }
}

export async function updateImpactMetric(
  id: string,
  data: { metric_value: number; notes?: string }
): Promise<ActionResult<ImpactMetric>> {
  try {
    const supabase = createAdminClient();

    const { data: metric, error } = await supabase
      .from("impact_metrics")
      .update({
        metric_value: data.metric_value,
        notes: data.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating impact metric:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/donations");
    return { success: true, data: metric };
  } catch (error) {
    console.error("Error in updateImpactMetric:", error);
    return { success: false, error: "Failed to update impact metric" };
  }
}

// =============================================================================
// DONATION ALLOCATIONS
// =============================================================================

export async function getDonationAllocations(options?: {
  published?: boolean;
}): Promise<ActionResult<DonationAllocation[]>> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("donation_allocations")
      .select("*")
      .order("period_end", { ascending: false });

    if (options?.published !== undefined) {
      query = query.eq("is_published", options.published);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching allocations:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getDonationAllocations:", error);
    return { success: false, error: "Failed to fetch allocations" };
  }
}

export async function getCurrentAllocation(): Promise<ActionResult<DonationAllocation | null>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("donation_allocations")
      .select("*")
      .eq("is_published", true)
      .order("period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching current allocation:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getCurrentAllocation:", error);
    return { success: false, error: "Failed to fetch current allocation" };
  }
}

// =============================================================================
// PENDING DONOR ACTIONS
// =============================================================================

export async function getPendingDonorActions(): Promise<ActionResult<PendingDonorAction[]>> {
  try {
    const supabase = createAdminClient();
    const actions: PendingDonorAction[] = [];

    // 1. Pending thank you emails (donations without acknowledgment)
    const { data: pendingThanks } = await supabase
      .from("donations")
      .select("id, donor_first_name, donor_last_name, donor_email, amount, created_at")
      .eq("payment_status", "succeeded")
      .eq("acknowledgment_sent", false)
      .order("created_at", { ascending: true })
      .limit(10);

    for (const donation of pendingThanks || []) {
      actions.push({
        type: "thank_you",
        donationId: donation.id,
        email: donation.donor_email,
        name: `${donation.donor_first_name} ${donation.donor_last_name}`,
        description: `Send thank you for $${donation.amount} donation`,
      });
    }

    // 2. Impact updates due (30-day update for recent donations)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fortyDaysAgo = new Date();
    fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

    const { data: needsImpactUpdate } = await supabase
      .from("donations")
      .select("id, donor_first_name, donor_last_name, donor_email, amount, created_at")
      .eq("payment_status", "succeeded")
      .eq("acknowledgment_sent", true)
      .eq("impact_report_sent", false)
      .gte("created_at", fortyDaysAgo.toISOString())
      .lte("created_at", thirtyDaysAgo.toISOString())
      .limit(10);

    for (const donation of needsImpactUpdate || []) {
      actions.push({
        type: "impact_update",
        donationId: donation.id,
        email: donation.donor_email,
        name: `${donation.donor_first_name} ${donation.donor_last_name}`,
        description: `Send 30-day impact update for $${donation.amount} donation`,
        dueDate: new Date(new Date(donation.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // 3. Recurring donor milestones (6 months, 1 year, 2 years)
    const { data: recurringDonors } = await supabase
      .from("donor_profiles")
      .select("id, email, first_name, last_name, recurring_since")
      .eq("is_recurring", true)
      .not("recurring_since", "is", null)
      .limit(50);

    const now = new Date();
    for (const donor of recurringDonors || []) {
      if (!donor.recurring_since) continue;

      const recurringDate = new Date(donor.recurring_since);
      const monthsRecurring = Math.floor(
        (now.getTime() - recurringDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
      );

      // Check for milestone months
      const milestones = [6, 12, 24, 36, 48, 60];
      for (const milestone of milestones) {
        if (monthsRecurring >= milestone && monthsRecurring < milestone + 1) {
          actions.push({
            type: "milestone",
            donorId: donor.id,
            email: donor.email,
            name: `${donor.first_name} ${donor.last_name}`,
            description: `Celebrate ${milestone === 12 ? "1 year" : milestone === 24 ? "2 years" : `${milestone} months`} as recurring donor`,
          });
          break;
        }
      }
    }

    return { success: true, data: actions };
  } catch (error) {
    console.error("Error in getPendingDonorActions:", error);
    return { success: false, error: "Failed to fetch pending actions" };
  }
}

// =============================================================================
// ENHANCED STATS WITH TIERS
// =============================================================================

export async function getEnhancedDonationStats(): Promise<ActionResult<DonationStats & { tierStats: DonorTierStats }>> {
  try {
    const [statsResult, tierResult] = await Promise.all([
      getDonationStats(),
      getDonorTierStats(),
    ]);

    if (!statsResult.success || !statsResult.data) {
      return { success: false, error: statsResult.error };
    }

    const tierStats = tierResult.data || {
      founding: 0,
      champion: 0,
      supporter: 0,
      friend: 0,
      total: 0,
    };

    return {
      success: true,
      data: {
        ...statsResult.data,
        tierStats,
      },
    };
  } catch (error) {
    console.error("Error in getEnhancedDonationStats:", error);
    return { success: false, error: "Failed to fetch enhanced stats" };
  }
}
