import { Resend } from "resend";

// =============================================================================
// RESEND CLIENT
// =============================================================================

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY environment variable is not set - email sending disabled");
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Default from address
const FROM_EMAIL = process.env.FROM_EMAIL || "Forever Forward <hello@forever4ward.org>";
const REPLY_TO = process.env.REPLY_TO_EMAIL || "4ever4wardfoundation@gmail.com";

// =============================================================================
// TYPES
// =============================================================================

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// =============================================================================
// SEND EMAIL
// =============================================================================

/**
 * Sends an email via Resend
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!resend) {
    console.warn("Resend not configured - email would have been sent to:", params.to);
    return {
      success: false,
      error: "Email service not configured. Set RESEND_API_KEY environment variable."
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || REPLY_TO,
      cc: params.cc,
      bcc: params.bcc,
      tags: params.tags,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email"
    };
  }
}

// =============================================================================
// GET EMAIL STATUS
// =============================================================================

/**
 * Gets the status of a sent email
 */
export async function getEmailStatus(messageId: string) {
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.get(messageId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error getting email status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get email status"
    };
  }
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

/**
 * Generates a branded HTML email template
 */
export function generateEmailTemplate(params: {
  preheader?: string;
  heading?: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footer?: string;
}): string {
  const { preheader, heading, body, ctaText, ctaUrl, footer } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading || "Forever Forward"}</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
  <style>
    body { margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF8; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
    .header { background-color: #1A1A1A; padding: 24px; text-align: center; }
    .header img { height: 40px; }
    .header h1 { color: #C9A84C; font-size: 24px; margin: 12px 0 0; font-weight: 600; }
    .content { padding: 32px 24px; }
    .content h2 { color: #1A1A1A; font-size: 22px; margin: 0 0 16px; font-weight: 600; }
    .content p { color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
    .cta { display: inline-block; background-color: #C9A84C; color: #1A1A1A !important; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 8px; margin: 16px 0; }
    .cta:hover { background-color: #A68A2E; }
    .footer { background-color: #1A1A1A; padding: 24px; text-align: center; }
    .footer p { color: #888888; font-size: 12px; margin: 0 0 8px; }
    .footer a { color: #C9A84C; text-decoration: none; }
    .divider { height: 4px; background: linear-gradient(90deg, #C9A84C, #5A7247); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Forever Forward</h1>
    </div>
    <div class="divider"></div>
    <div class="content">
      ${heading ? `<h2>${heading}</h2>` : ""}
      ${body}
      ${ctaText && ctaUrl ? `<p style="text-align: center;"><a href="${ctaUrl}" class="cta">${ctaText}</a></p>` : ""}
    </div>
    <div class="footer">
      <p>${footer || "Forever Forward Foundation"}</p>
      <p>6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047</p>
      <p><a href="https://forever4ward.org">forever4ward.org</a> | <a href="tel:+19518775196">(951) 877-5196</a></p>
      <p style="margin-top: 12px;">
        <a href="{{{unsubscribe}}}">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// =============================================================================
// SPECIFIC EMAIL TEMPLATES
// =============================================================================

/**
 * Welcome email for new program applicants
 */
export function welcomeEmail(name: string, programName: string): EmailTemplate {
  const firstName = name.split(" ")[0];
  return {
    subject: `Welcome to ${programName} - Let's Get Started!`,
    html: generateEmailTemplate({
      preheader: `${firstName}, your journey with Forever Forward begins now.`,
      heading: `Welcome to the Family, ${firstName}!`,
      body: `
        <p>We're thrilled to have you join the ${programName} program at Forever Forward. This is the beginning of something great.</p>
        <p>Here's what happens next:</p>
        <ul style="color: #555555; line-height: 1.8;">
          <li><strong>Program Orientation</strong> - We'll reach out within 48 hours to schedule your orientation session</li>
          <li><strong>Meet Travis</strong> - Our AI case manager will be available to support you 24/7</li>
          <li><strong>Connect with Your Cohort</strong> - You'll meet others on the same journey</li>
        </ul>
        <p>Remember: Every step forward is progress. We're here to support you every step of the way.</p>
        <p style="color: #1A1A1A; font-weight: 500;">- The Forever Forward Team</p>
      `,
      ctaText: "Learn More About Your Program",
      ctaUrl: "https://forever4ward.org/programs",
    }),
    text: `Welcome to ${programName}, ${firstName}! We're thrilled to have you join Forever Forward. We'll reach out within 48 hours to schedule your orientation. - The Forever Forward Team`,
  };
}

/**
 * Thank you email for donations
 */
export function donationThankYouEmail(
  name: string,
  amount: number,
  isRecurring: boolean
): EmailTemplate {
  const firstName = name.split(" ")[0];
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return {
    subject: `Thank You for Your ${isRecurring ? "Monthly " : ""}Gift of ${formattedAmount}`,
    html: generateEmailTemplate({
      preheader: `Your generosity is changing lives in Los Angeles.`,
      heading: `Thank You, ${firstName}!`,
      body: `
        <p>Your ${isRecurring ? "monthly " : ""}donation of <strong>${formattedAmount}</strong> to Forever Forward is making a real difference in the lives of Black fathers and youth in Los Angeles.</p>
        <p>Here's what your gift helps provide:</p>
        <ul style="color: #555555; line-height: 1.8;">
          <li><strong>Tech Training</strong> - Industry certifications and hands-on skills</li>
          <li><strong>Family Events</strong> - Movies on the Menu dinners bringing families together</li>
          <li><strong>AI Support</strong> - 24/7 mentorship through Travis, our AI case manager</li>
          <li><strong>Career Placement</strong> - Connecting graduates with IT opportunities</li>
        </ul>
        <p>Your tax-deductible donation receipt is attached. Forever Forward is a registered 501(c)(3) nonprofit organization.</p>
        <p style="color: #1A1A1A; font-weight: 500;">With gratitude,<br>Thomas "TJ" Wilform<br>Founder, Forever Forward</p>
      `,
      ctaText: "See Your Impact",
      ctaUrl: "https://forever4ward.org/about",
    }),
    text: `Thank you, ${firstName}! Your ${isRecurring ? "monthly " : ""}donation of ${formattedAmount} to Forever Forward is making a real difference. Your generosity provides tech training, family events, AI support, and career placement for Black fathers and youth in Los Angeles. - TJ Wilform, Founder`,
  };
}

/**
 * IT Services inquiry follow-up
 */
export function mspFollowUpEmail(
  name: string,
  organizationName: string
): EmailTemplate {
  const firstName = name.split(" ")[0];
  return {
    subject: `Your IT Assessment for ${organizationName}`,
    html: generateEmailTemplate({
      preheader: `Let's talk about how Forever Forward can support ${organizationName}'s technology needs.`,
      heading: `Hi ${firstName},`,
      body: `
        <p>Thank you for your interest in Forever Forward's IT services for <strong>${organizationName}</strong>.</p>
        <p>We specialize in providing nonprofits and schools with:</p>
        <ul style="color: #555555; line-height: 1.8;">
          <li><strong>Managed IT Services</strong> - Proactive support starting at $50/user/month</li>
          <li><strong>IT Refresh & Rollouts</strong> - Device deployment and configuration</li>
          <li><strong>Software & AI Solutions</strong> - Custom development for your mission</li>
          <li><strong>Low Voltage Infrastructure</strong> - Cabling, CCTV, and network setup</li>
        </ul>
        <p>I'd love to schedule a brief call to learn more about your organization's needs and see how we can help.</p>
        <p style="color: #1A1A1A; font-weight: 500;">Best regards,<br>Thomas "TJ" Wilform<br>Founder, Forever Forward<br>(951) 877-5196</p>
      `,
      ctaText: "Schedule a Call",
      ctaUrl: "https://calendly.com/forever-forward/it-consultation",
    }),
    text: `Hi ${firstName}, Thank you for your interest in Forever Forward's IT services for ${organizationName}. I'd love to schedule a brief call to learn more about your needs. - TJ Wilform, (951) 877-5196`,
  };
}

/**
 * Event registration confirmation
 */
export function eventConfirmationEmail(
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string
): EmailTemplate {
  const firstName = name.split(" ")[0];
  return {
    subject: `You're Registered: ${eventTitle}`,
    html: generateEmailTemplate({
      preheader: `See you at ${eventTitle}!`,
      heading: `You're In, ${firstName}!`,
      body: `
        <p>Your registration for <strong>${eventTitle}</strong> is confirmed!</p>
        <div style="background-color: #FBF6E9; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Event:</strong> ${eventTitle}</p>
          <p style="margin: 0 0 8px;"><strong>Date:</strong> ${eventDate}</p>
          <p style="margin: 0;"><strong>Location:</strong> ${eventLocation}</p>
        </div>
        <p>We can't wait to see you there! If you have any questions, don't hesitate to reach out.</p>
        <p style="color: #1A1A1A; font-weight: 500;">- The Forever Forward Team</p>
      `,
      ctaText: "Add to Calendar",
      ctaUrl: "https://forever4ward.org/events",
    }),
    text: `You're registered for ${eventTitle}! Date: ${eventDate}, Location: ${eventLocation}. See you there! - The Forever Forward Team`,
  };
}
