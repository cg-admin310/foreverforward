"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Wrench,
  CreditCard,
  Trash2,
  MapPin,
  Globe,
  Sparkles,
  Target,
  AlertTriangle,
  Server,
  Cloud,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  updateClient,
  updatePipelineStage,
  deleteClient,
} from "@/lib/actions/clients";
import { analyzeClientWebsite } from "@/lib/actions/website-scraper";
import { generateProposal, generateContract, getClientDocuments, type Document } from "@/lib/actions/documents";
import type { MspClient, PipelineStage } from "@/types/database";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface ClientDetailViewProps {
  client: MspClient;
  activities: Activity[];
}

const pipelineStages: { key: PipelineStage; label: string }[] = [
  { key: "new_lead", label: "New Lead" },
  { key: "discovery", label: "Discovery" },
  { key: "assessment", label: "Assessment" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "contract", label: "Contract" },
  { key: "onboarding", label: "Onboarding" },
  { key: "active", label: "Active" },
  { key: "churned", label: "Churned" },
];

const servicePackageLabels: Record<string, string> = {
  foundation: "Foundation Package",
  growth: "Growth Package (Managed IT)",
  project: "Project-Based",
  custom: "Custom",
};

type TabType = "overview" | "documents" | "billing" | "workforce" | "activity";

