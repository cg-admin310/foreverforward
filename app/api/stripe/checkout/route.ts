import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createDonationCheckout } from "@/lib/stripe";
import { createDonation } from "@/lib/actions/donations";

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

const checkoutSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  frequency: z.enum(["one_time", "monthly"]),
  donorEmail: z.string().email().optional(),
  donorFirstName: z.string().optional(),
  donorLastName: z.string().optional(),
  donorPhone: z.string().optional(),
  campaign: z.string().optional(),
  designation: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

// =============================================================================
// POST - CREATE CHECKOUT SESSION
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = checkoutSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      amount,
      frequency,
      donorEmail,
      donorFirstName,
      donorLastName,
      donorPhone,
      campaign,
      designation,
      isAnonymous,
    } = validationResult.data;

    // Get the site URL for redirects
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create a pending donation record first
    const donationResult = await createDonation({
      donorFirstName: donorFirstName || "Anonymous",
      donorLastName: donorLastName || "Donor",
      donorEmail: donorEmail || "anonymous@forever4ward.org",
      donorPhone: donorPhone,
      amount: amount,
      frequency: frequency === "monthly" ? "monthly" : "one_time",
      campaign: campaign,
      designation: designation,
      isAnonymous: isAnonymous,
      paymentStatus: "pending",
      source: "website",
    });

    if (!donationResult.success || !donationResult.data) {
      console.error("Failed to create donation record:", donationResult.error);
      return NextResponse.json(
        { error: "Failed to create donation record" },
        { status: 500 }
      );
    }

    const donationId = donationResult.data.id;

    // Create Stripe checkout session
    const { sessionId, url } = await createDonationCheckout({
      amount,
      frequency,
      donorEmail,
      donorName: donorFirstName && donorLastName
        ? `${donorFirstName} ${donorLastName}`
        : undefined,
      successUrl: `${siteUrl}/get-involved/donate/success?session_id={CHECKOUT_SESSION_ID}&donation_id=${donationId}`,
      cancelUrl: `${siteUrl}/get-involved/donate?cancelled=true`,
      metadata: {
        donation_id: donationId,
        campaign: campaign || "",
        designation: designation || "",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId,
      url,
      donationId,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
