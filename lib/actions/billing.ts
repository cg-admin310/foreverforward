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
  createBillingPortalSession,
  createRecurringInvoiceSchedule,
  cancelRecurringInvoiceSchedule,
  updateRecurringInvoiceAmount,
  addInvoiceItem as addStripeInvoiceItem,
  deleteInvoiceItem as deleteStripeInvoiceItem,
  updateDraftInvoice as updateStripeDraftInvoice,
  sendInvoiceReminder as sendStripeInvoiceReminder,
  getSubscription,
} from "@/lib/stripe";
import { MspClient, Invoice, InvoiceStatus, InvoiceType, BillingEvent, RevenueHistory } from "@/types/database";
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
    const errorMessage = error instanceof Error ? error.message : "Failed to create Stripe customer";
    return { success: false, error: errorMessage };
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

    // Create Stripe invoice with CRM source marker
    const invoice = await createStripeInvoice({
      customerId: stripeCustomerId,
      items: data.items,
      dueDate: data.dueDate,
      autoSend: data.autoSend,
      metadata: {
        client_id: data.clientId,
        type: data.type || "one-time",
        source: "forever_forward_crm",
      },
    });

    // Sync invoice to Supabase database
    const adminClient = createAdminClient();
    await adminClient.from("invoices").insert({
      stripe_invoice_id: invoice.id,
      stripe_customer_id: stripeCustomerId,
      client_id: data.clientId,
      number: invoice.number,
      amount: (invoice.amount_due || invoice.total || 0) / 100,
      status: invoice.status === "draft" ? "draft" : "open",
      invoice_type: data.type || "one-time",
      description: data.items.map(i => i.description).join(", "),
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      pdf_url: invoice.invoice_pdf || null,
      metadata: invoice.metadata || null,
    });

    // Transform to display format
    const displayInvoice = transformStripeInvoice(invoice, {
      clientId: data.clientId,
      clientName: client.organization_name,
      type: data.type || "one-time",
    });

    revalidatePath("/billing");
    revalidatePath(`/clients/${data.clientId}`);
    return { success: true, data: displayInvoice };
  } catch (error) {
    console.error("Error creating invoice:", error);
    // Return actual error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Failed to create invoice";
    return { success: false, error: errorMessage };
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

    // Update invoice status in Supabase
    const adminClient = createAdminClient();
    await adminClient
      .from("invoices")
      .update({
        status: "open",
        sent_at: new Date().toISOString(),
        number: invoice.number,
        hosted_invoice_url: invoice.hosted_invoice_url || null,
        pdf_url: invoice.invoice_pdf || null,
      })
      .eq("stripe_invoice_id", stripeInvoiceId);

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
    if (clientId) {
      revalidatePath(`/clients/${clientId}`);
    }
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

    // Update status in Supabase
    const adminClient = createAdminClient();
    await adminClient
      .from("invoices")
      .update({ status: "void" })
      .eq("stripe_invoice_id", stripeInvoiceId);

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
    // Use admin client to bypass RLS for internal server actions
    const adminClient = createAdminClient();

    const { data: clients, error } = await adminClient
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
// GET INVOICES FROM DATABASE (Faster than Stripe API iteration)
// =============================================================================

export async function getInvoicesFromDatabase(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  clientId?: string;
}): Promise<ActionResult<{ invoices: InvoiceDisplay[]; total: number }>> {
  try {
    const adminClient = createAdminClient();

    // Build query
    let query = adminClient
      .from("invoices")
      .select(`
        *,
        msp_clients!invoices_client_id_fkey (
          id,
          organization_name
        )
      `, { count: "exact" });

    // Apply filters
    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.clientId) {
      query = query.eq("client_id", options.clientId);
    }

    // Apply pagination and ordering
    query = query
      .order("created_at", { ascending: false })
      .range(
        options?.offset || 0,
        (options?.offset || 0) + (options?.limit || 25) - 1
      );

    const { data: invoices, error, count } = await query;

    if (error) {
      console.error("Error fetching invoices:", error);
      return { success: false, error: error.message };
    }

    // Transform to display format
    const displayInvoices: InvoiceDisplay[] = (invoices || []).map((inv) => {
      const client = inv.msp_clients as { id: string; organization_name: string } | null;
      return {
        id: inv.id,
        stripeInvoiceId: inv.stripe_invoice_id,
        number: inv.number,
        clientId: inv.client_id || "",
        clientName: client?.organization_name || "Unknown Client",
        amount: inv.amount,
        status: inv.status as InvoiceDisplay["status"],
        dueDate: inv.due_date,
        sentAt: inv.sent_at,
        paidAt: inv.paid_at,
        hostedInvoiceUrl: inv.hosted_invoice_url,
        pdfUrl: inv.pdf_url,
        type: (inv.invoice_type as "recurring" | "one-time") || "one-time",
        createdAt: inv.created_at,
      };
    });

    return {
      success: true,
      data: {
        invoices: displayInvoices,
        total: count || 0,
      },
    };
  } catch (error) {
    console.error("Error in getInvoicesFromDatabase:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

// =============================================================================
// SYNC STRIPE INVOICES TO DATABASE
// =============================================================================

export async function syncStripeInvoicesToDatabase(
  clientId?: string
): Promise<ActionResult<{ synced: number }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const adminClient = createAdminClient();

    // Get clients with Stripe customer IDs
    let clientQuery = supabase
      .from("msp_clients")
      .select("id, organization_name, stripe_customer_id")
      .not("stripe_customer_id", "is", null);

    if (clientId) {
      clientQuery = clientQuery.eq("id", clientId);
    }

    const { data: clients, error: clientsError } = await clientQuery;

    if (clientsError || !clients) {
      return { success: false, error: "Failed to fetch clients" };
    }

    let synced = 0;

    for (const client of clients) {
      if (!client.stripe_customer_id) continue;

      try {
        const invoices = await stripe.invoices.list({
          customer: client.stripe_customer_id,
          limit: 100,
        });

        for (const invoice of invoices.data) {
          // Upsert each invoice to database
          const { error } = await adminClient.from("invoices").upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_customer_id: client.stripe_customer_id,
              client_id: client.id,
              number: invoice.number,
              amount: (invoice.amount_due || invoice.total || 0) / 100,
              status: mapStripeStatus(invoice.status),
              invoice_type: (invoice.metadata?.type as "one-time" | "recurring") || "one-time",
              description: invoice.description || null,
              due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
              sent_at: invoice.status_transitions?.finalized_at
                ? new Date(invoice.status_transitions.finalized_at * 1000).toISOString()
                : null,
              paid_at: invoice.status_transitions?.paid_at
                ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
                : null,
              hosted_invoice_url: invoice.hosted_invoice_url || null,
              pdf_url: invoice.invoice_pdf || null,
              metadata: invoice.metadata || null,
            },
            { onConflict: "stripe_invoice_id" }
          );

          if (!error) synced++;
        }
      } catch (err) {
        console.error(`Error syncing invoices for ${client.stripe_customer_id}:`, err);
      }
    }

    revalidatePath("/billing");
    return { success: true, data: { synced } };
  } catch (error) {
    console.error("Error in syncStripeInvoicesToDatabase:", error);
    return { success: false, error: "Failed to sync invoices" };
  }
}

