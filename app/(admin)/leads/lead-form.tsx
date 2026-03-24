"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLead, updateLead } from "@/lib/actions/leads";
import type { Lead, LeadType, ProgramType } from "@/types/database";

interface LeadFormProps {
  lead?: Lead;
  mode?: "create" | "edit";
}

const leadTypes: { value: LeadType; label: string }[] = [
  { value: "program", label: "Program Interest" },
  { value: "msp", label: "IT Services (MSP)" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partner", label: "Partner" },
  { value: "donation", label: "Donation" },
  { value: "general", label: "General Inquiry" },
];

const programs: { value: ProgramType; label: string }[] = [
  { value: "father_forward", label: "Father Forward" },
  { value: "tech_ready_youth", label: "Tech-Ready Youth" },
  { value: "making_moments", label: "Making Moments" },
  { value: "from_script_to_screen", label: "From Script to Screen" },
  { value: "stories_from_my_future", label: "Stories from My Future" },
  { value: "lula", label: "LULA" },
];

const services = [
  "Managed IT",
  "Software & AI Development",
  "Low Voltage Installation",
  "Network Infrastructure",
  "Cybersecurity",
  "Cloud Solutions",
  "Help Desk Support",
];

const sources = [
  "Website",
  "Referral",
  "Social Media",
  "Event",
  "Partner",
  "Cold Call",
  "Email Campaign",
  "Other",
];

export function LeadForm({ lead, mode = "create" }: LeadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization: string;
    title: string;
    leadType: LeadType;
    programInterest: ProgramType | "";
    serviceInterests: string[];
    source: string;
    notes: string;
  }>({
    firstName: lead?.first_name || "",
    lastName: lead?.last_name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    organization: lead?.organization || "",
    title: lead?.title || "",
    leadType: (lead?.lead_type as LeadType) || "program",
    programInterest: (lead?.program_interest as ProgramType) || "",
    serviceInterests: (lead?.service_interests as string[]) || [],
    source: lead?.source || "Website",
    notes: lead?.notes || "",
  });

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceInterests: prev.serviceInterests.includes(service)
        ? prev.serviceInterests.filter((s) => s !== service)
        : [...prev.serviceInterests, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createLead({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          organization: formData.organization || undefined,
          title: formData.title || undefined,
          leadType: formData.leadType,
          programInterest: formData.programInterest as ProgramType || undefined,
          serviceInterests: formData.serviceInterests.length > 0 ? formData.serviceInterests : undefined,
          source: formData.source || undefined,
          notes: formData.notes || undefined,
        });

        if (result.success) {
          router.push("/leads");
          router.refresh();
        } else {
          setError(result.error || "Failed to create lead");
        }
      } else if (lead) {
        const result = await updateLead(lead.id, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          organization: formData.organization || null,
          title: formData.title || null,
          lead_type: formData.leadType,
          program_interest: formData.programInterest as ProgramType || null,
          service_interests: formData.serviceInterests.length > 0 ? formData.serviceInterests : null,
          source: formData.source || null,
          notes: formData.notes || null,
        });

        if (result.success) {
          router.push(`/leads/${lead.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to update lead");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Contact Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 555-5555"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Organization
            </label>
            <Input
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="Organization name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Job title"
            />
          </div>
        </div>
      </div>

      {/* Lead Details */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Lead Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Lead Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.leadType}
              onChange={(e) => setFormData({ ...formData, leadType: e.target.value as LeadType })}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            >
              {leadTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formData.leadType === "program" && (
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Program Interest
              </label>
              <select
                value={formData.programInterest}
                onChange={(e) => setFormData({ ...formData, programInterest: e.target.value as ProgramType | "" })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.value} value={program.value}>
                    {program.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.leadType === "msp" && (
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Services Interested In
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.serviceInterests.includes(service)
                        ? "bg-[#5A7247] text-white"
                        : "bg-[#FAFAF8] text-[#555555] hover:bg-[#EFF4EB]"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this lead..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Lead" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
