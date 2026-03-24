"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Folder } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { BLOG_CATEGORIES } from "@/lib/data/blog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: { name: string; slug: string } | null;
  author_name?: string | null;
  published_at: string;
  read_time_minutes?: number | null;
  featured_image_url?: string | null;
}

interface Props {
  category: Category;
  posts: Post[];
}

export function CategoryPageClient({ category, posts }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              All Articles
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-[#C9A84C] flex items-center justify-center">
                <Folder className="h-8 w-8 text-[#1A1A1A]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {category.name}
                </h1>
                <p className="text-white/70 mt-2">{category.description}</p>
              </div>
            </div>

            <p className="text-white/60">
              {posts.length} article{posts.length !== 1 ? "s" : ""} in this
              category
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 lg:py-16 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#555555]">
                No articles in this category yet. Check back soon!
              </p>
              <Link
                href="/blog"
                className="text-[#C9A84C] hover:underline mt-4 inline-block"
              >
                Browse all articles
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
            Explore Other Categories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOG_CATEGORIES.filter((c) => c.slug !== category.slug).map(
              (cat, index) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/categories/${cat.slug}`}
                    className="block p-4 rounded-lg border border-[#DDDDDD] hover:border-[#C9A84C] hover:bg-[#FBF6E9] transition-all group"
                  >
                    <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A84C] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[#555555] mt-1">
                      {cat.description}
                    </p>
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
