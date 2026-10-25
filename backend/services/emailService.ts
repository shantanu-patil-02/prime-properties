/**
 * Email Notification Service using Nodemailer
 * Strictly sends new inquiry alerts to authorized administrator: shantanupatil636@gmail.com
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

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
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

export async function sendInquiryAlertEmail(payload: InquiryEmailPayload): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      error: 'SMTP credentials not configured in environment (SMTP_HOST, SMTP_USER, SMTP_PASS)',
    };
  }

  const appOrigin = process.env.APP_ORIGIN || process.env.APP_URL || 'http://localhost:3000';
  const mailFrom = {
  name: 'Prime Properties',
  address: process.env.MAIL_FROM || process.env.SMTP_USER!,
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
              <td style="padding: 10px 0; color: #2C2825;"><a href="mailto:${payload.email}" style="color: #B38F27;">${payload.email}</a></td>
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
              <td style="padding: 12px 0 6px 0; color: #2C2825; line-height: 1.5;">${payload.message}</td>
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
      from:mailFrom,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `[Prime Properties] New Inquiry: ${payload.inquiryType} from ${payload.fullName} (${payload.city})`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export default {
  sendInquiryAlertEmail,
  setTestTransporter,
  getTransporter,
  ADMIN_NOTIFICATION_EMAIL,
};
