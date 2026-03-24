export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "../client-form";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/clients"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Add New Client</h1>
          <p className="text-[#555555]">
            Onboard a new MSP client for IT services
          </p>
        </div>
      </div>

      {/* Form */}
      <ClientForm />
    </div>
  );
}
