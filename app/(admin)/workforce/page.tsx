"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Briefcase,
  Award,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WorkforceProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  certifications: string[];
  status: "available" | "assigned" | "training" | "inactive";
  current_assignment: string | null;
  hours_logged: number;
  program_graduate: string | null;
}

const sampleWorkforce: WorkforceProfile[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "(323) 555-0123",
    skills: ["IT Support", "Networking", "Windows Admin"],
    certifications: ["Google IT Support", "CompTIA A+"],
    status: "available",
    current_assignment: null,
    hours_logged: 120,
    program_graduate: "Father Forward Cohort 11",
  },
  {
    id: "2",
    name: "Kevin Davis",
    email: "kdavis@email.com",
    phone: "(310) 555-1234",
    skills: ["Help Desk", "Hardware Repair", "Customer Service"],
    certifications: ["Google IT Support"],
    status: "assigned",
    current_assignment: "Watts Community Center",
    hours_logged: 280,
    program_graduate: "Tech-Ready Youth Cohort 6",
  },
  {
    id: "3",
    name: "Andre Williams",
    email: "awilliams@email.com",
    phone: "(213) 555-0456",
    skills: ["Network Admin", "Security", "Cloud"],
    certifications: ["Google IT Support", "CompTIA Network+"],
    status: "assigned",
    current_assignment: "LA Youth Services",
    hours_logged: 450,
    program_graduate: "Father Forward Cohort 9",
  },
  {
    id: "4",
    name: "James Williams",
    email: "jwilliams@gmail.com",
    phone: "(213) 555-0789",
    skills: ["IT Support", "Troubleshooting"],
    certifications: [],
    status: "training",
    current_assignment: null,
    hours_logged: 0,
    program_graduate: null,
  },
];

const stats = {
  total: sampleWorkforce.length,
  available: sampleWorkforce.filter((w) => w.status === "available").length,
  assigned: sampleWorkforce.filter((w) => w.status === "assigned").length,
  training: sampleWorkforce.filter((w) => w.status === "training").length,
};

export default function WorkforcePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWorkforce = sampleWorkforce.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "training":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Workforce Pool</h1>
          <p className="text-[#555555]">
            Manage program graduates and technician assignments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Technician
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Workforce",
            value: stats.total,
            icon: Users,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
          {
            label: "Available",
            value: stats.available,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Assigned",
            value: stats.assigned,
            icon: Briefcase,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "In Training",
            value: stats.training,
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
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
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "available", "assigned", "training"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workforce Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkforce.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden hover:border-[#C9A84C] hover:shadow-md transition-all"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-bold">
                    {worker.name
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{worker.name}</h3>
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        worker.status
                      )}`}
                    >
                      {worker.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#555555]">
                  <Mail className="h-4 w-4 text-[#888888]" />
                  {worker.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#555555]">
                  <Phone className="h-4 w-4 text-[#888888]" />
                  {worker.phone}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs text-[#888888] mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {worker.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-[#FAFAF8] text-[#555555] text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {worker.certifications.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#888888] mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs rounded flex items-center gap-1"
                      >
                        <Award className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Assignment */}
              {worker.current_assignment && (
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Building2 className="h-4 w-4" />
                    <span>Assigned to {worker.current_assignment}</span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#DDDDDD]">
                <div className="flex items-center gap-1 text-sm text-[#888888]">
                  <Clock className="h-4 w-4" />
                  <span>{worker.hours_logged} hrs logged</span>
                </div>
                {worker.status === "available" && (
                  <Button size="sm">Assign</Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
