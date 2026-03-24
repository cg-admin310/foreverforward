"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  BLOG_CATEGORIES,
  getPublishedPosts,
  getFeaturedPost,
} from "@/lib/data/blog";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = getFeaturedPost();
  const allPosts = getPublishedPosts();

  // Filter posts (excluding featured)
  const filteredPosts = allPosts
    .filter((post) => post.id !== featuredPost?.id)
    .filter((post) => {
      if (selectedCategory && post.category?.slug !== selectedCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
        );
      }
      return true;
    });

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2D2D] border border-[#444444] text-sm text-white/80 mb-6">
              <BookOpen className="h-4 w-4 text-[#C9A84C]" />
              Forever Forward Blog
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Stories of{" "}
              <span className="text-[#C9A84C]">Progress & Purpose</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Insights on fatherhood, tech careers, family, and building
              stronger communities. Written by fathers, for everyone.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A84C]" />
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 lg:py-16 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-[#C9A84C] mb-6">
              FEATURED ARTICLE
            </p>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Category Filter & Search */}
      <section className="py-8 bg-white border-b border-[#DDDDDD] sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-[#C9A84C] text-[#1A1A1A]"
                    : "bg-[#F5F3EF] text-[#555555] hover:bg-[#FBF6E9]"
                }`}
              >
                All
              </button>
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? "bg-[#C9A84C] text-[#1A1A1A]"
                      : "bg-[#F5F3EF] text-[#555555] hover:bg-[#FBF6E9]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888888]" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 lg:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#555555]">
                No articles found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-20 bg-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-white/70 mb-8">
              Get new articles delivered to your inbox. No spam, just valuable
              content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#2D2D2D] border-[#444444] text-white placeholder:text-white/50"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
