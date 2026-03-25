import { Resend } from "resend";

// =============================================================================
// RESEND CLIENT
// =============================================================================

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn("RESEND_API_KEY not configured - emails will not be sent");
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// =============================================================================
// CONFIGURATION
// =============================================================================

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "4ever4wardfoundation@gmail.com";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Forever Forward";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forever4ward.org";

// =============================================================================
// SEND EMAIL HELPER
// =============================================================================

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!resend) {
    console.error("Resend not configured - email not sent");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

export function donationThankYouEmail(data: {
  donorName: string;
  amount: number;
  donationDate: string;
  isRecurring: boolean;
  designation?: string;
}): { subject: string; html: string } {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.amount);

  const formattedDate = new Date(data.donationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Thank you for your ${data.isRecurring ? "monthly " : ""}gift to Forever Forward!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Donation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <img src="${SITE_URL}/images/logo/ff-logo-horizontal-dark-bg.svg" alt="Forever Forward" style="height: 40px; width: auto;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 30px;">
              <h1 style="color: #1A1A1A; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
                Thank You, ${data.donorName}!
              </h1>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your generous ${data.isRecurring ? "monthly " : ""}donation of <strong style="color: #C9A84C;">${formattedAmount}</strong> is making a real difference in the lives of Black fathers and youth in our community.
              </p>

              ${data.designation ? `
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your gift has been designated to: <strong>${data.designation}</strong>
              </p>
              ` : ""}

              <div style="background-color: #FBF6E9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #1A1A1A; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">
                  Donation Details
                </p>
                <table style="width: 100%; font-size: 14px; color: #555555;">
                  <tr>
                    <td style="padding: 5px 0;">Amount:</td>
                    <td style="text-align: right; font-weight: 600;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;">Date:</td>
                    <td style="text-align: right;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;">Type:</td>
                    <td style="text-align: right;">${data.isRecurring ? "Monthly Recurring" : "One-Time"}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your support helps us provide:
              </p>

              <ul style="color: #555555; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>IT workforce training for fathers reentering the workforce</li>
                <li>Tech education programs for underserved youth</li>
                <li>Family bonding events through Movies on the Menu</li>
                <li>AI-powered mentorship through Travis AI</li>
              </ul>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Forever Forward is a 501(c)(3) nonprofit organization. Your donation may be tax-deductible to the fullest extent permitted by law.
              </p>

              <div style="text-align: center;">
                <a href="${SITE_URL}/programs" style="display: inline-block; background-color: #C9A84C; color: #1A1A1A; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  See Your Impact
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #888888; font-size: 13px; margin: 0 0 10px 0;">
                Forever Forward Foundation
              </p>
              <p style="color: #888888; font-size: 13px; margin: 0 0 15px 0;">
                6111 S Gramercy Pl, Suite 4<br>
                Los Angeles, CA 90047
              </p>
              <p style="color: #C9A84C; font-size: 14px; margin: 0; font-weight: 500;">
                Moving Forward, Together
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, html };
}

export function donationReceiptEmail(data: {
  donorName: string;
  donorAddress?: string;
  amount: number;
  donationDate: string;
  donationId: string;
  isRecurring: boolean;
}): { subject: string; html: string } {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.amount);

  const formattedDate = new Date(data.donationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Your Forever Forward Tax Receipt - ${formattedDate}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <img src="${SITE_URL}/images/logo/ff-logo-horizontal-dark-bg.svg" alt="Forever Forward" style="height: 40px; width: auto;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 30px;">
              <h1 style="color: #1A1A1A; font-size: 24px; font-weight: 600; margin: 0 0 10px 0; text-align: center;">
                Official Donation Receipt
              </h1>
              <p style="color: #888888; font-size: 14px; text-align: center; margin: 0 0 30px 0;">
                Tax Year ${new Date(data.donationDate).getFullYear()}
              </p>

              <div style="border: 1px solid #DDDDDD; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <table style="width: 100%; font-size: 14px; color: #555555;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Donor:</td>
                    <td style="text-align: right;">${data.donorName}</td>
                  </tr>
                  ${data.donorAddress ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Address:</td>
                    <td style="text-align: right;">${data.donorAddress}</td>
                  </tr>
                  ` : ""}
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Donation Date:</td>
                    <td style="text-align: right;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Receipt ID:</td>
                    <td style="text-align: right; font-family: monospace;">${data.donationId.slice(0, 8).toUpperCase()}</td>
                  </tr>
                  <tr style="border-top: 2px solid #C9A84C;">
                    <td style="padding: 15px 0 8px 0; font-weight: 600; font-size: 16px;">Amount:</td>
                    <td style="text-align: right; font-weight: 700; font-size: 18px; color: #1A1A1A;">${formattedAmount}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #EFF4EB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <p style="color: #3D5030; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Tax Information:</strong> Forever Forward Foundation is a 501(c)(3) nonprofit organization (EIN pending). No goods or services were provided in exchange for this donation. This receipt confirms your charitable contribution for tax purposes.
                </p>
              </div>

              <p style="color: #888888; font-size: 13px; text-align: center; margin: 0;">
                Please retain this receipt for your records.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #888888; font-size: 13px; margin: 0 0 10px 0;">
                Forever Forward Foundation
              </p>
              <p style="color: #888888; font-size: 13px; margin: 0;">
                6111 S Gramercy Pl, Suite 4, Los Angeles, CA 90047
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, html };
}

// =============================================================================
// GENERIC EMAIL TEMPLATE (For plain text wrapping)
// =============================================================================

export function generateEmailTemplate(data: {
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.heading}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <img src="${SITE_URL}/images/logo/ff-logo-horizontal-dark-bg.svg" alt="Forever Forward" style="height: 40px; width: auto;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 30px;">
              <h1 style="color: #1A1A1A; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">
                ${data.heading}
              </h1>

              <div style="color: #555555; font-size: 16px; line-height: 1.6;">
                ${data.body}
              </div>

              ${data.ctaText && data.ctaUrl ? `
              <div style="text-align: center; margin-top: 30px;">
                <a href="${data.ctaUrl}" style="display: inline-block; background-color: #C9A84C; color: #1A1A1A; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  ${data.ctaText}
                </a>
              </div>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #888888; font-size: 13px; margin: 0 0 10px 0;">
                Forever Forward Foundation
              </p>
              <p style="color: #888888; font-size: 13px; margin: 0 0 15px 0;">
                6111 S Gramercy Pl, Suite 4<br>
                Los Angeles, CA 90047
              </p>
              <p style="color: #C9A84C; font-size: 14px; margin: 0; font-weight: 500;">
                Moving Forward, Together
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
