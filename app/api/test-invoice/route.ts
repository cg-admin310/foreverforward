import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInvoice as createStripeInvoice, createStripeCustomer } from "@/lib/stripe";

export async function GET() {
  try {
    const adminClient = createAdminClient();

    // Get Test Company Inc
    const { data: client, error } = await adminClient
      .from("msp_clients")
      .select("*")
      .eq("organization_name", "Test Company Inc")
      .single();

    if (error || !client) {
      return NextResponse.json({ error: "Client not found", details: error }, { status: 404 });
    }

    console.log("[test-invoice] Client found:", client.id);

    // Get or create Stripe customer
    let stripeCustomerId = client.stripe_customer_id;
    if (!stripeCustomerId) {
      console.log("[test-invoice] Creating Stripe customer...");
      const customer = await createStripeCustomer({
        email: client.primary_contact_email,
        name: client.organization_name,
        metadata: { msp_client_id: client.id },
      });
      stripeCustomerId = customer.id;

      // Update client with Stripe customer ID
      await adminClient
        .from("msp_clients")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", client.id);

      console.log("[test-invoice] Created Stripe customer:", stripeCustomerId);
    }

    // Create invoice with HARDCODED values
    const items = [
      {
        description: "HARDCODED TEST - March 2026 Managed IT Services",
        amount: 999, // $999.00
      },
    ];

    console.log("[test-invoice] Creating invoice with items:", JSON.stringify(items));

    const invoice = await createStripeInvoice({
      customerId: stripeCustomerId,
      items,
      autoSend: true,
      metadata: {
        msp_client_id: client.id,
        test: "true",
      },
    });

    console.log("[test-invoice] Invoice created:", {
      id: invoice.id,
      number: invoice.number,
      amount_due: invoice.amount_due,
      total: invoice.total,
      hosted_invoice_url: invoice.hosted_invoice_url,
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        number: invoice.number,
        amount_due: invoice.amount_due,
        amount_due_dollars: invoice.amount_due / 100,
        total: invoice.total,
        total_dollars: invoice.total / 100,
        hosted_invoice_url: invoice.hosted_invoice_url,
        pdf: invoice.invoice_pdf,
      },
    });
  } catch (error) {
    console.error("[test-invoice] Error:", error);
    return NextResponse.json(
      { error: "Failed to create test invoice", details: String(error) },
      { status: 500 }
    );
  }
}
