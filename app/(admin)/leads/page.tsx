export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLeads, getLeadStats } from "@/lib/actions/leads";
import { LeadsTable } from "./leads-table";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch leads and stats in parallel
  const [leadsResult, statsResult] = await Promise.all([
    getLeads({
      type: params.type as any,
      status: params.status as any,
      search: params.search,
      limit,
      offset,
    }),
    getLeadStats(),
  ]);

  const leads = leadsResult.data?.leads || [];
  const total = leadsResult.data?.total || 0;
  const stats = statsResult.data;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Leads</h1>
          <p className="text-[#555555]">
            Manage incoming leads from all sources
          </p>
        </div>
        <Button asChild>
          <Link href="/leads/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Leads", value: stats?.total || 0, color: "text-[#1A1A1A]" },
          { label: "New", value: stats?.new || 0, color: "text-blue-600" },
          { label: "Contacted", value: stats?.contacted || 0, color: "text-yellow-600" },
          { label: "Qualified", value: stats?.qualified || 0, color: "text-green-600" },
          { label: "Converted", value: stats?.converted || 0, color: "text-[#5A7247]" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
          >
            <p className="text-sm text-[#888888]">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Leads Table (Client Component for interactivity) */}
      <LeadsTable
        initialLeads={leads}
        total={total}
        currentPage={page}
        totalPages={totalPages}
        currentType={params.type}
        currentStatus={params.status}
        currentSearch={params.search}
      />
    </div>
  );
}
