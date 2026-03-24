export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClient } from "@/lib/actions/clients";
import { ClientForm } from "../../client-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getClient(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href={`/clients/${id}`}
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Client
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Edit Client: {result.data.organization_name}
          </h1>
          <p className="text-[#555555]">
            Update client information
          </p>
        </div>
      </div>

      {/* Form */}
      <ClientForm client={result.data} mode="edit" />
    </div>
  );
}
