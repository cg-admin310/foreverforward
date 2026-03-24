"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Building2,
  DollarSign,
  Users,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PipelineStage =
  | "new_lead"
  | "discovery"
  | "assessment"
  | "proposal"
  | "negotiation"
  | "contract"
  | "onboarding"
  | "active";

interface Client {
  id: string;
  organization: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  pipeline_stage: PipelineStage;
  service_interests: string[];
  monthly_value: number;
  days_in_stage: number;
  assigned_to: string | null;
  last_activity: string;
}

const sampleClients: Client[] = [
  {
    id: "1",
    organization: "Hope Community Center",
    contact_name: "Sarah Chen",
    contact_email: "schen@hopecenter.org",
    contact_phone: "(310) 555-0456",
    pipeline_stage: "proposal",
    service_interests: ["Managed IT", "Software & AI"],
    monthly_value: 2500,
    days_in_stage: 3,
    assigned_to: "TJ Wilform",
    last_activity: "Sent proposal",
  },
  {
    id: "2",
    organization: "LAUSD - Crenshaw High",
    contact_name: "Linda Rodriguez",
    contact_email: "lrodriguez@lausd.net",
    contact_phone: "(323) 555-0321",
    pipeline_stage: "assessment",
    service_interests: ["Low Voltage", "IT Refresh"],
    monthly_value: 5000,
    days_in_stage: 5,
    assigned_to: "TJ Wilform",
    last_activity: "Scheduled site visit",
  },
  {
    id: "3",
    organization: "Youth Empowerment Alliance",
    contact_name: "Michael Thompson",
    contact_email: "mthompson@yea.org",
    contact_phone: "(213) 555-0876",
    pipeline_stage: "discovery",
    service_interests: ["Managed IT"],
    monthly_value: 1500,
    days_in_stage: 2,
    assigned_to: null,
    last_activity: "Initial call scheduled",
  },
  {
    id: "4",
    organization: "Watts Community Center",
    contact_name: "Angela Davis",
    contact_email: "adavis@wattscommunity.org",
    contact_phone: "(323) 555-0654",
    pipeline_stage: "active",
    service_interests: ["Managed IT"],
    monthly_value: 1800,
    days_in_stage: 45,
    assigned_to: "TJ Wilform",
    last_activity: "Monthly check-in",
  },
  {
    id: "5",
    organization: "LA Youth Services",
    contact_name: "David Kim",
    contact_email: "dkim@layouth.org",
    contact_phone: "(310) 555-0987",
    pipeline_stage: "active",
    service_interests: ["Managed IT", "Software & AI"],
    monthly_value: 3200,
    days_in_stage: 120,
    assigned_to: "TJ Wilform",
    last_activity: "Invoice paid",
  },
  {
    id: "6",
    organization: "New Horizons Charter",
    contact_name: "Patricia Wells",
    contact_email: "pwells@newhorizons.edu",
    contact_phone: "(213) 555-0432",
    pipeline_stage: "new_lead",
    service_interests: ["Low Voltage", "CCTV"],
    monthly_value: 0,
    days_in_stage: 1,
    assigned_to: null,
    last_activity: "Website inquiry",
  },
  {
    id: "7",
    organization: "Community Health Partners",
    contact_name: "Robert Johnson",
    contact_email: "rjohnson@chp.org",
    contact_phone: "(323) 555-0765",
    pipeline_stage: "negotiation",
    service_interests: ["Managed IT"],
    monthly_value: 2200,
    days_in_stage: 7,
    assigned_to: "TJ Wilform",
    last_activity: "Pricing discussion",
  },
];

const pipelineStages: { key: PipelineStage; label: string; color: string }[] = [
  { key: "new_lead", label: "New Lead", color: "bg-gray-100" },
  { key: "discovery", label: "Discovery", color: "bg-blue-100" },
  { key: "assessment", label: "Assessment", color: "bg-purple-100" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-100" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-100" },
  { key: "contract", label: "Contract", color: "bg-pink-100" },
  { key: "onboarding", label: "Onboarding", color: "bg-[#EFF4EB]" },
  { key: "active", label: "Active", color: "bg-green-100" },
];

