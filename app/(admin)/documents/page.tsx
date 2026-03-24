"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  Download,
  Eye,
  Send,
  Bot,
  ChevronLeft,
  ChevronRight,
  Filter,
  File,
  FileCheck,
  FilePen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DocumentType = "proposal" | "contract" | "assessment" | "certificate" | "qbr" | "invoice";
type DocumentStatus = "draft" | "sent" | "signed" | "completed";

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  related_to: string;
  related_type: "client" | "participant";
  created_at: string;
  sent_at: string | null;
  created_by: string;
}

const sampleDocuments: Document[] = [
  {
    id: "1",
    title: "Managed IT Proposal - Hope Community Center",
    type: "proposal",
    status: "sent",
    related_to: "Hope Community Center",
    related_type: "client",
    created_at: "2026-03-18",
    sent_at: "2026-03-18",
    created_by: "TJ Wilform",
  },
  {
    id: "2",
    title: "IT Assessment Report - Hope Community Center",
    type: "assessment",
    status: "completed",
    related_to: "Hope Community Center",
    related_type: "client",
    created_at: "2026-03-15",
    sent_at: "2026-03-15",
    created_by: "TJ Wilform",
  },
  {
    id: "3",
    title: "Service Agreement - LA Youth Services",
    type: "contract",
    status: "signed",
    related_to: "LA Youth Services",
    related_type: "client",
    created_at: "2026-01-10",
    sent_at: "2026-01-10",
    created_by: "TJ Wilform",
  },
  {
    id: "4",
    title: "Father Forward Completion Certificate - Marcus Johnson",
    type: "certificate",
    status: "draft",
    related_to: "Marcus Johnson",
    related_type: "participant",
    created_at: "2026-03-22",
    sent_at: null,
    created_by: "TJ Wilform",
  },
  {
    id: "5",
    title: "Q1 2026 QBR - Watts Community Center",
    type: "qbr",
    status: "sent",
    related_to: "Watts Community Center",
    related_type: "client",
    created_at: "2026-03-20",
    sent_at: "2026-03-20",
    created_by: "TJ Wilform",
  },
];

const documentTypes = [
  { value: "all", label: "All Types" },
  { value: "proposal", label: "Proposals" },
  { value: "contract", label: "Contracts" },
  { value: "assessment", label: "Assessments" },
  { value: "certificate", label: "Certificates" },
  { value: "qbr", label: "QBR Reports" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "signed", label: "Signed" },
  { value: "completed", label: "Completed" },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const filteredDocuments = sampleDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.related_to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case "proposal":
        return FilePen;
      case "contract":
        return FileCheck;
      case "certificate":
        return Award;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case "proposal":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "contract":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "assessment":
        return "bg-blue-50 text-blue-600";
      case "certificate":
        return "bg-purple-50 text-purple-600";
      case "qbr":
        return "bg-orange-50 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "signed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-[#EFF4EB] text-[#5A7247]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Documents</h1>
          <p className="text-[#555555]">
            Generate and manage AI-powered documents
          </p>
        </div>
        <Button onClick={() => setShowGenerateModal(true)}>
          <Bot className="h-4 w-4 mr-2" />
          Generate Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Documents", value: sampleDocuments.length, color: "text-[#1A1A1A]" },
          { label: "Drafts", value: sampleDocuments.filter((d) => d.status === "draft").length, color: "text-gray-600" },
          { label: "Sent", value: sampleDocuments.filter((d) => d.status === "sent").length, color: "text-blue-600" },
          { label: "Signed", value: sampleDocuments.filter((d) => d.status === "signed").length, color: "text-green-600" },
          { label: "This Month", value: 4, color: "text-[#C9A84C]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-[#DDDDDD]">
            <p className="text-sm text-[#888888]">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "New Proposal", icon: FilePen, color: "bg-[#FBF6E9] text-[#C9A84C]" },
          { label: "New Contract", icon: FileCheck, color: "bg-[#EFF4EB] text-[#5A7247]" },
          { label: "New Assessment", icon: FileText, color: "bg-blue-50 text-blue-600" },
          { label: "New Certificate", icon: Award, color: "bg-purple-50 text-purple-600" },
        ].map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-md transition-all"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-[#1A1A1A]">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Document
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Related To
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Created
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => {
                const TypeIcon = getTypeIcon(doc.type);
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#1A1A1A] max-w-xs truncate">
                            {doc.title}
                          </p>
                          <p className="text-xs text-[#888888]">by {doc.created_by}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#555555]">{doc.related_to}</p>
                      <p className="text-xs text-[#888888] capitalize">{doc.related_type}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#888888]">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Preview">
                          <Eye className="h-4 w-4 text-[#888888]" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Download">
                          <Download className="h-4 w-4 text-[#888888]" />
                        </button>
                        {doc.status === "draft" && (
                          <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors" title="Send">
                            <Send className="h-4 w-4 text-[#888888]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-between">
          <p className="text-sm text-[#888888]">
            Showing {filteredDocuments.length} of {sampleDocuments.length} documents
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 bg-[#C9A84C] text-[#1A1A1A] rounded text-sm font-medium">
              1
            </span>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Bot className="h-6 w-6 text-[#C9A84C]" />
              <h2 className="text-xl font-bold text-[#1A1A1A]">Generate Document</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Document Type
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option>Select type...</option>
                  <option value="proposal">Proposal</option>
                  <option value="contract">Contract</option>
                  <option value="assessment">Assessment Report</option>
                  <option value="certificate">Certificate</option>
                  <option value="qbr">QBR Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Related To
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                  <option>Select client or participant...</option>
                  <option value="client-1">Hope Community Center (Client)</option>
                  <option value="client-2">LA Youth Services (Client)</option>
                  <option value="participant-1">Marcus Johnson (Participant)</option>
                </select>
              </div>

              <div className="p-4 bg-[#FBF6E9] rounded-lg">
                <div className="flex items-start gap-2">
                  <Bot className="h-5 w-5 text-[#C9A84C] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">AI-Powered Generation</p>
                    <p className="text-xs text-[#555555] mt-1">
                      Claude will generate a customized document based on the selected type and CRM data. You can review and edit before saving.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1">
                <Bot className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
