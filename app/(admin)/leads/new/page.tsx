export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeadForm } from "../lead-form";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/leads"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Add New Lead</h1>
          <p className="text-[#555555]">
            Create a new lead for program enrollment or IT services
          </p>
        </div>
      </div>

      {/* Form */}
      <LeadForm />
    </div>
  );
}