export function ClientDetailView({ client, activities }: ClientDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  // Document generation state
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const currentStageIndex = pipelineStages.findIndex(
    (s) => s.key === client.pipeline_stage
  );

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "documents", label: "Documents" },
    { key: "billing", label: "Billing" },
    { key: "workforce", label: "Workforce" },
    { key: "activity", label: "Activity" },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteClient(client.id);
    if (result.success) {
      router.push("/clients");
    } else {
      alert(result.error || "Failed to delete client");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleStageChange = async (newStage: PipelineStage) => {
    if (newStage === client.pipeline_stage) return;
    setIsUpdatingStage(true);
    const result = await updatePipelineStage(client.id, newStage);
    if (!result.success) {
      alert(result.error || "Failed to update pipeline stage");
    }
    setIsUpdatingStage(false);
    router.refresh();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsAddingNote(true);

    const existingNotes = client.notes || "";
    const timestamp = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const updatedNotes = existingNotes
      ? `${existingNotes}\n\n[${timestamp}] ${newNote}`
      : `[${timestamp}] ${newNote}`;

    const result = await updateClient(client.id, { notes: updatedNotes });
    if (result.success) {
      setNewNote("");
      router.refresh();
    } else {
      alert(result.error || "Failed to add note");
    }
    setIsAddingNote(false);
  };

  const handleAnalyzeWebsite = async () => {
    if (!client.website) {
      alert("Client has no website URL");
      return;
    }
    setIsAnalyzingWebsite(true);
    const result = await analyzeClientWebsite(client.id);
    if (result.success) {
      alert("Website analyzed! Check notes for insights.");
      router.refresh();
    } else {
      alert(result.error || "Failed to analyze website");
    }
    setIsAnalyzingWebsite(false);
  };

  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    setGeneratedDocument(null);
    const result = await generateProposal(client.id, {
      includeWebsiteAnalysis: !!client.website,
    });
    if (result.success && result.data) {
      setGeneratedDocument(result.data.content);
      loadDocuments();
    } else {
      alert(result.error || "Failed to generate proposal");
    }
    setIsGeneratingProposal(false);
  };

  const handleGenerateContract = async () => {
    setIsGeneratingContract(true);
    setGeneratedDocument(null);
    const result = await generateContract(client.id, {
      servicePackage: client.service_package || "growth",
      monthlyValue: client.monthly_value || 1500,
      contractTermMonths: 12,
      startDate: new Date().toISOString().split("T")[0],
      services: client.services || ["Managed IT"],
    });
    if (result.success && result.data) {
      setGeneratedDocument(result.data.content);
      loadDocuments();
    } else {
      alert(result.error || "Failed to generate contract");
    }
    setIsGeneratingContract(false);
  };

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    const result = await getClientDocuments(client.id);
    if (result.success && result.data) {
      setDocuments(result.data);
    }
    setIsLoadingDocs(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "client_created":
        return <CheckCircle className="h-4 w-4" />;
      case "pipeline_stage_change":
        return <Send className="h-4 w-4" />;
      case "client_updated":
        return <Edit className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const fullAddress = [
    client.address_line1,
    client.address_line2,
    client.city && client.state
      ? `${client.city}, ${client.state} ${client.zip_code || ""}`.trim()
      : null,
  ]
    .filter(Boolean)
    .join(", ");

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
              {client.organization_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                {client.organization_name}
              </h1>
              <p className="text-[#888888]">
                {client.organization_type
                  ? client.organization_type.charAt(0).toUpperCase() +
                    client.organization_type.slice(1).replace("_", " ")
                  : "Organization"}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {client.assessment_completed_at && (
                  <span className="px-2 py-1 bg-[#EFF4EB] text-[#5A7247] text-xs font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Assessment Complete
                  </span>
                )}
                {client.services && client.services.map((service) => (
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
            <Link href={`/clients/${client.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium mb-2">Delete this client?</p>
          <p className="text-red-600 text-sm mb-4">
            This action cannot be undone. All client data will be permanently
            removed.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Client"}
            </Button>
          </div>
        </div>
      )}

      {/* Pipeline Progress */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1A1A1A]">
            Pipeline Stage
          </span>
          <span className="text-sm text-[#888888]">
            {client.monthly_value
              ? `$${client.monthly_value.toLocaleString()}/mo potential`
              : "Value TBD"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {pipelineStages.slice(0, -1).map((stage, index) => (
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
                <h2 className="font-semibold text-[#1A1A1A] mb-4">
                  Primary Contact
                </h2>
                <div className="flex items-start gap-4 p-4 bg-[#FAFAF8] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-semibold">
                    {client.primary_contact_name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">
                      {client.primary_contact_name}
                    </p>
                    {client.primary_contact_title && (
                      <p className="text-sm text-[#888888]">
                        {client.primary_contact_title}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2">
                      <a
                        href={`mailto:${client.primary_contact_email}`}
                        className="flex items-center gap-1 text-sm text-[#555555] hover:text-[#C9A84C]"
                      >
                        <Mail className="h-4 w-4" />
                        {client.primary_contact_email}
                      </a>
                      {client.primary_contact_phone && (
                        <a
                          href={`tel:${client.primary_contact_phone}`}
                          className="flex items-center gap-1 text-sm text-[#555555] hover:text-[#C9A84C]"
                        >
                          <Phone className="h-4 w-4" />
                          {client.primary_contact_phone}
                        </a>
                      )}
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
                <h2 className="font-semibold text-[#1A1A1A] mb-4">
                  Organization Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Building2 className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">Type</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {client.organization_type
                          ? client.organization_type.charAt(0).toUpperCase() +
                            client.organization_type.slice(1).replace("_", " ")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBF6E9]">
                      <Users className="h-4 w-4 text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">User Count</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {client.user_count || "Not specified"}
                      </p>
                    </div>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <Globe className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Website</p>
                        <a
                          href={
                            client.website.startsWith("http")
                              ? client.website
                              : `https://${client.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#C9A84C] hover:underline"
                        >
                          {client.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {fullAddress && (
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="p-2 rounded-lg bg-[#FBF6E9]">
                        <MapPin className="h-4 w-4 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#888888]">Address</p>
                        <p className="text-sm text-[#1A1A1A]">{fullAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Assessment Data - shown if client completed assessment */}
              {client.assessment_completed_at && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-[#FBF6E9] to-white rounded-xl border-2 border-[#C9A84C]/30 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#C9A84C]/20">
                        <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-[#1A1A1A]">IT Assessment Data</h2>
                        <p className="text-xs text-[#888888]">
                          Completed {formatDate(client.assessment_completed_at)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#5A7247]/10 text-[#5A7247] text-xs font-semibold">
                      <CheckCircle className="inline h-3 w-3 mr-1" />
                      Assessment Complete
                    </span>
                  </div>

                  {/* Current IT Spend Comparison */}
                  {client.current_it_spend_monthly && (
                    <div className="mb-6 p-4 rounded-lg bg-white border border-[#DDDDDD]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#888888]">Their Current IT Spend</p>
                          <p className="text-2xl font-bold text-[#1A1A1A]">
                            ${client.current_it_spend_monthly.toLocaleString()}/mo
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#888888]">Our Estimate</p>
                          <p className="text-2xl font-bold text-[#5A7247]">
                            ${(client.monthly_value || 0).toLocaleString()}/mo
                          </p>
                        </div>
                        {client.current_it_spend_monthly && client.monthly_value && (
                          <div className="text-right">
                            <p className="text-xs text-[#888888]">Potential Savings</p>
                            <p className={`text-lg font-bold ${
                              client.current_it_spend_monthly > client.monthly_value
                                ? "text-[#5A7247]"
                                : "text-[#888888]"
                            }`}>
                              {client.current_it_spend_monthly > client.monthly_value ? (
                                <>
                                  <TrendingUp className="inline h-4 w-4 mr-1" />
                                  ${(client.current_it_spend_monthly - client.monthly_value).toLocaleString()}/mo
                                </>
                              ) : (
                                "Premium value"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* IT Situation Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-white border border-[#DDDDDD]">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-xs text-[#888888]">IT Support</span>
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {client.has_it_staff ? "Has internal IT" : "No internal IT"}
                      </p>
                      {client.current_it_provider && (
                        <p className="text-xs text-[#888888]">Provider: {client.current_it_provider}</p>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDDDDD]">
                      <div className="flex items-center gap-2 mb-1">
                        <Server className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-xs text-[#888888]">Infrastructure</span>
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {client.device_count || "?"} devices, {client.server_count || 0} servers
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDDDDD]">
                      <div className="flex items-center gap-2 mb-1">
                        <Cloud className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-xs text-[#888888]">Cloud Services</span>
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {client.cloud_services && client.cloud_services.length > 0
                          ? client.cloud_services.slice(0, 2).join(", ") + (client.cloud_services.length > 2 ? ` +${client.cloud_services.length - 2}` : "")
                          : "None specified"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#DDDDDD]">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-xs text-[#888888]">Timeline</span>
                      </div>
                      <p className={`text-sm font-medium ${
                        client.decision_timeline === "immediately" ? "text-[#5A7247]" :
                        client.decision_timeline === "1-2_weeks" ? "text-[#C9A84C]" : "text-[#1A1A1A]"
                      }`}>
                        {client.decision_timeline === "immediately" ? "ASAP (Hot)" :
                         client.decision_timeline === "1-2_weeks" ? "1-2 weeks" :
                         client.decision_timeline === "1_month" ? "Within month" :
                         client.decision_timeline === "3_months_plus" ? "3+ months" :
                         client.decision_timeline === "just_exploring" ? "Exploring" : "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Pain Points & Priorities */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {client.pain_points && client.pain_points.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-2">
                          Pain Points
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {client.pain_points.map((point) => (
                            <span
                              key={point}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              {point.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {client.top_priorities && client.top_priorities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-2">
                          Top Priorities
                        </p>
                        <div className="space-y-1">
                          {client.top_priorities.map((priority, idx) => (
                            <div
                              key={priority}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#5A7247] text-white text-xs flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-[#1A1A1A]">{priority}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Challenges & Outcomes */}
                  {(client.biggest_challenge || client.ideal_outcome) && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {client.biggest_challenge && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs font-semibold text-amber-800 mb-1">Biggest Challenge</p>
                          <p className="text-sm text-amber-900 italic">&ldquo;{client.biggest_challenge}&rdquo;</p>
                        </div>
                      )}
                      {client.ideal_outcome && (
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs font-semibold text-green-800 mb-1">Ideal Outcome</p>
                          <p className="text-sm text-green-900 italic">&ldquo;{client.ideal_outcome}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Services Interested & Budget */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#DDDDDD]">
                    {client.services_interested && client.services_interested.length > 0 && (
                      <div>
                        <span className="text-xs text-[#888888] mr-2">Interested in:</span>
                        {client.services_interested.map((service) => (
                          <span
                            key={service}
                            className="inline-flex mr-1 px-2 py-1 rounded-full bg-[#EFF4EB] text-[#5A7247] text-xs font-medium"
                          >
                            {service.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    {client.budget_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#888888]" />
                        <span className="text-sm text-[#555555]">
                          Budget: {
                            client.budget_range === "under_500" ? "Under $500/mo" :
                            client.budget_range === "500_1000" ? "$500-1K/mo" :
                            client.budget_range === "1000_2500" ? "$1K-2.5K/mo" :
                            client.budget_range === "2500_5000" ? "$2.5K-5K/mo" :
                            client.budget_range === "5000_plus" ? "$5K+/mo" : "TBD"
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#DDDDDD] p-6"
              >
                <h2 className="font-semibold text-[#1A1A1A] mb-4">Notes</h2>
                {client.notes ? (
                  <p className="text-sm text-[#555555] bg-[#FAFAF8] p-3 rounded-lg whitespace-pre-wrap mb-4">
                    {client.notes}
                  </p>
                ) : (
                  <p className="text-sm text-[#888888] mb-4">No notes yet</p>
                )}
                <div className="space-y-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={isAddingNote || !newNote.trim()}
                  >
                    {isAddingNote ? "Adding..." : "Add Note"}
                  </Button>
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Actions */}
              <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {client.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzeWebsite}
                      disabled={isAnalyzingWebsite}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {isAnalyzingWebsite ? "Analyzing..." : "Analyze Website"}
                    </Button>
                  )}
                  <Button
                    variant={client.assessment_completed_at ? "default" : "outline"}
                    size="sm"
                    onClick={handleGenerateProposal}
                    disabled={isGeneratingProposal}
                    className={client.assessment_completed_at ? "bg-[#5A7247] hover:bg-[#3D5030]" : ""}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGeneratingProposal ? "Generating..." : (
                      <>
                        Generate Proposal
                        {client.assessment_completed_at && (
                          <Sparkles className="h-3 w-3 ml-1.5" />
                        )}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateContract}
                    disabled={isGeneratingContract}
                  >
                    {isGeneratingContract ? "Generating..." : "Generate Contract"}
                  </Button>
                </div>
              </div>

              {/* Generated Document Preview */}
              {generatedDocument && (
                <div className="bg-white rounded-xl border border-[#DDDDDD]">
                  <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                    <h2 className="font-semibold text-[#1A1A1A]">Generated Document</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedDocument(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="p-6 prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-[#555555] bg-[#FAFAF8] p-4 rounded-lg overflow-auto max-h-[600px]">
                      {generatedDocument}
                    </pre>
                  </div>
                </div>
              )}

              {/* Documents List */}
              <div className="bg-white rounded-xl border border-[#DDDDDD]">
                <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                  <h2 className="font-semibold text-[#1A1A1A]">Documents</h2>
                  <Button variant="outline" size="sm" onClick={loadDocuments}>
                    Refresh
                  </Button>
                </div>
                {isLoadingDocs ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-[#888888]">Loading...</p>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="divide-y divide-[#DDDDDD]">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 flex items-center justify-between hover:bg-[#FAFAF8]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#FBF6E9]">
                            <FileText className="h-4 w-4 text-[#C9A84C]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1A1A1A]">
                              {doc.title}
                            </p>
                            <p className="text-xs text-[#888888]">
                              {doc.document_type} • {doc.status} • {formatDate(doc.created_at)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGeneratedDocument(doc.content)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FileText className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                    <p className="text-sm text-[#888888]">No documents yet</p>
                    <p className="text-xs text-[#888888] mt-1">
                      Generate proposals and contracts using the buttons above
                    </p>
                  </div>
                )}
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
                <h2 className="font-semibold text-[#1A1A1A] mb-4">
                  Billing Summary
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Potential MRR</p>
                    <p className="text-2xl font-bold text-[#5A7247]">
                      ${(client.monthly_value || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF8] rounded-lg">
                    <p className="text-xs text-[#888888]">Annual Value</p>
                    <p className="text-2xl font-bold text-[#1A1A1A]">
                      ${((client.monthly_value || 0) * 12).toLocaleString()}
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
                <div className="p-8 text-center">
                  <CreditCard className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                  <p className="text-sm text-[#888888]">No invoices yet</p>
                </div>
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
                <h2 className="font-semibold text-[#1A1A1A]">
                  Assigned Workforce
                </h2>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Technician
                </Button>
              </div>
              <div className="p-8 text-center">
                <Wrench className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                <p className="text-sm text-[#888888]">
                  No technicians assigned yet
                </p>
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
                <h2 className="font-semibold text-[#1A1A1A]">
                  Activity Timeline
                </h2>
              </div>
              {activities.length > 0 ? (
                <div className="divide-y divide-[#DDDDDD]">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-[#FBF6E9] text-[#C9A84C]">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div>
                        <p className="text-sm text-[#1A1A1A]">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[#888888] mt-1">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock className="h-8 w-8 text-[#DDDDDD] mx-auto mb-2" />
                  <p className="text-sm text-[#888888]">No activity yet</p>
                </div>
              )}
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
              {client.primary_contact_phone && (
                <a
                  href={`tel:${client.primary_contact_phone}`}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Contact
                </a>
              )}
              <a
                href={`mailto:${client.primary_contact_email}`}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555555] hover:bg-[#F5F3EF] transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
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
            <h3 className="font-semibold text-[#1A1A1A] mb-3">
              Move Pipeline Stage
            </h3>
            <select
              value={client.pipeline_stage}
              onChange={(e) => handleStageChange(e.target.value as PipelineStage)}
              disabled={isUpdatingStage}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {pipelineStages.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Service Package */}
          {client.service_package && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-[#DDDDDD] p-4"
            >
              <h3 className="font-semibold text-[#1A1A1A] mb-3">
                Service Package
              </h3>
              <div className="p-3 bg-[#EFF4EB] rounded-lg">
                <p className="text-sm font-medium text-[#5A7247]">
                  {servicePackageLabels[client.service_package] ||
                    client.service_package}
                </p>
              </div>
            </motion.div>
          )}

          {/* Services */}
          {client.services && client.services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl border border-[#DDDDDD] p-4"
            >
              <h3 className="font-semibold text-[#1A1A1A] mb-3">
                Service Interests
              </h3>
              <div className="space-y-2">
                {client.services.map((service) => (
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
          )}

          {/* Key Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4"
          >
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Key Dates</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888888]">Created</span>
                <span className="text-[#1A1A1A]">
                  {formatDate(client.created_at)}
                </span>
              </div>
              {client.stage_entered_at && (
                <div className="flex justify-between">
                  <span className="text-[#888888]">Stage entered</span>
                  <span className="text-[#1A1A1A]">
                    {formatDate(client.stage_entered_at)}
                  </span>
                </div>
              )}
              {client.contract_start_date && (
                <div className="flex justify-between">
                  <span className="text-[#888888]">Contract start</span>
                  <span className="text-[#1A1A1A]">
                    {formatDate(client.contract_start_date)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
