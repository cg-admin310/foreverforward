"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  stripe,
  createInvoice as createStripeInvoice,
  sendInvoice as sendStripeInvoice,
  voidInvoice as voidStripeInvoice,
  getOrCreateCustomer,
  listCustomerInvoices,
} from "@/lib/stripe";
import { MspClient } from "@/types/database";
import Stripe from "stripe";

// =============================================================================
// TYPES
// =============================================================================

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface InvoiceDisplay {
  id: string;
  stripeInvoiceId: string;
  number: string | null;
  clientId: string;
  clientName: string;
  amount: number;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  dueDate: string | null;
  sentAt: string | null;
  paidAt: string | null;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
  type: "recurring" | "one-time";
  createdAt: string;
}

export interface BillingStats {
  mrr: number;
  collectedThisMonth: number;
  outstanding: number;
  overdue: number;
}

// =============================================================================
// CREATE STRIPE CUSTOMER FOR CLIENT
// =============================================================================

export async function createStripeCustomerForClient(
  clientId: string
): Promise<ActionResult<string>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    // Check if already has Stripe customer
    if (client.stripe_customer_id) {
      return { success: true, data: client.stripe_customer_id };
    }

    // Create Stripe customer
    const customer = await getOrCreateCustomer(
      client.primary_contact_email,
      client.organization_name,
      {
        client_id: clientId,
        organization_type: client.organization_type || "",
      }
    );

    // Update client with Stripe customer ID
    const adminClient = createAdminClient();
    await adminClient
      .from("msp_clients")
      .update({ stripe_customer_id: customer.id })
      .eq("id", clientId);

    revalidatePath("/clients");
    revalidatePath("/billing");
    return { success: true, data: customer.id };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return { success: false, error: "Failed to create Stripe customer" };
  }
}

// =============================================================================
// CREATE INVOICE
// =============================================================================

