"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Server,
  Shield,
  Target,
  Clock,
  DollarSign,
  AlertCircle,
  Sparkles,
  MonitorSmartphone,
  Cloud,
  Wrench,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { submitITAssessment } from "@/lib/actions/assessments";
import type { SupportType, DecisionTimeline, BudgetRange, ComplianceRequirement, DisasterRecoveryStatus } from "@/types/database";

type FormStep = "organization" | "current-it" | "challenges" | "next-steps" | "confirmation";

interface FormData {
  // Step 1: Organization
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationType: string;
  website: string;
  userCount: string;

  // Step 2: Current IT
  hasItSupport: boolean | null;
  currentItProvider: string;
  currentItSpendMonthly: string;
  supportType: SupportType | "";
  hasItStaff: boolean | null;
  itStaffCount: string;
  deviceCount: string;
  serverCount: string;
  cloudServices: string[];

  // Step 3: Challenges
  painPoints: string[];
  topPriorities: string[];
  biggestChallenge: string;
  idealOutcome: string;

  // Step 4: Next Steps
  servicesInterested: string[];
  decisionTimeline: DecisionTimeline | "";
  budgetRange: BudgetRange | "";
  additionalNotes: string;

  // Enhanced fields
  complianceRequirements: ComplianceRequirement[];
  disasterRecoveryStatus: DisasterRecoveryStatus | "";
  currentBackupSolution: string;
  growthProjectionUsers: string;
  officeCount: string;
  remoteWorkerPercent: string;
  stakeholderConcerns: string[];
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organizationName: "",
  organizationType: "",
  website: "",
  userCount: "",
  hasItSupport: null,
  currentItProvider: "",
  currentItSpendMonthly: "",
  supportType: "",
  hasItStaff: null,
  itStaffCount: "",
  deviceCount: "",
  serverCount: "",
  cloudServices: [],
  painPoints: [],
  topPriorities: [],
  biggestChallenge: "",
  idealOutcome: "",
  servicesInterested: [],
  decisionTimeline: "",
  budgetRange: "",
  additionalNotes: "",
  // Enhanced fields
  complianceRequirements: [],
  disasterRecoveryStatus: "",
  currentBackupSolution: "",
  growthProjectionUsers: "",
  officeCount: "",
  remoteWorkerPercent: "",
  stakeholderConcerns: [],
};

const ORGANIZATION_TYPES = [
  { value: "nonprofit", label: "501(c)(3) Nonprofit" },
  { value: "school", label: "K-12 School" },
  { value: "church", label: "Church / Religious Org" },
  { value: "community_org", label: "Community Organization" },
  { value: "small_business", label: "Small Business" },
  { value: "other", label: "Other" },
];

const CLOUD_SERVICES = [
  { value: "microsoft365", label: "Microsoft 365" },
  { value: "google_workspace", label: "Google Workspace" },
  { value: "aws", label: "Amazon Web Services" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "dropbox", label: "Dropbox" },
  { value: "zoom", label: "Zoom" },
  { value: "slack", label: "Slack / Teams" },
  { value: "quickbooks", label: "QuickBooks Online" },
  { value: "salesforce", label: "Salesforce" },
  { value: "none", label: "None currently" },
];

const PAIN_POINTS = [
  { value: "slow_computers", label: "Slow or outdated computers", icon: MonitorSmartphone },
  { value: "security_concerns", label: "Security concerns", icon: Shield },
  { value: "no_it_support", label: "No reliable IT support", icon: Wrench },
  { value: "expensive_it", label: "IT costs too high", icon: DollarSign },
  { value: "network_issues", label: "Network/WiFi problems", icon: Globe },
  { value: "data_backup", label: "No data backup plan", icon: Server },
  { value: "software_outdated", label: "Outdated software", icon: Cloud },
  { value: "compliance", label: "Compliance requirements", icon: AlertCircle },
];

const PRIORITY_OPTIONS = [
  "Improve security & protect data",
  "Reduce IT costs",
  "Get reliable IT support",
  "Upgrade computers & equipment",
  "Move to cloud services",
  "Better WiFi & network",
  "Staff training",
  "Compliance & audits",
];

