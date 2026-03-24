"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost, BlogCategory } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// GET BLOG POSTS (Admin)
// ============================================================================

export async function getBlogPosts(options?: {
  status?: "published" | "draft" | "scheduled";
  categoryId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<ActionResult<{ posts: BlogPost[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    if (options?.search) {
      query = query.or(
        `title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching blog posts:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { posts: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getBlogPosts:", error);
    return { success: false, error: "Failed to fetch blog posts" };
  }
}

// ============================================================================
// GET BLOG CATEGORIES
// ============================================================================

export async function getBlogCategories(): Promise<ActionResult<BlogCategory[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching blog categories:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getBlogCategories:", error);
    return { success: false, error: "Failed to fetch blog categories" };
  }
}

// ============================================================================
// GET BLOG STATS
// ============================================================================

export async function getBlogStats(): Promise<ActionResult<{
  published: number;
  drafts: number;
  scheduled: number;
  totalViews: number;
}>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("status, views");

    if (error) {
      console.error("Error fetching blog stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      published: data?.filter((p) => p.status === "published").length || 0,
      drafts: data?.filter((p) => p.status === "draft").length || 0,
      scheduled: data?.filter((p) => p.status === "scheduled").length || 0,
      totalViews: data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getBlogStats:", error);
    return { success: false, error: "Failed to fetch blog stats" };
  }
}

// ============================================================================
// CREATE BLOG POST
// ============================================================================

export async function createBlogPost(postData: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  status?: "draft" | "published" | "scheduled";
  scheduledFor?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImageUrl?: string;
  aiGenerated?: boolean;
}): Promise<ActionResult<BlogPost>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Calculate read time (average 200 words per minute)
    const wordCount = postData.content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || null,
        content: postData.content,
        category_id: postData.categoryId || null,
        status: postData.status || "draft",
        scheduled_for: postData.scheduledFor || null,
        published_at: postData.status === "published" ? new Date().toISOString() : null,
        meta_title: postData.metaTitle || null,
        meta_description: postData.metaDescription || null,
        keywords: postData.keywords || null,
        featured_image_url: postData.featuredImageUrl || null,
        ai_generated: postData.aiGenerated || false,
        read_time_minutes: readTimeMinutes,
        views: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating blog post:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/blog-manager");
    revalidatePath("/blog");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createBlogPost:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

// ============================================================================
// UPDATE BLOG POST
// ============================================================================

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>
): Promise<ActionResult<BlogPost>> {
  try {
    const supabase = await createServerSupabaseClient();

    // If updating content, recalculate read time
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      updates.read_time_minutes = Math.ceil(wordCount / 200);
    }

    // If publishing, set published_at
    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/blog-manager");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error in updateBlogPost:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

// ============================================================================
// DELETE BLOG POST
// ============================================================================

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/blog-manager");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteBlogPost:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

// ============================================================================
// GET PUBLISHED POSTS (Public)
// ============================================================================

export async function getPublishedPosts(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<ActionResult<{ posts: BlogPost[]; total: number }>> {
  try {
    const adminClient = createAdminClient();

    let query = adminClient
      .from("blog_posts")
      .select("*, blog_categories(*)", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (options?.categorySlug) {
      // Need to join with categories
      query = query.eq("blog_categories.slug", options.categorySlug);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching published posts:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { posts: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getPublishedPosts:", error);
    return { success: false, error: "Failed to fetch published posts" };
  }
}

// ============================================================================
// GET SINGLE POST BY SLUG (Public)
// ============================================================================

export async function getPostBySlug(slug: string): Promise<ActionResult<BlogPost>> {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("blog_posts")
      .select("*, blog_categories(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      return { success: false, error: error.message };
    }

    // Increment views
    await adminClient
      .from("blog_posts")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id);

    return { success: true, data };
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    return { success: false, error: "Failed to fetch post" };
  }
}
