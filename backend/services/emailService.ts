/**
 * Email Notification Service using Nodemailer
 * Sends new inquiry alerts to authorized administrator: shantanupatil636@gmail.com
 */
import nodemailer, { Transporter } from 'nodemailer';

export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || 'shantanupatil636@gmail.com';

let customTransporter: Transporter | null = null;

/**
 * Configure or override transporter (used in testing or custom SMTP)
 */
export function setTestTransporter(transporter: Transporter | null) {
  customTransporter = transporter;
}

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
    // For Gmail on cloud hosting (Render, AWS, DigitalOcean), port 465 with direct SSL
    // is mandatory because cloud platforms throttle or block outbound port 587 STARTTLS.
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false, // Prevents SSL certificate rejection on containerized cloud hosts
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
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Test SMTP connectivity and return diagnostics
 */
export async function verifySmtpConnection(): Promise<{
  success: boolean;
  message: string;
  host?: string;
  user?: string;
  port?: number;
}> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return {
      success: false,
      message: 'SMTP credentials missing. Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS in your hosting environment.',
    };
  }

  const isGmail = host.includes('gmail.com') || host.toLowerCase() === 'gmail';
  const effectivePort = isGmail ? 465 : (Number(process.env.SMTP_PORT) || 587);

  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      message: 'Failed to initialize email transporter with provided credentials.',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      message: `SMTP connection established and authenticated successfully via port ${effectivePort} (SSL).`,
      host,
      user,
      port: effectivePort,
    };
  } catch (err: any) {
    let guidance = '';
    const errorMsg = err?.message || String(err);

    if (errorMsg.includes('Username and Password not accepted') || errorMsg.includes('535') || errorMsg.includes('BadCredentials')) {
      guidance = ' Gmail requires a 16-character "App Password" (NOT your regular Gmail account password). Generate one at: https://myaccount.google.com/apppasswords with 2-Step Verification enabled.';
    } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED' || errorMsg.includes('Connection timeout')) {
      guidance = ' Connection timed out. Make sure your Render Dashboard has SMTP_PORT=465 and SMTP_HOST=smtp.gmail.com.';
    }

    return {
      success: false,
      message: `${errorMsg}.${guidance}`,
      host,
      user,
      port: effectivePort,
    };
  }
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

export async function sendInquiryAlertEmail(payload: InquiryEmailPayload): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials not configured in environment (SMTP_HOST, SMTP_USER, SMTP_PASS)',
    };
  }

  const appOrigin = process.env.APP_ORIGIN || process.env.APP_URL || 'https://primeproperties.in';
  const senderUser = process.env.SMTP_USER?.trim() || ADMIN_NOTIFICATION_EMAIL;
  const mailFromAddress = process.env.MAIL_FROM?.trim() || senderUser;

  const mailFrom = {
    name: 'Prime Properties Advisory Desk',
    address: mailFromAddress,
  };

  const htmlContent = `
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

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `[Prime Properties] New Inquiry: ${payload.inquiryType} from ${payload.fullName} (${payload.city})`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err: any) {
    console.error('[SMTP sendMail Error]:', err.message);
    return {
      success: false,
      error: err.message || 'SMTP delivery failed',
    };
  }
}

export default {
  sendInquiryAlertEmail,
  verifySmtpConnection,
  setTestTransporter,
  getTransporter,
  ADMIN_NOTIFICATION_EMAIL,
};
