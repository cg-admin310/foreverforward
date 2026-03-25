import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoiceDetail } from "@/lib/actions/billing";
import InvoiceDetailClient from "./invoice-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getInvoiceDetail(id);

  if (!result.success || !result.data) {
    return {
      title: "Invoice Not Found | Forever Forward",
    };
  }

  return {
    title: `Invoice ${result.data.invoice.number || id} | Forever Forward`,
    description: `Invoice details for ${result.data.client.name}`,
  };
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getInvoiceDetail(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <InvoiceDetailClient initialData={result.data} />;
}
