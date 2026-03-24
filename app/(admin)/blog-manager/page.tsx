export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogPosts, getBlogCategories, getBlogStats } from "@/lib/actions/blog";
import { BlogPostsView } from "./blog-posts-view";

export default async function BlogManagerPage() {
  // Fetch data in parallel
  const [postsResult, categoriesResult, statsResult] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getBlogStats(),
  ]);

  const posts = postsResult.data?.posts || [];
  const categories = categoriesResult.data || [];
  const stats = statsResult.data || {
    published: 0,
    drafts: 0,
    scheduled: 0,
    totalViews: 0,
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
          <Button variant="outline" asChild>
            <Link href="/blog-manager/generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Link>
          </Button>
          <Button asChild>
            <Link href="/blog-manager/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Published",
            value: stats.published,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Drafts",
            value: stats.drafts,
            icon: Edit,
            color: "text-gray-600",
            bg: "bg-gray-50",
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
            color: "text-[#C9A84C]",
            bg: "bg-[#FBF6E9]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
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
          </div>
        ))}
      </div>

      {/* Posts View (Client Component for interactivity) */}
      <BlogPostsView initialPosts={posts} categories={categories} />
    </div>
  );
}