function mapStripeStatus(status: Stripe.Invoice.Status | null): InvoiceStatus {
  switch (status) {
    case "draft":
      return "draft";
    case "open":
      return "open";
    case "paid":
      return "paid";
    case "uncollectible":
      return "uncollectible";
    case "void":
      return "void";
    default:
      return "draft";
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

// =============================================================================
// RECURRING BILLING - Enable/Disable
// =============================================================================

export async function enableRecurringBilling(params: {
  clientId: string;
  monthlyAmount: number;
  description?: string;
}): Promise<ActionResult<{ subscriptionId: string }>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("*")
      .eq("id", params.clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    // Ensure client has Stripe customer ID
    let stripeCustomerId = client.stripe_customer_id;
    if (!stripeCustomerId) {
      const customerResult = await createStripeCustomerForClient(params.clientId);
      if (!customerResult.success || !customerResult.data) {
        return { success: false, error: "Failed to create Stripe customer" };
      }
      stripeCustomerId = customerResult.data;
    }

    // Check if already has active subscription
    if (client.stripe_subscription_id) {
      return { success: false, error: "Client already has recurring billing enabled" };
    }

    // Create Stripe subscription with send_invoice collection method
    const subscription = await createRecurringInvoiceSchedule({
      customerId: stripeCustomerId,
      monthlyAmount: params.monthlyAmount,
      description: params.description || `Monthly IT Services - ${client.organization_name}`,
      clientId: params.clientId,
    });

    // Update client with subscription info
    const adminClient = createAdminClient();
    await adminClient
      .from("msp_clients")
      .update({
        stripe_subscription_id: subscription.id,
        billing_enabled: true,
        auto_invoice_enabled: true,
        monthly_value: params.monthlyAmount,
      })
      .eq("id", params.clientId);

    // Log billing event
    await logBillingEvent({
      clientId: params.clientId,
      eventType: "recurring_enabled",
      description: `Recurring billing enabled - $${params.monthlyAmount}/month`,
      metadata: {
        subscription_id: subscription.id,
        monthly_amount: params.monthlyAmount,
      },
    });

    revalidatePath("/billing");
    revalidatePath(`/clients/${params.clientId}`);
    return { success: true, data: { subscriptionId: subscription.id } };
  } catch (error) {
    console.error("Error enabling recurring billing:", error);
    return { success: false, error: "Failed to enable recurring billing" };
  }
}

export async function disableRecurringBilling(clientId: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("stripe_subscription_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    if (!client.stripe_subscription_id) {
      return { success: false, error: "Client does not have recurring billing enabled" };
    }

    // Cancel Stripe subscription
    await cancelRecurringInvoiceSchedule(client.stripe_subscription_id);

    // Update client record
    const adminClient = createAdminClient();
    await adminClient
      .from("msp_clients")
      .update({
        stripe_subscription_id: null,
        billing_enabled: false,
        auto_invoice_enabled: false,
      })
      .eq("id", clientId);

    // Log billing event
    await logBillingEvent({
      clientId,
      eventType: "recurring_disabled",
      description: "Recurring billing disabled",
      metadata: {
        subscription_id: client.stripe_subscription_id,
      },
    });

    revalidatePath("/billing");
    revalidatePath(`/clients/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("Error disabling recurring billing:", error);
    return { success: false, error: "Failed to disable recurring billing" };
  }
}

export async function getRecurringBillingStatus(clientId: string): Promise<ActionResult<{
  enabled: boolean;
  monthlyAmount?: number;
  nextInvoiceDate?: string;
  subscriptionId?: string;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("stripe_subscription_id, monthly_value, auto_invoice_enabled")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    if (!client.stripe_subscription_id || !client.auto_invoice_enabled) {
      return { success: true, data: { enabled: false } };
    }

    // Get subscription details from Stripe
    const subscription = await getSubscription(client.stripe_subscription_id);

    // In Stripe v20, current_period_end is on subscription items
    const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end;

    return {
      success: true,
      data: {
        enabled: subscription.status === "active",
        monthlyAmount: client.monthly_value || undefined,
        nextInvoiceDate: currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000).toISOString()
          : undefined,
        subscriptionId: subscription.id,
      },
    };
  } catch (error) {
    console.error("Error getting recurring billing status:", error);
    return { success: false, error: "Failed to get recurring billing status" };
  }
}

export async function updateRecurringBillingAmount(params: {
  clientId: string;
  newAmount: number;
}): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("stripe_subscription_id")
      .eq("id", params.clientId)
      .single();

    if (clientError || !client || !client.stripe_subscription_id) {
      return { success: false, error: "Client not found or no subscription" };
    }

    // Update subscription in Stripe
    await updateRecurringInvoiceAmount({
      subscriptionId: client.stripe_subscription_id,
      newMonthlyAmount: params.newAmount,
      clientId: params.clientId,
    });

    // Update client record
    const adminClient = createAdminClient();
    await adminClient
      .from("msp_clients")
      .update({ monthly_value: params.newAmount })
      .eq("id", params.clientId);

    revalidatePath("/billing");
    revalidatePath(`/clients/${params.clientId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating recurring billing amount:", error);
    return { success: false, error: "Failed to update recurring billing amount" };
  }
}

// =============================================================================
// CLIENT PAYMENT PORTAL
// =============================================================================

export async function getClientPaymentPortalUrl(
  clientId: string,
  returnUrl?: string
): Promise<ActionResult<{ url: string }>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("msp_clients")
      .select("stripe_customer_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    if (!client.stripe_customer_id) {
      return { success: false, error: "Client does not have a Stripe customer account" };
    }

    // Create billing portal session
    const session = await createBillingPortalSession({
      customerId: client.stripe_customer_id,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/clients/${clientId}`,
    });

    // Log billing event
    await logBillingEvent({
      clientId,
      eventType: "portal_accessed",
      description: "Client payment portal accessed",
      metadata: {},
    });

    return { success: true, data: { url: session.url } };
  } catch (error) {
    console.error("Error getting payment portal URL:", error);
    return { success: false, error: "Failed to generate payment portal URL" };
  }
}

// =============================================================================
// INVOICE EDITING (Draft Only)
// =============================================================================

export async function updateInvoice(params: {
  invoiceId: string;
  dueDate?: Date;
  notes?: string;
  internalNotes?: string;
}): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Get invoice
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .select("stripe_invoice_id, status")
      .eq("id", params.invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (invoice.status !== "draft") {
      return { success: false, error: "Only draft invoices can be edited" };
    }

    // Update Stripe invoice if due date changed
    if (params.dueDate) {
      await updateStripeDraftInvoice({
        invoiceId: invoice.stripe_invoice_id,
        dueDate: params.dueDate,
      });
    }

    // Update database record
    const updateData: Record<string, unknown> = {};
    if (params.dueDate) updateData.due_date = params.dueDate.toISOString();
    if (params.notes !== undefined) updateData.notes = params.notes;
    if (params.internalNotes !== undefined) updateData.internal_notes = params.internalNotes;

    await adminClient
      .from("invoices")
      .update(updateData)
      .eq("id", params.invoiceId);

    revalidatePath("/billing");
    return { success: true };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function addInvoiceLineItem(params: {
  invoiceId: string;
  description: string;
  amount: number;
}): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Get invoice
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .select("stripe_invoice_id, stripe_customer_id, status, line_items")
      .eq("id", params.invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (invoice.status !== "draft") {
      return { success: false, error: "Only draft invoices can be edited" };
    }

    // Add line item to Stripe invoice
    const stripeItem = await addStripeInvoiceItem({
      invoiceId: invoice.stripe_invoice_id,
      description: params.description,
      amount: params.amount,
    });

    // Update line_items in database
    const existingItems = (invoice.line_items || []) as Array<{
      description: string;
      amount: number;
      stripe_line_item_id?: string;
    }>;
    existingItems.push({
      description: params.description,
      amount: params.amount,
      stripe_line_item_id: stripeItem.id,
    });

    await adminClient
      .from("invoices")
      .update({
        line_items: existingItems,
        amount: existingItems.reduce((sum, item) => sum + item.amount, 0),
      })
      .eq("id", params.invoiceId);

    revalidatePath("/billing");
    revalidatePath(`/billing/${params.invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding invoice line item:", error);
    return { success: false, error: "Failed to add line item" };
  }
}

export async function removeInvoiceLineItem(params: {
  invoiceId: string;
  lineItemId: string;
}): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Get invoice
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .select("stripe_invoice_id, status, line_items")
      .eq("id", params.invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (invoice.status !== "draft") {
      return { success: false, error: "Only draft invoices can be edited" };
    }

    // Delete from Stripe
    await deleteStripeInvoiceItem(params.lineItemId);

    // Update line_items in database
    const existingItems = (invoice.line_items || []) as Array<{
      description: string;
      amount: number;
      stripe_line_item_id?: string;
    }>;
    const updatedItems = existingItems.filter(
      (item) => item.stripe_line_item_id !== params.lineItemId
    );

    await adminClient
      .from("invoices")
      .update({
        line_items: updatedItems,
        amount: updatedItems.reduce((sum, item) => sum + item.amount, 0),
      })
      .eq("id", params.invoiceId);

    revalidatePath("/billing");
    revalidatePath(`/billing/${params.invoiceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error removing invoice line item:", error);
    return { success: false, error: "Failed to remove line item" };
  }
}

// =============================================================================
// INVOICE REMINDERS
// =============================================================================

export async function sendInvoiceReminder(invoiceId: string): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Get invoice
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .select("stripe_invoice_id, status, reminder_count, client_id")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (invoice.status !== "open") {
      return { success: false, error: "Can only send reminders for open invoices" };
    }

    // Send reminder via Stripe
    await sendStripeInvoiceReminder(invoice.stripe_invoice_id);

    // Update reminder tracking
    await adminClient
      .from("invoices")
      .update({
        reminder_sent_at: new Date().toISOString(),
        reminder_count: (invoice.reminder_count || 0) + 1,
      })
      .eq("id", invoiceId);

    // Log billing event
    await logBillingEvent({
      invoiceId,
      clientId: invoice.client_id,
      eventType: "reminder_sent",
      description: `Payment reminder #${(invoice.reminder_count || 0) + 1} sent`,
      metadata: {
        reminder_count: (invoice.reminder_count || 0) + 1,
      },
    });

    revalidatePath("/billing");
    return { success: true };
  } catch (error) {
    console.error("Error sending invoice reminder:", error);
    return { success: false, error: "Failed to send reminder" };
  }
}

export async function sendBulkOverdueReminders(
  daysOverdue = 7
): Promise<ActionResult<{ sent: number; failed: number }>> {
  try {
    const adminClient = createAdminClient();

    // Get overdue invoices
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOverdue);

    const { data: overdueInvoices, error } = await adminClient
      .from("invoices")
      .select("id, stripe_invoice_id, reminder_count, client_id")
      .eq("status", "open")
      .lt("due_date", cutoffDate.toISOString());

    if (error || !overdueInvoices) {
      return { success: false, error: "Failed to fetch overdue invoices" };
    }

    let sent = 0;
    let failed = 0;

    for (const invoice of overdueInvoices) {
      try {
        await sendStripeInvoiceReminder(invoice.stripe_invoice_id);

        await adminClient
          .from("invoices")
          .update({
            reminder_sent_at: new Date().toISOString(),
            reminder_count: (invoice.reminder_count || 0) + 1,
          })
          .eq("id", invoice.id);

        await logBillingEvent({
          invoiceId: invoice.id,
          clientId: invoice.client_id,
          eventType: "reminder_sent",
          description: `Bulk payment reminder sent (${daysOverdue}+ days overdue)`,
          metadata: {
            reminder_count: (invoice.reminder_count || 0) + 1,
            bulk_send: true,
          },
        });

        sent++;
      } catch (e) {
        console.error(`Failed to send reminder for invoice ${invoice.id}:`, e);
        failed++;
      }
    }

    revalidatePath("/billing");
    return { success: true, data: { sent, failed } };
  } catch (error) {
    console.error("Error sending bulk reminders:", error);
    return { success: false, error: "Failed to send bulk reminders" };
  }
}

