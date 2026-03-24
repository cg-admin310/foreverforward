import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPostBySlug, getPublishedPosts, getRecentPosts } from "@/lib/data/blog";
import { BlogPostClient } from "./blog-post-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Forever Forward",
    };
  }

  return {
    title: `${post.title} | Forever Forward Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: post.author_name ? [post.author_name] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRecentPosts(3).filter((p) => p.id !== post.id);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
