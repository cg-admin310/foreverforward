"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Search,
  Building2,
  MapPin,
  Phone,
  Globe,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string | null;
  eligibility: string;
  contact_person: string | null;
}

const sampleResources: Resource[] = [
  {
    id: "1",
    name: "A New Day Foundation",
    category: "Technology",
    description: "Laptop donations and technology support for program participants.",
    address: "Los Angeles, CA",
    phone: "(310) 555-0100",
    website: "https://anewdayfoundation.org",
    eligibility: "Forever Forward program participants",
    contact_person: "Dawnn Lewis",
  },
  {
    id: "2",
    name: "LA Regional Food Bank",
    category: "Food Security",
    description: "Food assistance program for families in need.",
    address: "1734 E 41st St, Los Angeles, CA 90058",
    phone: "(323) 234-3030",
    website: "https://lafoodbank.org",
    eligibility: "LA County residents",
    contact_person: null,
  },
  {
    id: "3",
    name: "WorkSource Center - South LA",
    category: "Employment",
    description: "Job training, resume assistance, and employment placement services.",
    address: "5225 S Vermont Ave, Los Angeles, CA 90037",
    phone: "(323) 752-2500",
    website: null,
    eligibility: "LA County residents 18+",
    contact_person: null,
  },
  {
    id: "4",
    name: "Childcare Resource Center",
    category: "Childcare",
    description: "Subsidized childcare assistance and referrals.",
    address: "Los Angeles, CA",
    phone: "(818) 765-2570",
    website: "https://crcca.org",
    eligibility: "Income-qualified families",
    contact_person: null,
  },
  {
    id: "5",
    name: "PATH - People Assisting the Homeless",
    category: "Housing",
    description: "Housing assistance, emergency shelter, and supportive services.",
    address: "340 N Madison Ave, Los Angeles, CA 90004",
    phone: "(323) 644-2200",
    website: "https://epath.org",
    eligibility: "Individuals experiencing homelessness",
    contact_person: null,
  },
  {
    id: "6",
    name: "Mental Health America of LA",
    category: "Mental Health",
    description: "Mental health services, support groups, and counseling referrals.",
    address: "Los Angeles, CA",
    phone: "(213) 413-1130",
    website: "https://mhala.org",
    eligibility: "LA County residents",
    contact_person: null,
  },
];

const categories = [
  "All",
  "Technology",
  "Food Security",
  "Employment",
  "Childcare",
  "Housing",
  "Mental Health",
  "Legal",
  "Transportation",
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredResources = sampleResources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || resource.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology":
        return "bg-blue-100 text-blue-700";
      case "Food Security":
        return "bg-green-100 text-green-700";
      case "Employment":
        return "bg-[#FBF6E9] text-[#C9A84C]";
      case "Childcare":
        return "bg-pink-100 text-pink-700";
      case "Housing":
        return "bg-purple-100 text-purple-700";
      case "Mental Health":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Partner Resources</h1>
          <p className="text-[#555555]">
            Community resources and partner organizations
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
        >
          <p className="text-sm text-[#888888]">Total Resources</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{sampleResources.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
        >
          <p className="text-sm text-[#888888]">Categories</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {new Set(sampleResources.map((r) => r.category)).size}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
        >
          <p className="text-sm text-[#888888]">With Website</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {sampleResources.filter((r) => r.website).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-[#DDDDDD]"
        >
          <p className="text-sm text-[#888888]">Partner Organizations</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1">
            {sampleResources.filter((r) => r.contact_person).length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === category
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-white text-[#555555] border border-[#DDDDDD] hover:border-[#C9A84C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-[#DDDDDD] p-4 hover:border-[#C9A84C] hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FBF6E9]">
                  <Building2 className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A]">{resource.name}</h3>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(
                      resource.category
                    )}`}
                  >
                    {resource.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#555555] mb-4 line-clamp-2">
              {resource.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#555555]">
                <MapPin className="h-4 w-4 text-[#888888]" />
                <span className="truncate">{resource.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#555555]">
                <Phone className="h-4 w-4 text-[#888888]" />
                {resource.phone}
              </div>
              {resource.website && (
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#C9A84C] hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Eligibility */}
            <div className="p-3 bg-[#FAFAF8] rounded-lg mb-4">
              <p className="text-xs text-[#888888]">Eligibility</p>
              <p className="text-sm text-[#555555]">{resource.eligibility}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#DDDDDD]">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