export async function createInvoice(data: {
  clientId: string;
  items: { description: string; amount: number; quantity?: number }[];
  dueDate?: Date;
  autoSend?: boolean;
  type?: "recurring" | "one-time";
}): Promise<ActionResult<InvoiceDisplay>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("*")
      .eq("id", data.clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    // Ensure client has Stripe customer ID
    let stripeCustomerId = client.stripe_customer_id;
    if (!stripeCustomerId) {
      const customerResult = await createStripeCustomerForClient(data.clientId);
      if (!customerResult.success || !customerResult.data) {
        return { success: false, error: "Failed to create Stripe customer" };
      }
      stripeCustomerId = customerResult.data;
    }

    // Create Stripe invoice
    const invoice = await createStripeInvoice({
      customerId: stripeCustomerId,
      items: data.items,
      dueDate: data.dueDate,
      autoSend: data.autoSend,
      metadata: {
        client_id: data.clientId,
        type: data.type || "one-time",
      },
    });

    // Transform to display format
    const displayInvoice = transformStripeInvoice(invoice, {
      clientId: data.clientId,
      clientName: client.organization_name,
      type: data.type || "one-time",
    });

    revalidatePath("/billing");
    return { success: true, data: displayInvoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

// =============================================================================
// SEND INVOICE
// =============================================================================

export async function sendInvoice(
  stripeInvoiceId: string
): Promise<ActionResult<InvoiceDisplay>> {
  try {
    const invoice = await sendStripeInvoice(stripeInvoiceId);

    // Get client info from metadata
    const clientId = invoice.metadata?.client_id || "";
    const clientName = typeof invoice.customer === "object" && invoice.customer
      ? (invoice.customer as Stripe.Customer).name || "Unknown"
      : "Unknown";

    const displayInvoice = transformStripeInvoice(invoice, {
      clientId,
      clientName,
      type: (invoice.metadata?.type as "recurring" | "one-time") || "one-time",
    });

    revalidatePath("/billing");
    return { success: true, data: displayInvoice };
  } catch (error) {
    console.error("Error sending invoice:", error);
    return { success: false, error: "Failed to send invoice" };
  }
}

// =============================================================================
// VOID INVOICE
// =============================================================================

export async function voidInvoice(
  stripeInvoiceId: string
): Promise<ActionResult> {
  try {
    await voidStripeInvoice(stripeInvoiceId);
    revalidatePath("/billing");
    return { success: true };
  } catch (error) {
    console.error("Error voiding invoice:", error);
    return { success: false, error: "Failed to void invoice" };
  }
}

// =============================================================================
// GET ALL INVOICES
// =============================================================================

export async function getInvoices(options?: {
  limit?: number;
  status?: string;
}): Promise<ActionResult<InvoiceDisplay[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all clients with Stripe customer IDs
    const { data: clients, error: clientsError } = await supabase
      .from("msp_clients")
      .select("id, organization_name, stripe_customer_id")
      .not("stripe_customer_id", "is", null);

    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      return { success: false, error: clientsError.message };
    }

    if (!clients || clients.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch invoices for all customers
    const allInvoices: InvoiceDisplay[] = [];

    for (const client of clients) {
      if (!client.stripe_customer_id) continue;

      try {
        const invoices = await stripe.invoices.list({
          customer: client.stripe_customer_id,
          limit: options?.limit || 100,
          ...(options?.status && options.status !== "all" ? { status: options.status as Stripe.InvoiceListParams["status"] } : {}),
        });

        for (const invoice of invoices.data) {
          allInvoices.push(
            transformStripeInvoice(invoice, {
              clientId: client.id,
              clientName: client.organization_name,
              type: (invoice.metadata?.type as "recurring" | "one-time") || "one-time",
            })
          );
        }
      } catch (err) {
        console.error(`Error fetching invoices for customer ${client.stripe_customer_id}:`, err);
      }
    }

    // Sort by created date descending
    allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, data: allInvoices };
  } catch (error) {
    console.error("Error in getInvoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

// =============================================================================
// GET CLIENT INVOICES
// =============================================================================

export async function getClientInvoices(
  clientId: string,
  limit = 10
): Promise<ActionResult<InvoiceDisplay[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("id, organization_name, stripe_customer_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    if (!client.stripe_customer_id) {
      return { success: true, data: [] };
    }

    const invoices = await listCustomerInvoices(client.stripe_customer_id, limit);

    const displayInvoices = invoices.map((invoice) =>
      transformStripeInvoice(invoice, {
        clientId: client.id,
        clientName: client.organization_name,
        type: (invoice.metadata?.type as "recurring" | "one-time") || "one-time",
      })
    );

    return { success: true, data: displayInvoices };
  } catch (error) {
    console.error("Error in getClientInvoices:", error);
    return { success: false, error: "Failed to fetch client invoices" };
  }
}

// =============================================================================
// GET BILLING STATS
// =============================================================================

export async function getBillingStats(): Promise<ActionResult<BillingStats>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get MRR from active clients
    const { data: clients, error: clientsError } = await supabase
      .from("msp_clients")
      .select("monthly_value, stripe_customer_id")
      .eq("pipeline_stage", "active");

    if (clientsError) {
      return { success: false, error: clientsError.message };
    }

    const mrr = clients?.reduce((sum, c) => sum + (c.monthly_value || 0), 0) || 0;

    // Get invoice stats from Stripe
    let collectedThisMonth = 0;
    let outstanding = 0;
    let overdue = 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const client of clients || []) {
      if (!client.stripe_customer_id) continue;

      try {
        const invoices = await stripe.invoices.list({
          customer: client.stripe_customer_id,
          limit: 100,
        });

        for (const invoice of invoices.data) {
          // Collected this month
          if (invoice.status === "paid" && invoice.status_transitions?.paid_at) {
            const paidDate = new Date(invoice.status_transitions.paid_at * 1000);
            if (paidDate >= startOfMonth) {
              collectedThisMonth += (invoice.amount_paid || 0) / 100;
            }
          }

          // Outstanding (open invoices)
          if (invoice.status === "open") {
            outstanding += (invoice.amount_due || 0) / 100;

            // Check if overdue
            if (invoice.due_date && new Date(invoice.due_date * 1000) < now) {
              overdue += (invoice.amount_due || 0) / 100;
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching invoices for customer ${client.stripe_customer_id}:`, err);
      }
    }

    return {
      success: true,
      data: {
        mrr,
        collectedThisMonth,
        outstanding,
        overdue,
      },
    };
  } catch (error) {
    console.error("Error in getBillingStats:", error);
    return { success: false, error: "Failed to fetch billing stats" };
  }
}

// =============================================================================
// GET CLIENTS FOR INVOICE CREATION
// =============================================================================

export async function getClientsForBilling(): Promise<ActionResult<{ id: string; name: string; hasStripeCustomer: boolean }[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: clients, error } = await supabase
      .from("msp_clients")
      .select("id, organization_name, stripe_customer_id")
      .in("pipeline_stage", ["active", "proposal", "negotiation"])
      .order("organization_name");

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: (clients || []).map((c) => ({
        id: c.id,
        name: c.organization_name,
        hasStripeCustomer: !!c.stripe_customer_id,
      })),
    };
  } catch (error) {
    console.error("Error in getClientsForBilling:", error);
    return { success: false, error: "Failed to fetch clients" };
  }
}

// =============================================================================
// HELPER: Transform Stripe Invoice to Display Format
// =============================================================================

function transformStripeInvoice(
  invoice: Stripe.Invoice,
  extra: { clientId: string; clientName: string; type: "recurring" | "one-time" }
): InvoiceDisplay {
  let status: InvoiceDisplay["status"] = "draft";
  if (invoice.status === "paid") status = "paid";
  else if (invoice.status === "open") status = "open";
  else if (invoice.status === "uncollectible") status = "uncollectible";
  else if (invoice.status === "void") status = "void";

  return {
    id: invoice.id,
    stripeInvoiceId: invoice.id,
    number: invoice.number,
    clientId: extra.clientId,
    clientName: extra.clientName,
    amount: (invoice.amount_due || invoice.total || 0) / 100,
    status,
    dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    sentAt: invoice.status_transitions?.finalized_at
      ? new Date(invoice.status_transitions.finalized_at * 1000).toISOString()
      : null,
    paidAt: invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : null,
    hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    pdfUrl: invoice.invoice_pdf || null,
    type: extra.type,
    createdAt: new Date(invoice.created * 1000).toISOString(),
  };
}
