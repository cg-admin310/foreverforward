"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/shared/badge";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    featured_image_url?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
    author_name?: string | null;
    published_at?: string | null;
    read_time_minutes?: number | null;
  };
  index?: number;
  featured?: boolean;
}

export function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
      >
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden border border-[#DDDDDD] hover:border-[#C9A84C] transition-all hover:shadow-lg">
            {/* Image */}
            <div className="aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-[#C9A84C]/20 to-[#5A7247]/20 relative overflow-hidden">
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">📝</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              {post.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#FBF6E9] text-[#C9A84C] text-xs font-semibold mb-4 w-fit">
                  {post.category.name}
                </span>
              )}
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-4 group-hover:text-[#C9A84C] transition-colors">
                {post.title}
              </h2>
              <p className="text-[#555555] leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#888888]">
                {post.author_name && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author_name}
                  </span>
                )}
                {publishedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {publishedDate}
                  </span>
                )}
                {post.read_time_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.read_time_minutes} min read
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="h-full bg-white rounded-xl overflow-hidden border border-[#DDDDDD] hover:border-[#C9A84C] transition-all hover:shadow-lg">
          {/* Image */}
          <div className="aspect-[16/10] bg-gradient-to-br from-[#C9A84C]/20 to-[#5A7247]/20 relative overflow-hidden">
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
            )}
            {post.category && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1A1A1A]/80 text-white text-xs font-semibold">
                {post.category.name}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-[#555555] text-sm leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="flex items-center gap-1">
                {publishedDate && (
                  <>
                    <Calendar className="h-3 w-3" />
                    {publishedDate}
                  </>
                )}
              </span>
              {post.read_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.read_time_minutes} min
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