export default function ClientsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = sampleClients.filter((client) =>
    `${client.organization} ${client.contact_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getClientsForStage = (stage: PipelineStage) =>
    filteredClients.filter((c) => c.pipeline_stage === stage);

  const calculatePipelineValue = () => {
    const pipelineClients = sampleClients.filter((c) => c.pipeline_stage !== "active");
    return pipelineClients.reduce((sum, c) => sum + c.monthly_value, 0);
  };

  const calculateMRR = () => {
    const activeClients = sampleClients.filter((c) => c.pipeline_stage === "active");
    return activeClients.reduce((sum, c) => sum + c.monthly_value, 0);
  };

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
            value: `$${calculatePipelineValue().toLocaleString()}`,
            subtext: "/month potential",
            icon: DollarSign,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Monthly Recurring Revenue",
            value: `$${calculateMRR().toLocaleString()}`,
            subtext: "from active clients",
            icon: DollarSign,
            color: "text-[#5A7247]",
            bg: "bg-[#EFF4EB]",
          },
          {
            label: "Active Clients",
            value: sampleClients.filter((c) => c.pipeline_stage === "active").length,
            subtext: "paying clients",
            icon: Building2,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "In Pipeline",
            value: sampleClients.filter((c) => c.pipeline_stage !== "active").length,
            subtext: "prospects",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
          </motion.div>
        ))}
      </div>

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

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map((stage) => {
              const stageClients = getClientsForStage(stage.key);
              const stageValue = stageClients.reduce((sum, c) => sum + c.monthly_value, 0);

              return (
                <div
                  key={stage.key}
                  className="w-72 flex-shrink-0 bg-[#FAFAF8] rounded-xl"
                >
                  {/* Stage Header */}
                  <div className={`p-3 rounded-t-xl ${stage.color}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#1A1A1A] text-sm">{stage.label}</h3>
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
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg border border-[#DDDDDD] p-3 hover:border-[#C9A84C] hover:shadow-sm transition-all cursor-pointer"
                        onClick={() => (window.location.href = `/clients/${client.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-[#1A1A1A] line-clamp-1">
                            {client.organization}
                          </h4>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-[#F5F3EF]"
                          >
                            <MoreHorizontal className="h-4 w-4 text-[#888888]" />
                          </button>
                        </div>
                        <p className="text-xs text-[#888888] mb-2">{client.contact_name}</p>
                        {client.monthly_value > 0 && (
                          <p className="text-sm font-semibold text-[#5A7247] mb-2">
                            ${client.monthly_value.toLocaleString()}/mo
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {client.service_interests.slice(0, 2).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#888888]">
                          <span>{client.days_in_stage}d in stage</span>
                          {client.assigned_to && (
                            <div className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] text-[10px] font-semibold">
                              {client.assigned_to
                                .split(" ")
                                .map((n) => n.charAt(0))
                                .join("")}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
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
                    Last Activity
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  const stage = pipelineStages.find((s) => s.key === client.pipeline_stage);
                  return (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8] cursor-pointer"
                      onClick={() => (window.location.href = `/clients/${client.id}`)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-semibold">
                            {client.organization.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A]">{client.organization}</p>
                            <p className="text-sm text-[#888888]">{client.days_in_stage}d in stage</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-[#1A1A1A]">{client.contact_name}</p>
                        <p className="text-xs text-[#888888]">{client.contact_email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${stage?.color} text-[#1A1A1A]`}>
                          {stage?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {client.service_interests.map((service) => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-[#5A7247]">
                          ${client.monthly_value.toLocaleString()}/mo
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#888888]">{client.last_activity}</span>
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
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
