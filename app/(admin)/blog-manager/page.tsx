"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "published" | "draft" | "scheduled";
  author: string;
  created_at: string;
  published_at: string | null;
  views: number;
  read_time: number;
}

const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "Why Tech Skills Matter for Black Fathers in 2026",
    excerpt: "How IT certifications are opening doors for Black fathers in Los Angeles and beyond...",
    category: "Fatherhood",
    status: "published",
    author: "TJ Wilform",
    created_at: "2026-03-10",
    published_at: "2026-03-12",
    views: 342,
    read_time: 6,
  },
  {
    id: "2",
    title: "From the Streets to the Server Room: Marcus's Story",
    excerpt: "Father Forward graduate Marcus Johnson shares his journey from unemployment to IT professional...",
    category: "Tech Careers",
    status: "published",
    author: "TJ Wilform",
    created_at: "2026-03-05",
    published_at: "2026-03-07",
    views: 528,
    read_time: 8,
  },
  {
    id: "3",
    title: "5 IT Services Every Nonprofit Needs",
    excerpt: "Essential technology infrastructure for mission-driven organizations...",
    category: "IT for Nonprofits",
    status: "draft",
    author: "Travis AI",
    created_at: "2026-03-18",
    published_at: null,
    views: 0,
    read_time: 5,
  },
  {
    id: "4",
    title: "Movies on the Menu: Creating Family Traditions",
    excerpt: "How our signature events bring fathers and families together...",
    category: "Community",
    status: "scheduled",
    author: "TJ Wilform",
    created_at: "2026-03-15",
    published_at: "2026-03-28",
    views: 0,
    read_time: 4,
  },
];

const categories = [
  "All",
  "Fatherhood",
  "Tech Careers",
  "Family",
  "IT for Nonprofits",
  "Community",
  "AI",
];

const stats = {
  published: samplePosts.filter((p) => p.status === "published").length,
  drafts: samplePosts.filter((p) => p.status === "draft").length,
  scheduled: samplePosts.filter((p) => p.status === "scheduled").length,
  totalViews: samplePosts.reduce((sum, p) => sum + p.views, 0),
};

export default function BlogManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<{
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);

  const filteredPosts = samplePosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedPost({
        title: "How AI is Transforming Nonprofit Operations",
        excerpt: "Discover how artificial intelligence tools are helping mission-driven organizations do more with less...",
        content: `# How AI is Transforming Nonprofit Operations

The nonprofit sector is undergoing a quiet revolution. Artificial intelligence, once the exclusive domain of tech giants and well-funded startups, is now accessible to mission-driven organizations of all sizes.

## The Challenge

Nonprofits often operate with limited resources while trying to maximize their impact. Staff members wear multiple hats, budgets are tight, and the demand for services continues to grow.

## Enter AI

From automated donor communications to intelligent program matching, AI tools are helping nonprofits:

- **Streamline administrative tasks** - Reduce time spent on routine paperwork
- **Improve donor engagement** - Personalized outreach at scale
- **Enhance program delivery** - Better matching of services to needs
- **Strengthen reporting** - Data-driven insights for funders

## Real-World Impact

At Forever Forward, we've seen firsthand how AI can amplify human impact. Our Travis AI system helps case workers support more participants without sacrificing the personal touch that makes our programs effective.

## Getting Started

You don't need a massive budget or technical expertise to begin exploring AI. Start small, focus on one pain point, and build from there.

---

*Ready to explore how managed IT services can help your nonprofit leverage technology? [Contact us](/contact) for a free assessment.*`,
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Blog Manager</h1>
          <p className="text-[#555555]">Create, edit, and publish blog content</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published", value: stats.published, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Drafts", value: stats.drafts, icon: Edit, color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-[#C9A84C]", bg: "bg-[#FBF6E9]" },
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
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "published", "draft", "scheduled"].map((status) => (
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
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#DDDDDD]">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                categoryFilter === category
                  ? "bg-[#5A7247] text-white"
                  : "bg-[#FAFAF8] text-[#555555] hover:bg-[#EFF4EB]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#DDDDDD]">
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Post</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Views</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#555555]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#DDDDDD] hover:bg-[#FAFAF8]"
                >
                  <td className="px-4 py-4">
                    <div className="max-w-md">
                      <p className="font-medium text-sm text-[#1A1A1A] line-clamp-1">{post.title}</p>
                      <p className="text-xs text-[#888888] line-clamp-1 mt-1">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#888888]">{post.author}</span>
                        <span className="text-[#DDDDDD]">·</span>
                        <span className="text-xs text-[#888888]">{post.read_time} min read</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#555555]">{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-[#888888]">
                      {post.status === "scheduled" && post.published_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </div>
                      ) : post.published_at ? (
                        new Date(post.published_at).toLocaleDateString()
                      ) : (
                        new Date(post.created_at).toLocaleDateString()
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                        <Eye className="h-4 w-4 text-[#888888]" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors">
                        <Edit className="h-4 w-4 text-[#888888]" />
                      </button>
                      {post.status === "draft" && (
                        <button className="p-2 rounded-lg hover:bg-green-50 transition-colors">
                          <Send className="h-4 w-4 text-green-600" />
                        </button>
                      )}
                      <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-[#DDDDDD] flex items-center justify-between">
                <h2 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                  Generate Blog Post with AI
                </h2>
                <button
                  onClick={() => {
                    setShowGenerateModal(false);
                    setGeneratedPost(null);
                  }}
                  className="p-1 hover:bg-[#F5F3EF] rounded-lg"
                >
                  <X className="h-5 w-5 text-[#888888]" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {!generatedPost ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">Category</label>
                      <select className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm">
                        {categories.filter((c) => c !== "All").map((cat) => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">Topic (optional)</label>
                      <Input placeholder="e.g., AI tools for nonprofits" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">Target Keywords (optional)</label>
                      <Input placeholder="e.g., nonprofit technology, IT services" />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Post
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Post Generated!</p>
                        <p className="text-sm text-green-700">Review and edit before publishing.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">Title</label>
                      <Input defaultValue={generatedPost.title} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">Excerpt</label>
                      <textarea
                        className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm h-20"
                        defaultValue={generatedPost.excerpt}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">Content Preview</label>
                      <div className="border border-[#DDDDDD] rounded-lg p-4 bg-[#FAFAF8] max-h-48 overflow-y-auto">
                        <pre className="text-sm text-[#555555] whitespace-pre-wrap font-sans">
                          {generatedPost.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {generatedPost && (
                <div className="p-4 border-t border-[#DDDDDD] flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setGeneratedPost(null)}>
                    Regenerate
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Publish Now</Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
