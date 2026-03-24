"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Shield,
  Bell,
  Key,
  Users,
  Mail,
  Globe,
  Database,
  Palette,
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SettingsTab = "profile" | "team" | "notifications" | "api" | "organization";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "case_worker" | "sales_lead" | "technician" | "event_coordinator";
  status: "active" | "invited" | "disabled";
  last_active: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "TJ Wilform",
    email: "tj@forever4ward.org",
    role: "super_admin",
    status: "active",
    last_active: "2026-03-22",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@forever4ward.org",
    role: "case_worker",
    status: "active",
    last_active: "2026-03-21",
  },
  {
    id: "3",
    name: "Angela Davis",
    email: "angela@forever4ward.org",
    role: "sales_lead",
    status: "active",
    last_active: "2026-03-20",
  },
  {
    id: "4",
    name: "Kevin Williams",
    email: "kevin@forever4ward.org",
    role: "technician",
    status: "active",
    last_active: "2026-03-19",
  },
];

const tabs = [
  { id: "profile" as SettingsTab, name: "Profile", icon: User },
  { id: "team" as SettingsTab, name: "Team Members", icon: Users },
  { id: "notifications" as SettingsTab, name: "Notifications", icon: Bell },
  { id: "api" as SettingsTab, name: "API Keys", icon: Key },
  { id: "organization" as SettingsTab, name: "Organization", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "case_worker":
        return "bg-[#EFF4EB] text-[#5A7247]";
      case "sales_lead":
        return "bg-blue-100 text-blue-700";
      case "technician":
        return "bg-purple-100 text-purple-700";
      case "event_coordinator":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] text-2xl font-bold">
                TJ
              </div>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="text-xs text-[#888888] mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">First Name</label>
                <Input defaultValue="Thomas" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Last Name</label>
                <Input defaultValue="Wilform" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Email</label>
                <Input type="email" defaultValue="tj@forever4ward.org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Phone</label>
                <Input type="tel" defaultValue="(951) 877-5196" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">Bio</label>
              <textarea
                className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm h-24"
                defaultValue="Founder of Forever Forward. Building pathways to tech careers for Black fathers and youth in Los Angeles."
              />
            </div>

            <div className="pt-4 border-t border-[#DDDDDD]">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Change Password</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-2">Current Password</label>
                  <Input type="password" />
                </div>
                <div></div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-2">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-2">Confirm New Password</label>
                  <Input type="password" />
                </div>
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[#555555]">Manage team members and their access levels.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Member</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Role</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Last Active</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold">
                            {member.name.split(" ").map((n) => n.charAt(0)).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{member.name}</p>
                            <p className="text-xs text-[#888888]">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleColor(member.role)}`}>
                          {member.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          member.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#888888]">
                          {new Date(member.last_active).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                            <Edit className="h-4 w-4 text-[#888888]" />
                          </button>
                          {member.role !== "super_admin" && (
                            <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#FBF6E9] rounded-lg">
              <h4 className="font-medium text-[#1A1A1A] mb-2">Role Permissions</h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-[#555555]">
                <p><span className="font-medium">Super Admin:</span> Full access to all features</p>
                <p><span className="font-medium">Case Worker:</span> Programs, participants, resources</p>
                <p><span className="font-medium">Sales Lead:</span> Leads, clients, billing, documents</p>
                <p><span className="font-medium">Technician:</span> Assigned clients, time tracking</p>
                <p><span className="font-medium">Event Coordinator:</span> Events, tickets, attendees</p>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <p className="text-[#555555]">Configure how you receive notifications.</p>

            <div className="space-y-4">
              {[
                { title: "New Lead Notifications", description: "Get notified when a new lead comes in" },
                { title: "Program Applications", description: "Alerts for new program applications" },
                { title: "Payment Received", description: "Notifications for successful payments" },
                { title: "Travis AI Escalations", description: "Urgent alerts requiring human intervention" },
                { title: "Event Registrations", description: "New ticket purchases and RSVPs" },
                { title: "Weekly Summary", description: "Weekly digest of key metrics" },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#DDDDDD]">
                  <div>
                    <h4 className="font-medium text-[#1A1A1A]">{setting.title}</h4>
                    <p className="text-sm text-[#888888]">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-[#555555]">
                      <input type="checkbox" defaultChecked className="rounded border-[#DDDDDD]" />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#555555]">
                      <input type="checkbox" defaultChecked={i < 4} className="rounded border-[#DDDDDD]" />
                      Push
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[#555555]">Manage API keys for integrations.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Production Key", created: "2026-01-15", lastUsed: "2026-03-22", prefix: "ff_live_" },
                { name: "Development Key", created: "2026-02-01", lastUsed: "2026-03-20", prefix: "ff_test_" },
              ].map((key, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-[#DDDDDD]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[#1A1A1A]">{key.name}</h4>
                      <code className="text-sm text-[#888888] bg-[#FAFAF8] px-2 py-1 rounded mt-1 inline-block">
                        {key.prefix}••••••••••••
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Reveal</Button>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#888888]">
                    <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                    <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#EFF4EB] rounded-lg">
              <h4 className="font-medium text-[#5A7247] mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Note
              </h4>
              <p className="text-sm text-[#555555]">
                API keys provide full access to your data. Keep them secure and never share them publicly.
                Rotate keys regularly and revoke any that may have been compromised.
              </p>
            </div>
          </div>
        );

      case "organization":
        return (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-2">Organization Name</label>
                <Input defaultValue="Forever Forward Foundation" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Phone</label>
                <Input type="tel" defaultValue="(951) 877-5196" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Email</label>
                <Input type="email" defaultValue="4ever4wardfoundation@gmail.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-2">Address</label>
                <Input defaultValue="6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Website</label>
                <Input defaultValue="https://forever4ward.org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">EIN</label>
                <Input defaultValue="XX-XXXXXXX" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#DDDDDD]">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Integrations</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "Stripe", status: "Connected", icon: Database },
                  { name: "Supabase", status: "Connected", icon: Database },
                  { name: "Anthropic AI", status: "Connected", icon: Mail },
                  { name: "Resend Email", status: "Not configured", icon: Mail },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#DDDDDD]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#FAFAF8] rounded-lg">
                        <integration.icon className="h-5 w-5 text-[#888888]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A]">{integration.name}</p>
                        <p className={`text-xs ${
                          integration.status === "Connected" ? "text-green-600" : "text-[#888888]"
                        }`}>
                          {integration.status}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {integration.status === "Connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Settings</h1>
          <p className="text-[#555555]">Manage your account and organization settings</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DDDDDD] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#C9A84C] text-[#1A1A1A]"
                : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl border border-[#DDDDDD] p-6"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
}