// =============================================================================
// REVENUE HISTORY
// =============================================================================

export async function getRevenueHistory(months = 12): Promise<ActionResult<{
  billing: { month: string; collected: number; outstanding: number }[];
  donations: { month: string; amount: number }[];
}>> {
  try {
    const adminClient = createAdminClient();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Generate list of months
    const monthList: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      monthList.push(current.toISOString().slice(0, 7)); // YYYY-MM format
      current.setMonth(current.getMonth() + 1);
    }

    // Get billing revenue from revenue_history table (may not exist yet)
    let billingHistory: { month_year: string; collected_amount: number; outstanding_amount: number }[] | null = null;
    let donationHistory: { month_year: string; collected_amount: number }[] | null = null;

    try {
      const { data } = await adminClient
        .from("revenue_history")
        .select("month_year, collected_amount, outstanding_amount")
        .eq("source", "billing")
        .gte("month_year", monthList[0])
        .order("month_year");
      billingHistory = data;

      const { data: donData } = await adminClient
        .from("revenue_history")
        .select("month_year, collected_amount")
        .eq("source", "donations")
        .gte("month_year", monthList[0])
        .order("month_year");
      donationHistory = donData;
    } catch {
      // Table might not exist yet - will fall back to calculating from invoices/donations
    }

    // If no revenue history, calculate from invoices and donations
    let billingData: { month: string; collected: number; outstanding: number }[];
    let donationData: { month: string; amount: number }[];

    if (!billingHistory || billingHistory.length === 0) {
      // Calculate from invoices
      const { data: invoices } = await adminClient
        .from("invoices")
        .select("amount, status, paid_at, created_at")
        .gte("created_at", startDate.toISOString());

      const billingByMonth = new Map<string, { collected: number; outstanding: number }>();
      for (const inv of invoices || []) {
        const month = (inv.paid_at || inv.created_at).slice(0, 7);
        const existing = billingByMonth.get(month) || { collected: 0, outstanding: 0 };
        if (inv.status === "paid") {
          existing.collected += inv.amount;
        } else if (inv.status === "open") {
          existing.outstanding += inv.amount;
        }
        billingByMonth.set(month, existing);
      }

      billingData = monthList.map((month) => ({
        month,
        collected: billingByMonth.get(month)?.collected || 0,
        outstanding: billingByMonth.get(month)?.outstanding || 0,
      }));
    } else {
      const historyMap = new Map(billingHistory.map((h) => [h.month_year, h]));
      billingData = monthList.map((month) => ({
        month,
        collected: historyMap.get(month)?.collected_amount || 0,
        outstanding: historyMap.get(month)?.outstanding_amount || 0,
      }));
    }

    if (!donationHistory || donationHistory.length === 0) {
      // Calculate from donations
      const { data: donations } = await adminClient
        .from("donations")
        .select("amount, created_at")
        .eq("payment_status", "succeeded")
        .gte("created_at", startDate.toISOString());

      const donationByMonth = new Map<string, number>();
      for (const don of donations || []) {
        const month = don.created_at.slice(0, 7);
        donationByMonth.set(month, (donationByMonth.get(month) || 0) + don.amount);
      }

      donationData = monthList.map((month) => ({
        month,
        amount: donationByMonth.get(month) || 0,
      }));
    } else {
      const historyMap = new Map(donationHistory.map((h) => [h.month_year, h]));
      donationData = monthList.map((month) => ({
        month,
        amount: historyMap.get(month)?.collected_amount || 0,
      }));
    }

    return {
      success: true,
      data: {
        billing: billingData,
        donations: donationData,
      },
    };
  } catch (error) {
    console.error("Error getting revenue history:", error);
    return { success: false, error: "Failed to get revenue history" };
  }
}

