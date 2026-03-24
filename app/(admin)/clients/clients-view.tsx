"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Phone,
  Mail,
  FileText,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { MspClient, PipelineStage } from "@/types/database";

interface ClientsViewProps {
  initialClientsByStage: Record<PipelineStage, MspClient[]>;
}

const pipelineStages: { key: PipelineStage; label: string; color: string }[] = [
  { key: "new_lead", label: "New Lead", color: "bg-gray-100" },
  { key: "discovery", label: "Discovery", color: "bg-blue-100" },
  { key: "assessment", label: "Assessment", color: "bg-purple-100" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-100" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-100" },
  { key: "contract", label: "Contract", color: "bg-pink-100" },
  { key: "onboarding", label: "Onboarding", color: "bg-[#EFF4EB]" },
  { key: "active", label: "Active Client", color: "bg-green-100" },
];

export function ClientsView({ initialClientsByStage }: ClientsViewProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all clients for filtering
  const allClients = Object.values(initialClientsByStage).flat();

  // Filter clients based on search
  const filteredClients = allClients.filter((client) =>
    `${client.organization_name} ${client.primary_contact_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Get clients for a specific stage (filtered)
  const getClientsForStage = (stage: PipelineStage) =>
    filteredClients.filter((c) => c.pipeline_stage === stage);

  return (
    <>
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "kanban"
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "bg-white text-[#888888] border border-[#DDDDDD] hover:border-[#C9A84C]"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "bg-white text-[#888888] border border-[#DDDDDD] hover:border-[#C9A84C]"
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-white rounded-xl border border-[#DDDDDD] p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            {searchQuery ? "No clients found" : "No clients yet"}
          </h3>
          <p className="text-[#888888]">
            {searchQuery
              ? "Try adjusting your search query"
              : "Add your first MSP client to start building your pipeline"}
          </p>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && filteredClients.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map((stage) => {
              const stageClients = getClientsForStage(stage.key);
              const stageValue = stageClients.reduce(
                (sum, c) => sum + (c.monthly_value || 0),
                0
              );

              return (
                <div
                  key={stage.key}
                  className="w-72 flex-shrink-0 bg-[#FAFAF8] rounded-xl"
                >
                  {/* Stage Header */}
                  <div className={`p-3 rounded-t-xl ${stage.color}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#1A1A1A] text-sm">
                        {stage.label}
                      </h3>
                      <span className="px-2 py-0.5 bg-white/50 text-[#1A1A1A] text-xs font-medium rounded-full">
                        {stageClients.length}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <p className="text-xs text-[#555555] mt-1">
                        ${stageValue.toLocaleString()}/mo
                      </p>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {stageClients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white rounded-lg border border-[#DDDDDD] p-3 hover:border-[#C9A84C] hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => router.push(`/clients/${client.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-[#1A1A1A] line-clamp-1">
                            {client.organization_name}
                          </h4>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-[#F5F3EF]"
                          >
                            <MoreHorizontal className="h-4 w-4 text-[#888888]" />
                          </button>
                        </div>
                        <p className="text-xs text-[#888888] mb-2">
                          {client.primary_contact_name}
                        </p>
                        {client.monthly_value && client.monthly_value > 0 && (
                          <p className="text-sm font-semibold text-[#5A7247] mb-2">
                            ${client.monthly_value.toLocaleString()}/mo
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {client.services?.slice(0, 2).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#888888]">
                          <span>
                            {client.days_in_stage || 0}d in stage
                          </span>
                          {client.account_manager && (
                            <div className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-[10px] font-semibold">
                              TJ
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredClients.length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Organization
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Stage
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Services
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Value
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Days in Stage
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const stage = pipelineStages.find(
                    (s) => s.key === client.pipeline_stage
                  );
                  return (
                    <tr
                      key={client.id}
                      className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-semibold">
                            {client.organization_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A]">
                              {client.organization_name}
                            </p>
                            <p className="text-sm text-[#888888]">
                              {client.organization_type || "Organization"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1A1A1A]">
                          {client.primary_contact_name}
                        </p>
                        <p className="text-xs text-[#888888]">
                          {client.primary_contact_email}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${stage?.color} text-[#1A1A1A]`}
                        >
                          {stage?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {client.services?.map((service) => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded"
                            >
                              {service}
                            </span>
                          )) || (
                            <span className="text-sm text-[#888888]">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-[#5A7247]">
                          {client.monthly_value
                            ? `$${client.monthly_value.toLocaleString()}/mo`
                            : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#888888]">
                          {client.days_in_stage || 0} days
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                            title="Call"
                          >
                            <Phone className="h-4 w-4 text-[#888888]" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                            title="Email"
                          >
                            <Mail className="h-4 w-4 text-[#888888]" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                            title="Generate Proposal"
                          >
                            <FileText className="h-4 w-4 text-[#888888]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
