"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle,
  Send,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPost, BlogCategory } from "@/types/database";
import { createBlogPost, deleteBlogPost, updateBlogPost } from "@/lib/actions/blog";

interface BlogPostsViewProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export function BlogPostsView({ initialPosts, categories }: BlogPostsViewProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCategory, setGenerateCategory] = useState("");
  const [generateTopic, setGenerateTopic] = useState("");
  const [generateKeywords, setGenerateKeywords] = useState("");
  const [generatedPost, setGeneratedPost] = useState<{
    title: string;
    excerpt: string;
    content: string;
    slug: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.category_id === categoryFilter;
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

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: generateCategory,
          topic: generateTopic,
          keywords: generateKeywords,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedPost(data);
      } else {
        // Fallback for demo
        const slug = generateTopic
          ? generateTopic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
          : "ai-generated-post-" + Date.now();

        setGeneratedPost({
          title: generateTopic || "How AI is Transforming Nonprofit Operations",
          excerpt: "Discover how artificial intelligence tools are helping mission-driven organizations do more with less...",
          content: `# ${generateTopic || "How AI is Transforming Nonprofit Operations"}

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
          slug,
        });
      }
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!generatedPost) return;

    setIsSaving(true);
    try {
      const result = await createBlogPost({
        title: generatedPost.title,
        slug: generatedPost.slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        categoryId: generateCategory || undefined,
        status: "draft",
        aiGenerated: true,
      });

      if (result.success && result.data) {
        setPosts([result.data, ...posts]);
        setShowGenerateModal(false);
        setGeneratedPost(null);
        resetGenerateForm();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishNow = async () => {
    if (!generatedPost) return;

    setIsSaving(true);
    try {
      const result = await createBlogPost({
        title: generatedPost.title,
        slug: generatedPost.slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        categoryId: generateCategory || undefined,
        status: "published",
        aiGenerated: true,
      });

      if (result.success && result.data) {
        setPosts([result.data, ...posts]);
        setShowGenerateModal(false);
        setGeneratedPost(null);
        resetGenerateForm();
      }
    } catch (error) {
      console.error("Error publishing:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      const result = await updateBlogPost(postId, { status: "published" });
      if (result.success && result.data) {
        setPosts(posts.map((p) => (p.id === postId ? result.data! : p)));
      }
    } catch (error) {
      console.error("Error publishing:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const result = await deleteBlogPost(postId);
      if (result.success) {
        setPosts(posts.filter((p) => p.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const resetGenerateForm = () => {
    setGenerateCategory("");
    setGenerateTopic("");
    setGenerateKeywords("");
  };

  return (
    <>
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
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#DDDDDD]">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                categoryFilter === "all"
                  ? "bg-[#5A7247] text-white"
                  : "bg-[#FAFAF8] text-[#555555] hover:bg-[#EFF4EB]"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  categoryFilter === category.id
                    ? "bg-[#5A7247] text-white"
                    : "bg-[#FAFAF8] text-[#555555] hover:bg-[#EFF4EB]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-[#888888]" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "No posts found"
                : "No blog posts yet"}
            </h3>
            <p className="text-[#888888]">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "Create your first blog post to get started"}
            </p>
            <Button
              className="mt-4"
              onClick={() => setShowGenerateModal(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        ) : (
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
                          {post.ai_generated && (
                            <span className="text-xs text-[#C9A84C] flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI
                            </span>
                          )}
                          <span className="text-xs text-[#888888]">
                            {post.read_time_minutes} min read
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-[#FBF6E9] text-[#C9A84C] text-xs font-medium rounded-full">
                        {getCategoryName(post.category_id)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#555555]">{(post.views || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-[#888888]">
                        {post.status === "scheduled" && post.scheduled_for ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.scheduled_for).toLocaleDateString()}
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
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                          className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                        >
                          <Eye className="h-4 w-4 text-[#888888]" />
                        </button>
                        <button
                          onClick={() => router.push(`/blog-manager/${post.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-[#F5F3EF] transition-colors"
                        >
                          <Edit className="h-4 w-4 text-[#888888]" />
                        </button>
                        {post.status === "draft" && (
                          <button
                            onClick={() => handlePublishPost(post.id)}
                            className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            <Send className="h-4 w-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                    resetGenerateForm();
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
                      <select
                        value={generateCategory}
                        onChange={(e) => setGenerateCategory(e.target.value)}
                        className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">Topic (optional)</label>
                      <Input
                        value={generateTopic}
                        onChange={(e) => setGenerateTopic(e.target.value)}
                        placeholder="e.g., AI tools for nonprofits"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-2">Target Keywords (optional)</label>
                      <Input
                        value={generateKeywords}
                        onChange={(e) => setGenerateKeywords(e.target.value)}
                        placeholder="e.g., nonprofit technology, IT services"
                      />
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
                      <Input
                        value={generatedPost.title}
                        onChange={(e) =>
                          setGeneratedPost({ ...generatedPost, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#555555] mb-1">Excerpt</label>
                      <textarea
                        className="w-full border border-[#DDDDDD] rounded-lg px-3 py-2 text-sm h-20"
                        value={generatedPost.excerpt}
                        onChange={(e) =>
                          setGeneratedPost({ ...generatedPost, excerpt: e.target.value })
                        }
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
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedPost(null)}
                    disabled={isSaving}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button onClick={handlePublishNow} disabled={isSaving}>
                    {isSaving ? "Publishing..." : "Publish Now"}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface BlogActionsHeaderProps {
  onGenerateClick: () => void;
}

export function BlogActionsHeader({ onGenerateClick }: BlogActionsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onGenerateClick}>
        <Sparkles className="h-4 w-4 mr-2" />
        Generate with AI
      </Button>
      <Button onClick={() => router.push("/blog-manager/new")}>
        <span className="mr-2">+</span>
        New Post
      </Button>
    </div>
  );
}