// =============================================================================
// CLIENT BILLING DATA
// =============================================================================

export async function getClientBillingData(clientId: string): Promise<ActionResult<{
  invoices: InvoiceDisplay[];
  stats: { totalBilled: number; totalPaid: number; outstanding: number };
  recurringStatus: { enabled: boolean; amount?: number; nextInvoice?: string };
}>> {
  try {
    const adminClient = createAdminClient();

    // Get client with billing info
    const { data: client, error: clientError } = await adminClient
      .from("msp_clients")
      .select("id, organization_name, stripe_customer_id, stripe_subscription_id, monthly_value, auto_invoice_enabled")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return { success: false, error: "Client not found" };
    }

    // Get invoices from database
    const { data: invoices } = await adminClient
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    // Calculate stats
    let totalBilled = 0;
    let totalPaid = 0;
    let outstanding = 0;

    const displayInvoices: InvoiceDisplay[] = (invoices || []).map((inv) => {
      totalBilled += inv.amount;
      if (inv.status === "paid") totalPaid += inv.amount;
      if (inv.status === "open") outstanding += inv.amount;

      return {
        id: inv.id,
        stripeInvoiceId: inv.stripe_invoice_id,
        number: inv.number,
        clientId: inv.client_id || "",
        clientName: client.organization_name,
        amount: inv.amount,
        status: inv.status as InvoiceDisplay["status"],
        dueDate: inv.due_date,
        sentAt: inv.sent_at,
        paidAt: inv.paid_at,
        hostedInvoiceUrl: inv.hosted_invoice_url,
        pdfUrl: inv.pdf_url,
        type: (inv.invoice_type as "recurring" | "one-time") || "one-time",
        createdAt: inv.created_at,
      };
    });

    // Get recurring status
    let recurringStatus: { enabled: boolean; amount?: number; nextInvoice?: string } = {
      enabled: false,
    };

    if (client.stripe_subscription_id && client.auto_invoice_enabled) {
      try {
        const subscription = await getSubscription(client.stripe_subscription_id);
        // In Stripe v20, current_period_end is on subscription items
        const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end;
        recurringStatus = {
          enabled: subscription.status === "active",
          amount: client.monthly_value || undefined,
          nextInvoice: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : undefined,
        };
      } catch (e) {
        console.error("Error fetching subscription:", e);
      }
    }

    return {
      success: true,
      data: {
        invoices: displayInvoices,
        stats: { totalBilled, totalPaid, outstanding },
        recurringStatus,
      },
    };
  } catch (error) {
    console.error("Error getting client billing data:", error);
    return { success: false, error: "Failed to get client billing data" };
  }
}

