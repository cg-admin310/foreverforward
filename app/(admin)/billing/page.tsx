export const dynamic = "force-dynamic";

import { getBillingStats, getInvoices, getClientsForBilling } from "@/lib/actions/billing";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
  // Fetch all data in parallel
  const [statsResult, invoicesResult, clientsResult] = await Promise.all([
    getBillingStats(),
    getInvoices({ limit: 100 }),
    getClientsForBilling(),
  ]);

  const stats = statsResult.data || {
    mrr: 0,
    collectedThisMonth: 0,
    outstanding: 0,
    overdue: 0,
  };

  const invoices = invoicesResult.data || [];
  const clients = clientsResult.data || [];

  return (
    <BillingClient
      stats={stats}
      invoices={invoices}
      clients={clients}
    />
  );
}
