"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, generateEmailTemplate } from "@/lib/resend";
import { Email, EmailInsert, EmailStatus } from "@/types/database";

// =============================================================================
// TYPES
// =============================================================================

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface EmailStats {
  sentThisMonth: number;
  openRate: number;
  clickRate: number;
  scheduled: number;
  drafts: number;
}

export interface RecipientOption {
  id: string;
  type: "lead" | "participant" | "client";
  name: string;
  email: string;
  organization?: string;
}

// =============================================================================
// CREATE EMAIL (DRAFT)
// =============================================================================

export async function createEmailDraft(data: {
  recipientEmail: string;
  recipientName?: string;
  recipientType?: string;
  recipientId?: string;
  subject: string;
  body: string;
  aiGenerated?: boolean;
  aiPromptUsed?: string;
  sequenceId?: string;
  sequencePosition?: number;
}): Promise<ActionResult<Email>> {
  try {
    const adminClient = createAdminClient();

    const emailData: EmailInsert = {
      recipient_email: data.recipientEmail,
      recipient_name: data.recipientName || null,
      recipient_type: data.recipientType || null,
      recipient_id: data.recipientId || null,
      subject: data.subject,
      body: data.body,
      status: "draft",
      ai_generated: data.aiGenerated || false,
      ai_prompt_used: data.aiPromptUsed || null,
      scheduled_for: null,
      sent_at: null,
      delivered_at: null,
      opened_at: null,
      clicked_at: null,
      sequence_id: data.sequenceId || null,
      sequence_position: data.sequencePosition || null,
      created_by: null,
    };

    const { data: email, error } = await adminClient
      .from("emails")
      .insert(emailData)
      .select()
      .single();

    if (error) {
      console.error("Error creating email draft:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/emails");
    return { success: true, data: email };
  } catch (error) {
    console.error("Error in createEmailDraft:", error);
    return { success: false, error: "Failed to create email draft" };
  }
}

// =============================================================================
// SEND EMAIL
// =============================================================================

export async function sendEmailAction(
  emailId: string
): Promise<ActionResult<Email>> {
  try {
    const adminClient = createAdminClient();

    // Get the email
    const { data: email, error: fetchError } = await adminClient
      .from("emails")
      .select("*")
      .eq("id", emailId)
      .single();

    if (fetchError || !email) {
      return { success: false, error: "Email not found" };
    }

    if (email.status === "sent" || email.status === "delivered" || email.status === "opened" || email.status === "clicked") {
      return { success: false, error: "Email has already been sent" };
    }

    // Generate HTML from body (if it's plain text, wrap it in template)
    const isHtml = email.body.includes("<") && email.body.includes(">");
    const html = isHtml
      ? email.body
      : generateEmailTemplate({
          heading: email.subject,
          body: `<p>${email.body.replace(/\n/g, "</p><p>")}</p>`,
        });

    // Send via Resend
    const result = await sendEmail({
      to: email.recipient_email,
      subject: email.subject,
      html,
      text: email.body.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    if (!result.success) {
      // Update status to indicate failure
      await adminClient
        .from("emails")
        .update({ status: "failed" as EmailStatus })
        .eq("id", emailId);

      return { success: false, error: result.error || "Failed to send email" };
    }

    // Update email record with sent status
    const { data: updatedEmail, error: updateError } = await adminClient
      .from("emails")
      .update({
        status: "sent" as EmailStatus,
        sent_at: new Date().toISOString(),
      })
      .eq("id", emailId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating email status:", updateError);
      return { success: false, error: updateError.message };
    }

    // Log activity if there's a recipient
    if (email.recipient_id && email.recipient_type) {
      await logEmailActivity(email, adminClient);
    }

    revalidatePath("/emails");
    return { success: true, data: updatedEmail };
  } catch (error) {
    console.error("Error in sendEmailAction:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// =============================================================================
// SEND EMAIL DIRECTLY (Create + Send)
// =============================================================================

export async function sendEmailDirect(data: {
  recipientEmail: string;
  recipientName?: string;
  recipientType?: string;
  recipientId?: string;
  subject: string;
  body: string;
  aiGenerated?: boolean;
}): Promise<ActionResult<Email>> {
  try {
    const adminClient = createAdminClient();

    // Generate HTML from body
    const isHtml = data.body.includes("<") && data.body.includes(">");
    const html = isHtml
      ? data.body
      : generateEmailTemplate({
          heading: data.subject,
          body: `<p>${data.body.replace(/\n/g, "</p><p>")}</p>`,
        });

    // Send via Resend
    const result = await sendEmail({
      to: data.recipientEmail,
      subject: data.subject,
      html,
      text: data.body.replace(/<[^>]*>/g, ""),
    });

    // Determine status based on send result
    const status: EmailStatus = result.success ? "sent" : "failed";

    // Create email record
    const emailData: EmailInsert = {
      recipient_email: data.recipientEmail,
      recipient_name: data.recipientName || null,
      recipient_type: data.recipientType || null,
      recipient_id: data.recipientId || null,
      subject: data.subject,
      body: data.body,
      status,
      ai_generated: data.aiGenerated || false,
      ai_prompt_used: null,
      scheduled_for: null,
      sent_at: result.success ? new Date().toISOString() : null,
      delivered_at: null,
      opened_at: null,
      clicked_at: null,
      sequence_id: null,
      sequence_position: null,
      created_by: null,
    };

    const { data: email, error } = await adminClient
      .from("emails")
      .insert(emailData)
      .select()
      .single();

    if (error) {
      console.error("Error creating email record:", error);
      return { success: false, error: error.message };
    }

    // Log activity if there's a recipient
    if (data.recipientId && data.recipientType && result.success) {
      await logEmailActivity(email, adminClient);
    }

    if (!result.success) {
      return { success: false, error: result.error || "Failed to send email", data: email };
    }

    revalidatePath("/emails");
    return { success: true, data: email };
  } catch (error) {
    console.error("Error in sendEmailDirect:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// =============================================================================
// SCHEDULE EMAIL
// =============================================================================

export async function scheduleEmail(
  emailId: string,
  scheduledFor: Date
): Promise<ActionResult<Email>> {
  try {
    const adminClient = createAdminClient();

    const { data: email, error } = await adminClient
      .from("emails")
      .update({
        status: "scheduled" as EmailStatus,
        scheduled_for: scheduledFor.toISOString(),
      })
      .eq("id", emailId)
      .select()
      .single();

    if (error) {
      console.error("Error scheduling email:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/emails");
    return { success: true, data: email };
  } catch (error) {
    console.error("Error in scheduleEmail:", error);
    return { success: false, error: "Failed to schedule email" };
  }
}

// =============================================================================
// DELETE EMAIL
// =============================================================================

export async function deleteEmail(emailId: string): Promise<ActionResult> {
  try {
    const adminClient = createAdminClient();

    // Only allow deleting drafts or scheduled emails
    const { data: email } = await adminClient
      .from("emails")
      .select("status")
      .eq("id", emailId)
      .single();

    if (email && !["draft", "scheduled"].includes(email.status)) {
      return { success: false, error: "Cannot delete sent emails" };
    }

    const { error } = await adminClient.from("emails").delete().eq("id", emailId);

    if (error) {
      console.error("Error deleting email:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/emails");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteEmail:", error);
    return { success: false, error: "Failed to delete email" };
  }
}

// =============================================================================
// GET EMAILS
// =============================================================================

export async function getEmails(options?: {
  limit?: number;
  offset?: number;
  status?: EmailStatus | "all";
  search?: string;
}): Promise<ActionResult<{ emails: Email[]; total: number }>> {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("emails")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.search) {
      query = query.or(
        `subject.ilike.%${options.search}%,recipient_name.ilike.%${options.search}%,recipient_email.ilike.%${options.search}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching emails:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { emails: data || [], total: count || 0 } };
  } catch (error) {
    console.error("Error in getEmails:", error);
    return { success: false, error: "Failed to fetch emails" };
  }
}

// =============================================================================
// GET EMAIL BY ID
// =============================================================================

export async function getEmailById(id: string): Promise<ActionResult<Email>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getEmailById:", error);
    return { success: false, error: "Failed to fetch email" };
  }
}

// =============================================================================
// GET EMAIL STATS
// =============================================================================

export async function getEmailStats(): Promise<ActionResult<EmailStats>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Sent this month
    const { count: sentCount } = await supabase
      .from("emails")
      .select("*", { count: "exact", head: true })
      .in("status", ["sent", "delivered", "opened", "clicked"])
      .gte("sent_at", startOfMonth);

    // Total sent (for rate calculations)
    const { data: sentEmails } = await supabase
      .from("emails")
      .select("status")
      .in("status", ["sent", "delivered", "opened", "clicked"]);

    const totalSent = sentEmails?.length || 0;
    const openedCount = sentEmails?.filter((e) =>
      ["opened", "clicked"].includes(e.status)
    ).length || 0;
    const clickedCount = sentEmails?.filter((e) => e.status === "clicked").length || 0;

    // Scheduled count
    const { count: scheduledCount } = await supabase
      .from("emails")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled");

    // Drafts count
    const { count: draftsCount } = await supabase
      .from("emails")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    return {
      success: true,
      data: {
        sentThisMonth: sentCount || 0,
        openRate: totalSent > 0 ? Math.round((openedCount / totalSent) * 100) : 0,
        clickRate: totalSent > 0 ? Math.round((clickedCount / totalSent) * 100) : 0,
        scheduled: scheduledCount || 0,
        drafts: draftsCount || 0,
      },
    };
  } catch (error) {
    console.error("Error in getEmailStats:", error);
    return { success: false, error: "Failed to fetch email stats" };
  }
}

// =============================================================================
// GET RECIPIENTS (Leads, Participants, Clients)
// =============================================================================

export async function getRecipients(options?: {
  search?: string;
  type?: "lead" | "participant" | "client" | "all";
}): Promise<ActionResult<RecipientOption[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const recipients: RecipientOption[] = [];

    const searchFilter = options?.search
      ? `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`
      : null;

    // Get leads
    if (!options?.type || options.type === "all" || options.type === "lead") {
      let leadQuery = supabase
        .from("leads")
        .select("id, first_name, last_name, email, organization")
        .limit(50);

      if (searchFilter) {
        leadQuery = leadQuery.or(searchFilter);
      }

      const { data: leads } = await leadQuery;
      if (leads) {
        recipients.push(
          ...leads.map((l) => ({
            id: l.id,
            type: "lead" as const,
            name: `${l.first_name} ${l.last_name}`,
            email: l.email,
            organization: l.organization || undefined,
          }))
        );
      }
    }

    // Get participants
    if (!options?.type || options.type === "all" || options.type === "participant") {
      let participantQuery = supabase
        .from("participants")
        .select("id, first_name, last_name, email")
        .limit(50);

      if (searchFilter) {
        participantQuery = participantQuery.or(searchFilter);
      }

      const { data: participants } = await participantQuery;
      if (participants) {
        recipients.push(
          ...participants.map((p) => ({
            id: p.id,
            type: "participant" as const,
            name: `${p.first_name} ${p.last_name}`,
            email: p.email,
          }))
        );
      }
    }

    // Get clients
    if (!options?.type || options.type === "all" || options.type === "client") {
      const clientSearchFilter = options?.search
        ? `organization_name.ilike.%${options.search}%,primary_contact_name.ilike.%${options.search}%,primary_contact_email.ilike.%${options.search}%`
        : null;

      let clientQuery = supabase
        .from("msp_clients")
        .select("id, organization_name, primary_contact_name, primary_contact_email")
        .limit(50);

      if (clientSearchFilter) {
        clientQuery = clientQuery.or(clientSearchFilter);
      }

      const { data: clients } = await clientQuery;
      if (clients) {
        recipients.push(
          ...clients.map((c) => ({
            id: c.id,
            type: "client" as const,
            name: c.primary_contact_name,
            email: c.primary_contact_email,
            organization: c.organization_name,
          }))
        );
      }
    }

    // Sort by name
    recipients.sort((a, b) => a.name.localeCompare(b.name));

    return { success: true, data: recipients };
  } catch (error) {
    console.error("Error in getRecipients:", error);
    return { success: false, error: "Failed to fetch recipients" };
  }
}

// =============================================================================
// UPDATE EMAIL
// =============================================================================

export async function updateEmail(
  id: string,
  data: Partial<{
    subject: string;
    body: string;
    recipientEmail: string;
    recipientName: string;
  }>
): Promise<ActionResult<Email>> {
  try {
    const adminClient = createAdminClient();

    const updateData: Record<string, unknown> = {};
    if (data.subject !== undefined) updateData.subject = data.subject;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.recipientEmail !== undefined) updateData.recipient_email = data.recipientEmail;
    if (data.recipientName !== undefined) updateData.recipient_name = data.recipientName;

    const { data: email, error } = await adminClient
      .from("emails")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating email:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/emails");
    return { success: true, data: email };
  } catch (error) {
    console.error("Error in updateEmail:", error);
    return { success: false, error: "Failed to update email" };
  }
}

// =============================================================================
// HELPER: Log email activity
// =============================================================================

async function logEmailActivity(
  email: Email,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminClient: any
) {
  try {
    const activityData: Record<string, unknown> = {
      activity_type: "email",
      description: `Email sent: ${email.subject}`,
      metadata: {
        email_id: email.id,
        subject: email.subject,
      },
    };

    // Set the appropriate relation field
    switch (email.recipient_type) {
      case "lead":
        activityData.lead_id = email.recipient_id;
        break;
      case "participant":
        activityData.participant_id = email.recipient_id;
        break;
      case "client":
        activityData.client_id = email.recipient_id;
        break;
    }

    await adminClient.from("activities").insert(activityData);
  } catch (error) {
    console.error("Error logging email activity:", error);
    // Don't fail the main operation
  }
}
