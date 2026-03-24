"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { NewsletterSubscriber, NewsletterSubscriberInsert } from "@/types/database";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<ActionResult<NewsletterSubscriber>> {
  try {
    const adminClient = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await adminClient
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return { success: true, data: existing as NewsletterSubscriber };
      }
      // Reactivate subscription
      const { data, error } = await adminClient
        .from("newsletter_subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }

    // Create new subscription
    const subscriberData: NewsletterSubscriberInsert = {
      email,
      source: source || "website",
      is_active: true,
      confirmed: false,
      interests: null,
      first_name: null,
      last_name: null,
      confirmed_at: null,
      unsubscribed_at: null,
      unsubscribe_reason: null,
    };

    const { data, error } = await adminClient
      .from("newsletter_subscribers")
      .insert(subscriberData)
      .select()
      .single();

    if (error) {
      console.error("Error subscribing to newsletter:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in subscribeToNewsletter:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function unsubscribeFromNewsletter(
  email: string,
  reason?: string
): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("newsletter_subscribers")
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: reason || null,
      })
      .eq("email", email);

    if (error) {
      console.error("Error unsubscribing:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in unsubscribeFromNewsletter:", error);
    return { success: false, error: "Failed to unsubscribe" };
  }
}
