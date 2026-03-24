export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Plus,
  Building2,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClientsByPipeline, getClientStats } from "@/lib/actions/clients";
import { ClientsView } from "./clients-view";
import type { PipelineStage, MspClient } from "@/types/database";

export default async function ClientsPage() {
  // Fetch clients by pipeline and stats in parallel
  const [pipelineResult, statsResult] = await Promise.all([
    getClientsByPipeline(),
    getClientStats(),
  ]);

  const emptyPipeline: Record<PipelineStage, MspClient[]> = {
    new_lead: [],
    discovery: [],
    assessment: [],
    proposal: [],
    negotiation: [],
    contract: [],
    onboarding: [],
    active: [],
    churned: [],
  };
  const clientsByStage = pipelineResult.data || emptyPipeline;
  const stats = statsResult.data;

  // Calculate totals
  const allClients = Object.values(clientsByStage).flat();
  const activeClients = clientsByStage.active || [];
  const pipelineClients = allClients.filter((c) => c.pipeline_stage !== "active" && c.pipeline_stage !== "churned");

  const mrr = activeClients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
  const pipelineValue = pipelineClients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">MSP Clients</h1>
          <p className="text-[#555555]">
            Manage your IT services sales pipeline
          </p>
        </div>
        <Button asChild>
          <Link href="/leads/new?type=msp">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pipeline Value",
            value: `$${pipelineValue.toLocaleString()}`,
            subtext: "/month potential",
            icon: DollarSign,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Monthly Recurring Revenue",
            value: `$${mrr.toLocaleString()}`,
            subtext: "from active clients",
            icon: DollarSign,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Active Clients",
            value: stats?.active ?? activeClients.length,
            subtext: "paying clients",
            icon: Building2,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "In Pipeline",
            value: pipelineClients.length,
            subtext: "prospects",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#888888]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
                <p className="text-xs text-[#888888] mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clients View (Client Component for interactivity) */}
      <ClientsView initialClientsByStage={clientsByStage} />
    </div>
  );
}
