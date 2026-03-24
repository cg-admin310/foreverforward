import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  BLOG_CATEGORIES,
  getCategoryBySlug,
  getPostsByCategory,
} from "@/lib/data/blog";
import { CategoryPageClient } from "./category-page-client";

interface PageProps {
  params: Promise<{ cat: string }>;
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ cat: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);

  if (!category) {
    return {
      title: "Category Not Found | Forever Forward",
    };
  }

  return {
    title: `${category.name} | Forever Forward Blog`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(cat);

  return <CategoryPageClient category={category} posts={posts} />;
}