const SERVICES_OFFERED = [
  { value: "managed_it", label: "Managed IT Support", desc: "Ongoing tech support & maintenance" },
  { value: "security", label: "Cybersecurity", desc: "Protect your organization from threats" },
  { value: "cloud", label: "Cloud Services", desc: "Microsoft 365, Google Workspace setup" },
  { value: "hardware", label: "Hardware Refresh", desc: "New computers & equipment" },
  { value: "network", label: "Network & WiFi", desc: "Infrastructure improvements" },
  { value: "cabling", label: "Low-Voltage Cabling", desc: "Structured cabling installation" },
  { value: "cctv", label: "Security Cameras", desc: "CCTV installation & monitoring" },
  { value: "software", label: "Software & AI", desc: "Custom development solutions" },
];

const TIMELINE_OPTIONS: { value: DecisionTimeline; label: string }[] = [
  { value: "immediately", label: "As soon as possible" },
  { value: "1-2_weeks", label: "Within 1-2 weeks" },
  { value: "1_month", label: "Within a month" },
  { value: "3_months_plus", label: "3+ months out" },
  { value: "just_exploring", label: "Just exploring options" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under_500", label: "Under $500/month" },
  { value: "500_1000", label: "$500 - $1,000/month" },
  { value: "1000_2500", label: "$1,000 - $2,500/month" },
  { value: "2500_5000", label: "$2,500 - $5,000/month" },
  { value: "5000_plus", label: "$5,000+/month" },
  { value: "not_sure", label: "Not sure yet" },
];

const COMPLIANCE_OPTIONS: { value: ComplianceRequirement; label: string; desc: string }[] = [
  { value: "hipaa", label: "HIPAA", desc: "Healthcare data protection" },
  { value: "ferpa", label: "FERPA", desc: "Student education records" },
  { value: "pci_dss", label: "PCI-DSS", desc: "Payment card data" },
  { value: "soc2", label: "SOC 2", desc: "Security & availability" },
  { value: "none", label: "None / Not Sure", desc: "No specific requirements" },
];

const DISASTER_RECOVERY_OPTIONS: { value: DisasterRecoveryStatus; label: string }[] = [
  { value: "has_plan", label: "Yes, we have a disaster recovery plan" },
  { value: "partial", label: "Partial - some backups but no formal plan" },
  { value: "no_plan", label: "No disaster recovery plan" },
];

const STAKEHOLDER_CONCERNS = [
  "Budget constraints",
  "Change resistance from staff",
  "Vendor lock-in concerns",
  "Data migration worries",
  "Downtime during transition",
  "Staff training needs",
  "Board approval required",
];

const steps: { key: FormStep; label: string; num: number }[] = [
  { key: "organization", label: "Your Organization", num: 1 },
  { key: "current-it", label: "Current IT", num: 2 },
  { key: "challenges", label: "Challenges", num: 3 },
  { key: "next-steps", label: "Next Steps", num: 4 },
];

export default function FreeAssessmentPage() {
  const [step, setStep] = useState<FormStep>("organization");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitITAssessment({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        website: formData.website || undefined,
        userCount: parseInt(formData.userCount) || 1,
        hasItSupport: formData.hasItSupport ?? false,
        currentItProvider: formData.currentItProvider || undefined,
        currentItSpendMonthly: parseFloat(formData.currentItSpendMonthly) || undefined,
        supportType: formData.supportType || undefined,
        hasItStaff: formData.hasItStaff ?? false,
        itStaffCount: parseInt(formData.itStaffCount) || undefined,
        deviceCount: parseInt(formData.deviceCount) || undefined,
        serverCount: parseInt(formData.serverCount) || undefined,
        cloudServices: formData.cloudServices,
        painPoints: formData.painPoints,
        topPriorities: formData.topPriorities,
        biggestChallenge: formData.biggestChallenge || undefined,
        idealOutcome: formData.idealOutcome || undefined,
        servicesInterested: formData.servicesInterested,
        decisionTimeline: formData.decisionTimeline as DecisionTimeline,
        budgetRange: formData.budgetRange as BudgetRange,
        additionalNotes: formData.additionalNotes || undefined,
        // Enhanced fields
        complianceRequirements: formData.complianceRequirements,
        disasterRecoveryStatus: (formData.disasterRecoveryStatus || "no_plan") as DisasterRecoveryStatus,
        currentBackupSolution: formData.currentBackupSolution || undefined,
        growthProjectionUsers: parseInt(formData.growthProjectionUsers) || undefined,
        officeCount: parseInt(formData.officeCount) || undefined,
        remoteWorkerPercent: parseInt(formData.remoteWorkerPercent) || undefined,
        stakeholderConcerns: formData.stakeholderConcerns.length > 0 ? formData.stakeholderConcerns : undefined,
      });

      if (result.success && result.data) {
        setClientId(result.data.clientId);
        setStep("confirmation");
      } else {
        console.error("Failed to submit assessment:", result.error);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "cloudServices" | "painPoints" | "servicesInterested" | "complianceRequirements" | "stakeholderConcerns", value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const togglePriority = (value: string) => {
    setFormData((prev) => {
      const current = prev.topPriorities;
      if (current.includes(value)) {
        return { ...prev, topPriorities: current.filter((v) => v !== value) };
      } else if (current.length < 3) {
        return { ...prev, topPriorities: [...current, value] };
      }
      return prev;
    });
  };

  const canProceedStep1 =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.organizationName &&
    formData.organizationType &&
    formData.userCount;

  const canProceedStep2 = formData.hasItSupport !== null;
  const canProceedStep3 = formData.topPriorities.length > 0;
  const canSubmit = formData.decisionTimeline && formData.budgetRange;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].key);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].key);
    }
  };

  const isStepComplete = (stepKey: FormStep): boolean => {
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    return stepIndex < currentStepIndex || step === "confirmation";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A] to-[#2D2D2D]" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
              Free • No Obligation • 5 Minutes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Free IT Assessment for{" "}
              <span className="text-[#C9A84C]">Nonprofits & Schools</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Tell us about your organization and technology needs. We&apos;ll provide
              personalized recommendations and a custom quote—no strings attached.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#5A7247] to-[#C9A84C]" />
      </section>

      {/* Progress Steps */}
      {step !== "confirmation" && (
        <section className="py-6 bg-white border-b border-[#DDDDDD] sticky top-0 z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.key} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                        step === s.key
                          ? "bg-[#C9A84C] text-[#1A1A1A] ring-4 ring-[#C9A84C]/20"
                          : isStepComplete(s.key)
                          ? "bg-[#5A7247] text-white"
                          : "bg-[#DDDDDD] text-[#888888]"
                      }`}
                    >
                      {isStepComplete(s.key) ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        s.num
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm hidden md:inline ${
                        step === s.key
                          ? "text-[#1A1A1A] font-medium"
                          : "text-[#888888]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isStepComplete(steps[index + 1].key) || step === steps[index + 1].key
                        ? "bg-[#5A7247]"
                        : "bg-[#DDDDDD]"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form Content */}
      <section className="py-12 lg:py-16 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Organization */}
            {step === "organization" && (
              <motion.div
                key="organization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionHeading
                  title="About Your Organization"
                  subtitle="Let's start with some basic information about you and your organization."
                  centered
                />

                <form className="mt-10 space-y-6">
                  {/* Contact Info */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <User className="h-5 w-5 text-[#C9A84C]" />
                      Your Contact Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="john@example.org"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder="(555) 123-4567"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organization Info */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Building2 className="h-5 w-5 text-[#C9A84C]" />
                      Organization Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Organization Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.organizationName}
                          onChange={(e) => updateField("organizationName", e.target.value)}
                          placeholder="Community Hope Center"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Organization Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.organizationType}
                          onChange={(e) => updateField("organizationType", e.target.value)}
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                          required
                        >
                          <option value="">Select type...</option>
                          {ORGANIZATION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            Website
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                            <Input
                              type="url"
                              value={formData.website}
                              onChange={(e) => updateField("website", e.target.value)}
                              placeholder="https://example.org"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            Number of Staff/Users <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                            <Input
                              type="number"
                              min="1"
                              value={formData.userCount}
                              onChange={(e) => updateField("userCount", e.target.value)}
                              placeholder="25"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={goNext} disabled={!canProceedStep1} size="lg">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Current IT */}
            {step === "current-it" && (
              <motion.div
                key="current-it"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionHeading
                  title="Your Current IT Setup"
                  subtitle="Help us understand your current technology situation."
                  centered
                />

                <form className="mt-10 space-y-6">
                  {/* Current Support */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Wrench className="h-5 w-5 text-[#C9A84C]" />
                      Current IT Support
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                          Do you currently have IT support? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: true, label: "Yes, we have IT support" },
                            { value: false, label: "No, we don't have IT support" },
                          ].map((option) => (
                            <button
                              key={String(option.value)}
                              type="button"
                              onClick={() => updateField("hasItSupport", option.value)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                formData.hasItSupport === option.value
                                  ? "border-[#C9A84C] bg-[#FBF6E9]"
                                  : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                              }`}
                            >
                              <span className="text-sm font-medium text-[#1A1A1A]">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.hasItSupport && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4 pt-4 border-t border-[#DDDDDD]"
                        >
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              Current IT Provider
                            </label>
                            <Input
                              value={formData.currentItProvider}
                              onChange={(e) => updateField("currentItProvider", e.target.value)}
                              placeholder="Company name or 'in-house'"
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                Monthly IT Spend (approx.)
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
                                <Input
                                  type="number"
                                  value={formData.currentItSpendMonthly}
                                  onChange={(e) => updateField("currentItSpendMonthly", e.target.value)}
                                  placeholder="1500"
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                Type of Support
                              </label>
                              <select
                                value={formData.supportType}
                                onChange={(e) => updateField("supportType", e.target.value as SupportType)}
                                className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                              >
                                <option value="">Select...</option>
                                <option value="ongoing">Ongoing / Monthly</option>
                                <option value="project">Project-Based</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="pt-4 border-t border-[#DDDDDD]">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                          Do you have internal IT staff?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: true, label: "Yes" },
                            { value: false, label: "No" },
                          ].map((option) => (
                            <button
                              key={String(option.value)}
                              type="button"
                              onClick={() => updateField("hasItStaff", option.value)}
                              className={`p-3 rounded-lg border-2 text-center transition-all ${
                                formData.hasItStaff === option.value
                                  ? "border-[#C9A84C] bg-[#FBF6E9]"
                                  : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                              }`}
                            >
                              <span className="text-sm font-medium text-[#1A1A1A]">{option.label}</span>
                            </button>
                          ))}
                        </div>
                        {formData.hasItStaff && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                              How many IT staff?
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={formData.itStaffCount}
                              onChange={(e) => updateField("itStaffCount", e.target.value)}
                              placeholder="2"
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technology Inventory */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Server className="h-5 w-5 text-[#C9A84C]" />
                      Technology Inventory
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Number of Computers/Devices
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.deviceCount}
                          onChange={(e) => updateField("deviceCount", e.target.value)}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Number of Servers
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.serverCount}
                          onChange={(e) => updateField("serverCount", e.target.value)}
                          placeholder="2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                        Cloud Services You Use (select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CLOUD_SERVICES.map((service) => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => toggleArrayItem("cloudServices", service.value)}
                            className={`p-2.5 rounded-lg border text-sm text-left transition-all ${
                              formData.cloudServices.includes(service.value)
                                ? "border-[#C9A84C] bg-[#FBF6E9] text-[#1A1A1A]"
                                : "border-[#DDDDDD] bg-white text-[#555555] hover:border-[#C9A84C]/50"
                            }`}
                          >
                            {formData.cloudServices.includes(service.value) && (
                              <CheckCircle2 className="inline-block h-3.5 w-3.5 mr-1.5 text-[#C9A84C]" />
                            )}
                            {service.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Infrastructure & Growth */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Building2 className="h-5 w-5 text-[#C9A84C]" />
                      Infrastructure & Growth
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Office Locations
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.officeCount}
                          onChange={(e) => updateField("officeCount", e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          % Remote Workers
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.remoteWorkerPercent}
                          onChange={(e) => updateField("remoteWorkerPercent", e.target.value)}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Expected User Growth (12 mo)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.growthProjectionUsers}
                          onChange={(e) => updateField("growthProjectionUsers", e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                        Compliance Requirements
                      </label>
                      <p className="text-xs text-[#888888] mb-3">
                        Select any compliance standards you need to meet:
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {COMPLIANCE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleArrayItem("complianceRequirements", option.value)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.complianceRequirements.includes(option.value)
                                ? "border-[#C9A84C] bg-[#FBF6E9]"
                                : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-[#1A1A1A]">{option.label}</span>
                            <span className="text-xs text-[#888888]">{option.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Backup & Disaster Recovery */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Shield className="h-5 w-5 text-[#C9A84C]" />
                      Backup & Disaster Recovery
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                          Current Disaster Recovery Status
                        </label>
                        <div className="space-y-2">
                          {DISASTER_RECOVERY_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField("disasterRecoveryStatus", option.value)}
                              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                formData.disasterRecoveryStatus === option.value
                                  ? "border-[#C9A84C] bg-[#FBF6E9]"
                                  : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                              }`}
                            >
                              <span className="text-sm font-medium text-[#1A1A1A]">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          Current Backup Solution (if any)
                        </label>
                        <Input
                          value={formData.currentBackupSolution}
                          onChange={(e) => updateField("currentBackupSolution", e.target.value)}
                          placeholder="e.g., External drives, cloud backup service, etc."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={goBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={goNext} disabled={!canProceedStep2} size="lg">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Challenges */}
            {step === "challenges" && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionHeading
                  title="Challenges & Priorities"
                  subtitle="What's keeping you up at night? What would make the biggest difference?"
                  centered
                />

                <form className="mt-10 space-y-6">
                  {/* Pain Points */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
                      Current Pain Points
                    </h3>
                    <p className="text-sm text-[#555555] mb-4">
                      Select any challenges your organization is facing:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {PAIN_POINTS.map((point) => {
                        const Icon = point.icon;
                        return (
                          <button
                            key={point.value}
                            type="button"
                            onClick={() => toggleArrayItem("painPoints", point.value)}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                              formData.painPoints.includes(point.value)
                                ? "border-[#C9A84C] bg-[#FBF6E9]"
                                : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                            }`}
                          >
                            <Icon className={`h-5 w-5 flex-shrink-0 ${
                              formData.painPoints.includes(point.value)
                                ? "text-[#C9A84C]"
                                : "text-[#888888]"
                            }`} />
                            <span className="text-sm font-medium text-[#1A1A1A]">{point.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Priorities */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-2">
                      <Target className="h-5 w-5 text-[#C9A84C]" />
                      Top Priorities <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-[#555555] mb-4">
                      Select up to 3 priorities (in order of importance):
                    </p>
                    <div className="space-y-2">
                      {PRIORITY_OPTIONS.map((priority) => {
                        const index = formData.topPriorities.indexOf(priority);
                        const isSelected = index !== -1;
                        return (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => togglePriority(priority)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? "border-[#5A7247] bg-[#EFF4EB]"
                                : formData.topPriorities.length >= 3
                                ? "border-[#DDDDDD] bg-[#FAFAF8] opacity-50 cursor-not-allowed"
                                : "border-[#DDDDDD] bg-white hover:border-[#5A7247]/50"
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5A7247] text-white text-xs font-bold">
                                {index + 1}
                              </span>
                            ) : (
                              <span className="w-6 h-6 rounded-full border-2 border-[#DDDDDD]" />
                            )}
                            <span className="text-sm font-medium text-[#1A1A1A]">{priority}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open-ended */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <MessageSquare className="h-5 w-5 text-[#C9A84C]" />
                      Tell Us More
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          What's your biggest IT challenge right now?
                        </label>
                        <textarea
                          value={formData.biggestChallenge}
                          onChange={(e) => updateField("biggestChallenge", e.target.value)}
                          rows={3}
                          placeholder="Tell us about the technology problems keeping you up at night..."
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                          What would ideal IT support look like for you?
                        </label>
                        <textarea
                          value={formData.idealOutcome}
                          onChange={(e) => updateField("idealOutcome", e.target.value)}
                          rows={3}
                          placeholder="If we could wave a magic wand and fix your IT situation, what would that look like?"
                          className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={goBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={goNext} disabled={!canProceedStep3} size="lg">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Next Steps */}
            {step === "next-steps" && (
              <motion.div
                key="next-steps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SectionHeading
                  title="Almost There!"
                  subtitle="A few more details to help us give you accurate recommendations."
                  centered
                />

                <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                  {/* Services Interested */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                      Services You're Interested In
                    </h3>
                    <p className="text-sm text-[#555555] mb-4">
                      Select all that apply:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {SERVICES_OFFERED.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => toggleArrayItem("servicesInterested", service.value)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.servicesInterested.includes(service.value)
                              ? "border-[#C9A84C] bg-[#FBF6E9]"
                              : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                              formData.servicesInterested.includes(service.value)
                                ? "border-[#C9A84C] bg-[#C9A84C]"
                                : "border-[#DDDDDD]"
                            }`}>
                              {formData.servicesInterested.includes(service.value) && (
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div>
                              <span className="block text-sm font-semibold text-[#1A1A1A]">{service.label}</span>
                              <span className="text-xs text-[#888888]">{service.desc}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline & Budget */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-6">
                      <Calendar className="h-5 w-5 text-[#C9A84C]" />
                      Timeline & Budget
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                          When do you need to make a decision? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TIMELINE_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField("decisionTimeline", option.value)}
                              className={`p-3 rounded-lg border-2 text-sm text-center transition-all ${
                                formData.decisionTimeline === option.value
                                  ? "border-[#C9A84C] bg-[#FBF6E9] font-medium"
                                  : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                          Monthly IT budget range? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {BUDGET_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField("budgetRange", option.value)}
                              className={`p-3 rounded-lg border-2 text-sm text-center transition-all ${
                                formData.budgetRange === option.value
                                  ? "border-[#C9A84C] bg-[#FBF6E9] font-medium"
                                  : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stakeholder Concerns */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-4">
                      <AlertCircle className="h-5 w-5 text-[#C9A84C]" />
                      Stakeholder Concerns
                    </h3>
                    <p className="text-sm text-[#555555] mb-4">
                      Are there any concerns we should be aware of? (select all that apply)
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {STAKEHOLDER_CONCERNS.map((concern) => (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleArrayItem("stakeholderConcerns", concern)}
                          className={`p-3 rounded-lg border-2 text-left text-sm transition-all ${
                            formData.stakeholderConcerns.includes(concern)
                              ? "border-[#C9A84C] bg-[#FBF6E9] font-medium"
                              : "border-[#DDDDDD] bg-white hover:border-[#C9A84C]/50"
                          }`}
                        >
                          {formData.stakeholderConcerns.includes(concern) && (
                            <CheckCircle2 className="inline-block h-3.5 w-3.5 mr-1.5 text-[#C9A84C]" />
                          )}
                          {concern}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] mb-4">
                      <MessageSquare className="h-5 w-5 text-[#C9A84C]" />
                      Anything Else?
                    </h3>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => updateField("additionalNotes", e.target.value)}
                      rows={3}
                      placeholder="Any additional information you'd like us to know..."
                      className="w-full rounded-lg border border-[#DDDDDD] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button type="button" variant="outline" onClick={goBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" size="lg" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Assessment"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#EFF4EB] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-[#5A7247]" />
                </div>

                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
                  Assessment Complete!
                </h2>

                <p className="text-[#555555] text-lg max-w-lg mx-auto mb-8">
                  Thank you for taking the time to complete our IT assessment.
                  We&apos;re already analyzing your responses to prepare personalized recommendations.
                </p>

                <div className="bg-white rounded-xl p-6 border border-[#DDDDDD] text-left max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#C9A84C]" />
                    What Happens Next?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "You'll receive a confirmation email shortly",
                      "Our team reviews your assessment (within 1 business day)",
                      "We'll reach out with personalized recommendations",
                      "If interested, we'll schedule a free consultation call",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-[#555555]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C9A84C] text-white text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild>
                    <Link href="/services">Explore Our Services</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Return Home</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trust Indicators */}
      {step !== "confirmation" && (
        <section className="py-10 bg-white border-t border-[#DDDDDD]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, label: "100% Free", desc: "No obligation" },
                { icon: Clock, label: "5 Minutes", desc: "Quick & easy" },
                { icon: Target, label: "Tailored", desc: "Custom recommendations" },
                { icon: Users, label: "Nonprofit Focus", desc: "We get your mission" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FBF6E9] flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <span className="font-semibold text-[#1A1A1A]">{item.label}</span>
                  <span className="text-xs text-[#888888]">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      {step !== "confirmation" && (
        <section className="py-8 bg-[#FBF6E9]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#555555]">
              Have questions?{" "}
              <Link
                href="/contact"
                className="text-[#C9A84C] font-semibold hover:underline"
              >
                Contact us
              </Link>{" "}
              or call{" "}
              <a
                href="tel:+19518775196"
                className="text-[#C9A84C] font-semibold hover:underline"
              >
                (951) 877-5196
              </a>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
