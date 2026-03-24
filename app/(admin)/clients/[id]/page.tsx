"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  FileText,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Send,
  Bot,
  Wrench,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleClient = {
  id: "1",
  organization: "Hope Community Center",
  website: "www.hopecenter.org",
  address: "1234 Hope Street, Los Angeles, CA 90001",
  industry: "Nonprofit",
  size: "25-50 employees",
  contact_name: "Sarah Chen",
  contact_title: "Executive Director",
  contact_email: "schen@hopecenter.org",
  contact_phone: "(310) 555-0456",
  pipeline_stage: "proposal",
  service_interests: ["Managed IT", "Software & AI"],
  monthly_value: 2500,
  contract_start: null,
  contract_end: null,
  assigned_to: "TJ Wilform",
  notes: "Strong interest in managed IT for their 3 locations. Also interested in custom software for volunteer management.",
  created_at: "2026-03-10T10:00:00Z",
};

const pipelineStages = [
  { key: "new_lead", label: "New Lead" },
  { key: "discovery", label: "Discovery" },
  { key: "assessment", label: "Assessment" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "contract", label: "Contract" },
  { key: "onboarding", label: "Onboarding" },
  { key: "active", label: "Active" },
];

const documents = [
  { id: 1, name: "IT Assessment Report", type: "assessment", date: "Mar 15, 2026", status: "completed" },
  { id: 2, name: "Managed IT Proposal", type: "proposal", date: "Mar 18, 2026", status: "sent" },
];

const activities = [
  { id: 1, message: "Proposal sent for Managed IT services", time: "Mar 18, 2026", type: "document" },
  { id: 2, message: "Site assessment completed at main location", time: "Mar 15, 2026", type: "assessment" },
  { id: 3, message: "Discovery call - discussed pain points", time: "Mar 12, 2026", type: "call" },
  { id: 4, message: "Lead created from website inquiry", time: "Mar 10, 2026", type: "created" },
];

const invoices = [
  { id: 1, number: "INV-2026-001", amount: 2500, status: "draft", due_date: "Apr 1, 2026" },
];

