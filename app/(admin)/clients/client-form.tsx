"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient, updateClient } from "@/lib/actions/clients";
import type { MspClient } from "@/types/database";

interface ClientFormProps {
  client?: MspClient;
  mode?: "create" | "edit";
}

const organizationTypes = [
  "nonprofit",
  "school",
  "church",
  "small_business",
  "government",
  "other",
];

const servicePackages = [
  { value: "foundation", label: "Foundation Package" },
  { value: "growth", label: "Growth Package (Managed IT)" },
  { value: "project", label: "Project-Based" },
  { value: "custom", label: "Custom" },
];

const services = [
  "Managed IT",
  "Software & AI Development",
  "Low Voltage Installation",
  "Network Infrastructure",
  "Cybersecurity",
  "Cloud Solutions",
  "Help Desk Support",
  "IT Refresh / Rollouts",
  "Structured Cabling",
  "CCTV Installation",
];

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function ClientForm({ client, mode = "create" }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    organizationName: client?.organization_name || "",
    organizationType: client?.organization_type || "nonprofit",
    website: client?.website || "",
    primaryContactName: client?.primary_contact_name || "",
    primaryContactEmail: client?.primary_contact_email || "",
    primaryContactPhone: client?.primary_contact_phone || "",
    primaryContactTitle: client?.primary_contact_title || "",
    addressLine1: client?.address_line1 || "",
    addressLine2: client?.address_line2 || "",
    city: client?.city || "",
    state: client?.state || "CA",
    zipCode: client?.zip_code || "",
    servicePackage: client?.service_package || "",
    services: (client?.services as string[]) || [],
    userCount: client?.user_count || "",
    monthlyValue: client?.monthly_value || "",
    notes: client?.notes || "",
  });

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createClient({
          organizationName: formData.organizationName,
          organizationType: formData.organizationType || undefined,
          website: formData.website || undefined,
          primaryContactName: formData.primaryContactName,
          primaryContactEmail: formData.primaryContactEmail,
          primaryContactPhone: formData.primaryContactPhone || undefined,
          primaryContactTitle: formData.primaryContactTitle || undefined,
          addressLine1: formData.addressLine1 || undefined,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zipCode: formData.zipCode || undefined,
          servicePackage: formData.servicePackage || undefined,
          services: formData.services.length > 0 ? formData.services : undefined,
          userCount: formData.userCount ? Number(formData.userCount) : undefined,
          monthlyValue: formData.monthlyValue ? Number(formData.monthlyValue) : undefined,
        });

        if (result.success) {
          router.push("/clients");
          router.refresh();
        } else {
          setError(result.error || "Failed to create client");
        }
      } else if (client) {
        const result = await updateClient(client.id, {
          organization_name: formData.organizationName,
          organization_type: formData.organizationType || null,
          website: formData.website || null,
          primary_contact_name: formData.primaryContactName,
          primary_contact_email: formData.primaryContactEmail,
          primary_contact_phone: formData.primaryContactPhone || null,
          primary_contact_title: formData.primaryContactTitle || null,
          address_line1: formData.addressLine1 || null,
          address_line2: formData.addressLine2 || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zipCode || null,
          service_package: formData.servicePackage || null,
          services: formData.services.length > 0 ? formData.services : null,
          user_count: formData.userCount ? Number(formData.userCount) : null,
          monthly_value: formData.monthlyValue ? Number(formData.monthlyValue) : null,
          notes: formData.notes || null,
        });

        if (result.success) {
          router.push(`/clients/${client.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to update client");
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

      {/* Organization Information */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Organization Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              required
              placeholder="Enter organization name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Organization Type
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              {organizationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.org"
            />
          </div>
        </div>
      </div>

      {/* Primary Contact */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Primary Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.primaryContactName}
              onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
              required
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Title
            </label>
            <Input
              value={formData.primaryContactTitle}
              onChange={(e) => setFormData({ ...formData, primaryContactTitle: e.target.value })}
              placeholder="Job title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.primaryContactEmail}
              onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
              required
              placeholder="email@organization.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.primaryContactPhone}
              onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Address Line 1
            </label>
            <Input
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              placeholder="Street address"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Address Line 2
            </label>
            <Input
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              placeholder="Suite, unit, building, floor, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              City
            </label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                ZIP Code
              </label>
              <Input
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="90001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Service Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-1">
              Service Package
            </label>
            <select
              value={formData.servicePackage}
              onChange={(e) => setFormData({ ...formData, servicePackage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              <option value="">Select a package</option>
              {servicePackages.map((pkg) => (
                <option key={pkg.value} value={pkg.value}>
                  {pkg.label}
                </option>
              ))}
            </select>
          </div>

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
                    formData.services.includes(service)
                      ? "bg-[#5A7247] text-white"
                      : "bg-[#FAFAF8] text-[#555555] hover:bg-[#EFF4EB]"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                User Count
              </label>
              <Input
                type="number"
                value={formData.userCount}
                onChange={(e) => setFormData({ ...formData, userCount: e.target.value })}
                placeholder="Number of users"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Estimated Monthly Value ($)
              </label>
              <Input
                type="number"
                value={formData.monthlyValue}
                onChange={(e) => setFormData({ ...formData, monthlyValue: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-1">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this client..."
                rows={4}
              />
            </div>
          )}
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
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Client" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
