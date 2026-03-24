"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { useState } from "react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  author_name?: string | null;
  published_at: string;
  read_time_minutes?: number | null;
  featured_image_url?: string | null;
  tags?: string[];
}

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

// Simple markdown-like rendering (for demo - would use proper markdown library in production)
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 mb-6 text-[#555555]">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
    inList = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={index} className="text-3xl font-bold text-[#1A1A1A] mt-8 mb-4">
          {trimmed.slice(2)}
        </h1>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-semibold text-[#1A1A1A] mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    // List items
    if (trimmed.startsWith("- ")) {
      inList = true;
      currentList.push(trimmed.slice(2));
      return;
    }

    // Regular paragraph
    flushList();

    // Parse inline links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(trimmed)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(trimmed.slice(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <Link
          key={`link-${match.index}`}
          href={match[2]}
          className="text-[#C9A84C] hover:underline font-medium"
        >
          {match[1]}
        </Link>
      );
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < trimmed.length) {
      parts.push(trimmed.slice(lastIndex));
    }

    // Parse bold **text**
    const processedParts = parts.map((part, i) => {
      if (typeof part !== "string") return part;
      const boldParts = part.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((bp, bi) =>
        bi % 2 === 1 ? (
          <strong key={`bold-${i}-${bi}`} className="font-semibold">
            {bp}
          </strong>
        ) : (
          bp
        )
      );
    });

    elements.push(
      <p key={index} className="text-[#555555] leading-relaxed mb-4">
        {processedParts}
      </p>
    );
  });

  flushList();
  return elements;
}

export function BlogPostClient({ post, relatedPosts }: Props) {
  const [copied, setCopied] = useState(false);

  const publishedDate = new Date(post.published_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${post.title} | Forever Forward`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-20 bg-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <Link
                href={`/blog/categories/${post.category.slug}`}
                className="inline-block px-4 py-1.5 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold mb-6 hover:bg-[#E8D48B] transition-colors"
              >
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/60">
              {post.author_name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {publishedDate}
              </span>
              {post.read_time_minutes && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.read_time_minutes} min read
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image_url && (
        <section className="bg-[#FAFAF8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 lg:py-16 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 border border-[#DDDDDD] shadow-sm"
          >
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#DDDDDD]">
                <p className="text-sm font-medium text-[#888888] mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#F5F3EF] text-[#555555] text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-[#DDDDDD]">
              <p className="text-sm font-medium text-[#888888] mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share this article:
              </p>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#F5F3EF] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#F5F3EF] hover:bg-[#0A66C2] hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#F5F3EF] hover:bg-[#1877F2] hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-[#F5F3EF] hover:bg-[#C9A84C] hover:text-white transition-colors"
                >
                  <Link2 className="h-5 w-5" />
                </button>
                {copied && (
                  <span className="text-sm text-[#5A7247] self-center ml-2">
                    Link copied!
                  </span>
                )}
              </div>
            </div>
          </motion.article>

          {/* Author Card */}
          {post.author_name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-[#FBF6E9] rounded-xl p-6 border border-[#C9A84C]/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1A1A1A] text-lg">
                    {post.author_name}
                  </h3>
                  <p className="text-[#555555] text-sm mt-1">
                    Founder of Forever Forward. Building pathways for fathers
                    and youth to thrive in tech careers while strengthening
                    families and communities.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/70 mb-8">
            Whether you&apos;re looking to change careers, strengthen your
            family, or support our mission, there&apos;s a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/get-involved/enroll">Enroll in a Program</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/get-involved/donate">Support Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
              More Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard key={relatedPost.id} post={relatedPost} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
