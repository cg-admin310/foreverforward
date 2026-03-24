export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPostBySlug, getPublishedPosts as getDbPublishedPosts } from "@/lib/actions/blog";
import { getPublishedPosts as getStaticPosts, getPostBySlug as getStaticPost, getRecentPosts } from "@/lib/data/blog";
import { BlogPostClient } from "./blog-post-client";
import { BlogPost, BlogCategory } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Extended type for posts with joined category data
type BlogPostWithCategory = BlogPost & {
  blog_categories?: BlogCategory | null;
};

// For static generation of known posts
export async function generateStaticParams() {
  const staticPosts = getStaticPosts();
  return staticPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try database first
  const dbResult = await getPostBySlug(slug);
  if (dbResult.success && dbResult.data) {
    const post = dbResult.data;
    return {
      title: `${post.title} | Forever Forward Blog`,
      description: post.excerpt || post.meta_description || undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.meta_description || undefined,
        type: "article",
        publishedTime: post.published_at || undefined,
        images: post.featured_image_url ? [post.featured_image_url] : undefined,
      },
    };
  }

  // Fall back to static data
  const staticPost = getStaticPost(slug);
  if (staticPost) {
    return {
      title: `${staticPost.title} | Forever Forward Blog`,
      description: staticPost.excerpt,
      openGraph: {
        title: staticPost.title,
        description: staticPost.excerpt,
        type: "article",
        publishedTime: staticPost.published_at,
        authors: staticPost.author_name ? [staticPost.author_name] : undefined,
      },
    };
  }

  return {
    title: "Post Not Found | Forever Forward",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Try database first
  const dbResult = await getPostBySlug(slug);
  if (dbResult.success && dbResult.data) {
    const post = dbResult.data as BlogPostWithCategory;

    // Get related posts from database
    const relatedResult = await getDbPublishedPosts({ limit: 4 });
    const dbPosts = (relatedResult.data?.posts || []) as BlogPostWithCategory[];
    const relatedPosts = dbPosts
      .filter((p) => p.id !== post.id)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        content: p.content,
        category: p.blog_categories ? {
          id: p.blog_categories.id,
          name: p.blog_categories.name,
          slug: p.blog_categories.slug,
          description: p.blog_categories.description,
        } : undefined,
        author_name: "TJ Wilform",
        published_at: p.published_at || p.created_at,
        read_time_minutes: p.read_time_minutes || 5,
        featured_image_url: p.featured_image_url,
        tags: p.keywords || [],
        status: p.status,
      }));

    // Transform to match expected format
    const transformedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.blog_categories ? {
        id: post.blog_categories.id,
        name: post.blog_categories.name,
        slug: post.blog_categories.slug,
        description: post.blog_categories.description,
      } : undefined,
      author_name: "TJ Wilform",
      published_at: post.published_at || post.created_at,
      read_time_minutes: post.read_time_minutes || 5,
      featured_image_url: post.featured_image_url,
      tags: post.keywords || [],
      status: post.status,
    };

    return <BlogPostClient post={transformedPost} relatedPosts={relatedPosts} />;
  }

  // Fall back to static data
  const staticPost = getStaticPost(slug);
  if (!staticPost) {
    notFound();
  }

  const relatedPosts = getRecentPosts(3).filter((p) => p.id !== staticPost.id);

  return <BlogPostClient post={staticPost} relatedPosts={relatedPosts} />;
}