type TabType = "overview" | "documents" | "billing" | "workforce" | "activity";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const currentStageIndex = pipelineStages.findIndex((s) => s.key === sampleClient.pipeline_stage);

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "documents", label: "Documents" },
    { key: "billing", label: "Billing" },
    { key: "workforce", label: "Workforce" },
    { key: "activity", label: "Activity" },
  ];

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

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#EFF4EB] flex items-center justify-center text-[#5A7247] font-bold text-2xl">
              {sampleClient.organization.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {sampleClient.organization}
              </h1>
              <p className="text-[#888888]">{sampleClient.industry}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {sampleClient.service_interests.map((service) => (
                  <span
                    key={service}
                    className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-medium rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1A1A1A]">Pipeline Stage</span>
          <span className="text-sm text-[#888888]">
            ${sampleClient.monthly_value.toLocaleString()}/mo potential
          </span>
        </div>
        <div className="flex items-center gap-1">
          {pipelineStages.map((stage, index) => (
            <div key={stage.key} className="flex-1 relative">
              <div
                className={`h-2 rounded-full ${
                  index <= currentStageIndex
                    ? "bg-gradient-to-r from-[#C9A84C] to-[#5A7247]"
                    : "bg-[#DDDDDD]"
                }`}
              />
              {index === currentStageIndex && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded whitespace-nowrap">
                  {stage.label}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#888888]">
          <span>New Lead</span>
          <span>Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#DDDDDD]">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-[#C9A84C] text-[#C9A84C]"
                  : "border-transparent text-[#888888] hover:text-[#555555]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Primary Contact</h2>
                <div className="flex items-start gap-4 p-4 bg-[#FAFAF8] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                    {sampleClient.contact_name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">{sampleClient.contact_name}</p>
                    <p className="text-sm text-[#888888]">{sampleClient.contact_title}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <a
                        href={`mailto:${sampleClient.contact_email}`}
                        className="flex items-center gap-1 text-sm text-[#555555] hover:text-[#C9A84C]"
                      >
                        <Mail className="h-4 w-4" />
                        {sampleClient.contact_email}
                      </a>
                      <a
                        href={`tel:${sampleClient.contact_phone}`}
                        className="flex items-center gap-1 text-sm text-[#555555] hover:text-[#C9A84C]"
                      >
                        <Phone className="h-4 w-4" />
                        {sampleClient.contact_phone}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Organization Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Organization Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Building2 className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Industry</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleClient.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Users className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Size</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleClient.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Building2 className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Address</p>
                      <p className="text-sm text-[#1A1A1A]">{sampleClient.address}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Notes</h2>
                <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg">
                  {sampleClient.notes}
                </p>
              </motion.div>
            </>
          )}

          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A]">Documents</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Proposal
                  </Button>
                  <Button variant="outline" size="sm">
                    Generate Contract
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <FileText className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A]">{doc.name}</p>
                        <p className="text-xs text-[#888888]">{doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          doc.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Billing Summary */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Billing Summary</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Potential MRR</p>
                    <p className="text-2xl font-bold text-[#5A7247]">
                      ${sampleClient.monthly_value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Annual Value</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">
                      ${(sampleClient.monthly_value * 12).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Outstanding</p>
                    <p className="text-2xl font-bold text-[#C9A84C]">$0</p>
                  </div>
                </div>
              </div>

              {/* Invoices */}
              <div className="bg-white rounded-xl border border-[#DDDDDD]">
                <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                  <h2 className="font-semibold text-[#1A1A1A]">Invoices</h2>
                  <Button size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
                {invoices.length > 0 ? (
                  <div className="divide-y divide-[#DDDDDD]">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#FBF6E9]">
                            <DollarSign className="h-4 w-4 text-[#C9A84C]" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{invoice.number}</p>
                            <p className="text-xs text-[#888888]">Due: {invoice.due_date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#1A1A1A]">
                            ${invoice.amount.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <CreditCard className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                    <p className="text-sm text-[#888888]">No invoices yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "workforce" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A]">Assigned Workforce</h2>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Technician
                </Button>
              </div>
              <div className="p-8 text-center">
                <Wrench className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                <p className="text-sm text-[#888888]">No technicians assigned yet</p>
                <p className="text-xs text-[#888888] mt-1">
                  Assign workforce pool members once the contract is signed
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#DDDDDD]"
            >
              <div className="p-4 border-b border-[#DDDDDD]">
                <h2 className="font-semibold text-[#1A1A1A]">Activity Timeline</h2>
              </div>
              <div className="divide-y divide-[#DDDDDD]">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9] text-[#C9A84C]">
                      {activity.type === "document" ? (
                        <FileText className="h-4 w-4" />
                      ) : activity.type === "call" ? (
                        <Phone className="h-4 w-4" />
                      ) : activity.type === "assessment" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-[#1A1A1A]">{activity.message}</p>
                      <p className="text-xs text-[#888888] mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Phone className="h-4 w-4" />
                Call Contact
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors">
                <FileText className="h-4 w-4" />
                Generate Proposal
              </button>
            </div>
          </motion.div>

          {/* Pipeline Stage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Move Pipeline Stage</h3>
            <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
              {pipelineStages.map((stage) => (
                <option
                  key={stage.key}
                  value={stage.key}
                  selected={stage.key === sampleClient.pipeline_stage}
                >
                  {stage.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Sales Owner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Sales Owner</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                TW
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{sampleClient.assigned_to}</p>
                <p className="text-xs text-[#888888]">Sales Lead</p>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Service Interests</h3>
            <div className="space-y-2">
              {sampleClient.service_interests.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 p-2 bg-[#FBF6E9] rounded-lg"
                >
                  <Wrench className="h-4 w-4 text-[#C9A84C]" />
                  <span className="text-sm text-[#1A1A1A]">{service}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