// =============================================================================
// EXPORT INVOICES TO CSV
// =============================================================================

export async function exportInvoicesToCSV(options?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  clientId?: string;
}): Promise<ActionResult<string>> {
  try {
    const adminClient = createAdminClient();

    // Build query
    let query = adminClient
      .from("invoices")
      .select(`
        *,
        msp_clients!invoices_client_id_fkey (
          organization_name
        )
      `)
      .order("created_at", { ascending: false });

    if (options?.startDate) {
      query = query.gte("created_at", options.startDate);
    }
    if (options?.endDate) {
      query = query.lte("created_at", options.endDate);
    }
    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }
    if (options?.clientId) {
      query = query.eq("client_id", options.clientId);
    }

    const { data: invoices, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    // Build CSV
    const headers = [
      "Invoice Number",
      "Client",
      "Amount",
      "Status",
      "Type",
      "Due Date",
      "Sent Date",
      "Paid Date",
      "Created Date",
    ];

    const rows = (invoices || []).map((inv) => {
      const client = inv.msp_clients as { organization_name: string } | null;
      return [
        inv.number || inv.stripe_invoice_id,
        client?.organization_name || "Unknown",
        inv.amount.toFixed(2),
        inv.status,
        inv.invoice_type || "one-time",
        inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "",
        inv.sent_at ? new Date(inv.sent_at).toLocaleDateString() : "",
        inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : "",
        new Date(inv.created_at).toLocaleDateString(),
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return { success: true, data: csv };
  } catch (error) {
    console.error("Error exporting invoices:", error);
    return { success: false, error: "Failed to export invoices" };
  }
}

// =============================================================================
// GET SINGLE INVOICE DETAIL
// =============================================================================

export async function getInvoiceDetail(invoiceId: string): Promise<ActionResult<{
  invoice: InvoiceDisplay & {
    lineItems: { description: string; amount: number; quantity?: number }[];
    notes: string | null;
    internalNotes: string | null;
    reminderCount: number;
    reminderSentAt: string | null;
  };
  client: { id: string; name: string; email: string };
  billingEvents: { eventType: string; description: string; createdAt: string }[];
}>> {
  try {
    const adminClient = createAdminClient();

    // Get invoice with client
    const { data: invoice, error: invoiceError } = await adminClient
      .from("invoices")
      .select(`
        *,
        msp_clients!invoices_client_id_fkey (
          id,
          organization_name,
          primary_contact_email
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Get billing events for this invoice
    const { data: events } = await adminClient
      .from("billing_events")
      .select("event_type, description, created_at")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: false });

    const client = invoice.msp_clients as {
      id: string;
      organization_name: string;
      primary_contact_email: string;
    } | null;

    return {
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          stripeInvoiceId: invoice.stripe_invoice_id,
          number: invoice.number,
          clientId: invoice.client_id || "",
          clientName: client?.organization_name || "Unknown",
          amount: invoice.amount,
          status: invoice.status as InvoiceDisplay["status"],
          dueDate: invoice.due_date,
          sentAt: invoice.sent_at,
          paidAt: invoice.paid_at,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          pdfUrl: invoice.pdf_url,
          type: (invoice.invoice_type as "recurring" | "one-time") || "one-time",
          createdAt: invoice.created_at,
          lineItems: (invoice.line_items || []) as { description: string; amount: number; quantity?: number }[],
          notes: invoice.notes,
          internalNotes: invoice.internal_notes,
          reminderCount: invoice.reminder_count || 0,
          reminderSentAt: invoice.reminder_sent_at,
        },
        client: {
          id: client?.id || "",
          name: client?.organization_name || "Unknown",
          email: client?.primary_contact_email || "",
        },
        billingEvents: (events || []).map((e) => ({
          eventType: e.event_type,
          description: e.description || "",
          createdAt: e.created_at,
        })),
      },
    };
  } catch (error) {
    console.error("Error getting invoice detail:", error);
    return { success: false, error: "Failed to get invoice detail" };
  }
}

// =============================================================================
// HELPER: Log Billing Event
// =============================================================================

async function logBillingEvent(params: {
  invoiceId?: string | null;
  clientId?: string | null;
  eventType: string;
  description: string;
  metadata?: Record<string, unknown>;
  performedBy?: string;
}) {
  const adminClient = createAdminClient();

  try {
    await adminClient.from("billing_events").insert({
      invoice_id: params.invoiceId || null,
      client_id: params.clientId || null,
      event_type: params.eventType,
      description: params.description,
      metadata: params.metadata || null,
      performed_by: params.performedBy || null,
    });
  } catch (error) {
    console.error("Failed to log billing event:", error);
  }
}
