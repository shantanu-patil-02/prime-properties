/**
 * Email Notification Service using Resend (Primary) with SMTP Fallback
 * Sends luxury inquiry alert emails to authorized administrator: shantanupatil636@gmail.com
 */
import { Resend } from 'resend';
import nodemailer, { Transporter } from 'nodemailer';

export const ADMIN_NOTIFICATION_EMAIL = (process.env.ADMIN_EMAIL || 'shantanupatil636@gmail.com').trim().toLowerCase();

let customTransporter: Transporter | null = null;
let customResend: Resend | null = null;

export function setTestTransporter(transporter: Transporter | null) {
  customTransporter = transporter;
}

export function setTestResend(client: Resend | null) {
  customResend = client;
}

/**
 * Initializes the Resend client
 */
export function getResendClient(): Resend | null {
  if (customResend) return customResend;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Legacy SMTP Transporter fallback
 */
export function getTransporter(): Transporter | null {
  if (customTransporter) return customTransporter;

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const configuredPort = Number(process.env.SMTP_PORT);

  if (!host || !user || !pass) {
    return null;
  }

  const isGmail = host.includes('gmail.com') || host.toLowerCase() === 'gmail';

  if (isGmail) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  const port = configuredPort || 587;
  const isSecure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface InquiryEmailPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  inquiryType: string;
  propertyTitle?: string;
  message: string;
  inquiryId?: string;
  createdAt?: Date;
}

/**
 * Generates the luxury-branded HTML email matching Prime Properties aesthetics
 */
export function generateInquiryEmailHtml(payload: InquiryEmailPayload): string {
  const appOrigin = process.env.APP_ORIGIN || process.env.APP_URL || 'https://prime-properties-six.vercel.app/admin';

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; padding: 30px; color: #2C2825;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1A1816; padding: 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
          <h1 style="color: #FAF8F5; margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">
            PRIME <span style="color: #D4AF37; font-weight: normal;">PROPERTIES</span>
          </h1>
          <p style="color: #A8A29E; font-size: 11px; margin-top: 6px; letter-spacing: 1px; text-transform: uppercase;">
            New Customer Inquiry Alert
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <h2 style="font-size: 18px; color: #2C2825; margin-top: 0;">New Luxury Advisory Request</h2>
          <p style="color: #78716C; font-size: 13px; line-height: 1.6;">
            A client has submitted an inquiry on the Prime Properties portal. Details are logged below:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; width: 140px; font-weight: 600;">Customer Name:</td>
              <td style="padding: 10px 0; color: #2C2825; font-weight: bold;">${payload.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; font-weight: 600;">Email:</td>
              <td style="padding: 10px 0; color: #2C2825;"><a href="mailto:${payload.email}" style="color: #B38F27;">${payload.email || 'Not provided'}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; font-weight: 600;">Phone:</td>
              <td style="padding: 10px 0; color: #2C2825;"><a href="tel:${payload.phone}" style="color: #2C2825; text-decoration: none; font-weight: bold;">${payload.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; font-weight: 600;">Preferred City:</td>
              <td style="padding: 10px 0; color: #2C2825;">${payload.city}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; font-weight: 600;">Inquiry Type:</td>
              <td style="padding: 10px 0; color: #B38F27; font-weight: 600;">${payload.inquiryType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F2EFE9;">
              <td style="padding: 10px 0; color: #78716C; font-weight: 600;">Property Reference:</td>
              <td style="padding: 10px 0; color: #2C2825;">${payload.propertyTitle || 'General Brokerage Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 6px 0; color: #78716C; font-weight: 600; vertical-align: top;">Message:</td>
              <td style="padding: 12px 0 6px 0; color: #2C2825; line-height: 1.5;">${payload.message || 'No additional message provided.'}</td>
            </tr>
          </table>

          <!-- Button -->
          <div style="margin-top: 32px; text-align: center;">
            <a href="${appOrigin}/admin" style="background-color: #2C2825; color: #FAF8F5; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 13px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
              Open Administrator Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #FAF8F5; padding: 16px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #F2EFE9;">
          Prime Properties Luxury Real Estate Brokerage · Confidential Admin Notice
        </div>
      </div>
    </div>
  `;
}

/**
 * Sends an inquiry alert email using Resend (default) or SMTP (fallback)
 */
export async function sendInquiryAlertEmail(
  payload: InquiryEmailPayload
): Promise<{ success: boolean; provider: 'resend' | 'smtp' | 'none'; id?: string; error?: string }> {
  const htmlContent = generateInquiryEmailHtml(payload);
  const subject = `[Prime Properties] New Inquiry: ${payload.inquiryType} from ${payload.fullName} (${payload.city})`;

  // 1. Try Resend First (Recommended method)
  const resend = getResendClient();
  if (resend) {
    try {
      // By default, Resend provides 'onboarding@resend.dev' for instant delivery to your registered account
      // Or user can provide their verified domain in MAIL_FROM (e.g., 'advisory@yourdomain.com')
      const fromAddress =
        process.env.MAIL_FROM?.trim() || 'Prime Properties <onboarding@resend.dev>';

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [ADMIN_NOTIFICATION_EMAIL],
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error('[Resend Error]:', error);
        return {
          success: false,
          provider: 'resend',
          error: error.message || 'Resend email delivery failed',
        };
      }

      console.log(`[Resend] Alert dispatched successfully. Message ID: ${data?.id}`);
      return {
        success: true,
        provider: 'resend',
        id: data?.id,
      };
    } catch (resendErr: any) {
      console.error('[Resend Exception]:', resendErr);
      return {
        success: false,
        provider: 'resend',
        error: resendErr.message || 'Resend service exception',
      };
    }
  }

  // 2. Fallback to SMTP if RESEND_API_KEY is not set
  const transporter = getTransporter();
  if (transporter) {
    try {
      const senderUser = process.env.SMTP_USER?.trim() || ADMIN_NOTIFICATION_EMAIL;
      const mailFromAddress = process.env.MAIL_FROM?.trim() || senderUser;

      const info = await transporter.sendMail({
        from: {
          name: 'Prime Properties Advisory Desk',
          address: mailFromAddress,
        },
        to: ADMIN_NOTIFICATION_EMAIL,
        subject,
        html: htmlContent,
      });

      console.log(`[SMTP] Alert dispatched successfully. Message ID: ${info?.messageId}`);
      return {
        success: true,
        provider: 'smtp',
        id: info?.messageId,
      };
    } catch (smtpErr: any) {
      console.error('[SMTP sendMail Error]:', smtpErr.message);
      return {
        success: false,
        provider: 'smtp',
        error: smtpErr.message || 'SMTP delivery failed',
      };
    }
  }

  // Neither Resend nor SMTP is configured
  return {
    success: false,
    provider: 'none',
    error: 'No email service configured. Please set RESEND_API_KEY in your environment variables.',
  };
}

/**
 * Test email connectivity (Resend or SMTP) and return diagnostics
 */
export async function verifyEmailConnection(): Promise<{
  success: boolean;
  provider: 'resend' | 'smtp' | 'none';
  message: string;
  sender?: string;
  recipient?: string;
}> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // 1. Diagnose Resend
  if (resendApiKey) {
    if (!resendApiKey.startsWith('re_')) {
      return {
        success: false,
        provider: 'resend',
        message: 'Invalid RESEND_API_KEY format. Resend API keys must start with "re_". Obtain one at https://resend.com/api-keys',
        recipient: ADMIN_NOTIFICATION_EMAIL,
      };
    }

    try {
      const resend = getResendClient();
      if (!resend) {
        return {
          success: false,
          provider: 'resend',
          message: 'Failed to initialize Resend client with provided API key.',
        };
      }

      // Validate the API key against the Resend API
      const apiKeysList = await resend.apiKeys.list();
      if (apiKeysList.error) {
        return {
          success: false,
          provider: 'resend',
          message: `Resend authentication failed: ${apiKeysList.error.message}`,
          recipient: ADMIN_NOTIFICATION_EMAIL,
        };
      }

      const sender = process.env.MAIL_FROM?.trim() || 'Prime Properties <onboarding@resend.dev>';
      return {
        success: true,
        provider: 'resend',
        message: 'Resend HTTP API connection established and authenticated successfully. Inquiries will be delivered directly via Resend (Port 443 HTTPS).',
        sender,
        recipient: ADMIN_NOTIFICATION_EMAIL,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'resend',
        message: `Resend API check error: ${err.message || String(err)}`,
        recipient: ADMIN_NOTIFICATION_EMAIL,
      };
    }
  }

  // 2. Diagnose SMTP if configured
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (host && user && pass) {
    const transporter = getTransporter();
    if (!transporter) {
      return {
        success: false,
        provider: 'smtp',
        message: 'Failed to initialize SMTP transporter with provided credentials.',
      };
    }
    try {
      await transporter.verify();
      return {
        success: true,
        provider: 'smtp',
        message: `SMTP connection established and authenticated successfully via ${host}.`,
        sender: user,
        recipient: ADMIN_NOTIFICATION_EMAIL,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'smtp',
        message: `SMTP verification failed: ${err.message}. Consider switching to Resend (set RESEND_API_KEY) to bypass cloud host port blocking.`,
        recipient: ADMIN_NOTIFICATION_EMAIL,
      };
    }
  }

  // Neither is configured
  return {
    success: false,
    provider: 'none',
    message: 'Resend API key missing. In your Render Dashboard, add RESEND_API_KEY (from https://resend.com/api-keys).',
    recipient: ADMIN_NOTIFICATION_EMAIL,
  };
}

/**
 * Backward compatibility alias for existing code
 */
export const verifySmtpConnection = verifyEmailConnection;

export default {
  sendInquiryAlertEmail,
  verifyEmailConnection,
  verifySmtpConnection,
  getResendClient,
  getTransporter,
  setTestResend,
  setTestTransporter,
  generateInquiryEmailHtml,
  ADMIN_NOTIFICATION_EMAIL,
};
