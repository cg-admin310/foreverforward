export const dynamic = "force-dynamic";

import { getBillingStats, getInvoicesFromDatabase, getClientsForBilling, syncStripeInvoicesToDatabase } from "@/lib/actions/billing";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
  // First, try to sync any existing Stripe invoices to database (for migration)
  // This is idempotent so it's safe to run on every page load
  await syncStripeInvoicesToDatabase().catch(() => {
    // Silently fail - sync is best effort
  });

  // Fetch all data in parallel from database (faster than Stripe API)
  const [statsResult, invoicesResult, clientsResult] = await Promise.all([
    getBillingStats(),
    getInvoicesFromDatabase({ limit: 100 }),
    getClientsForBilling(),
  ]);

  const stats = statsResult.data || {
    mrr: 0,
    collectedThisMonth: 0,
    outstanding: 0,
    overdue: 0,
  };

  const invoices = invoicesResult.data?.invoices || [];
  const clients = clientsResult.data || [];

  return (
    <BillingClient
      stats={stats}
      invoices={invoices}
      clients={clients}
    />
  );
}
