
/**
 * Inquiry Service: Handles customer inquiries, persistence before dispatch,
 * notification logging, retries, and administrator queries.
 */
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.ts';
import { sendInquiryAlertEmail } from './emailService.ts';

// In-memory store fallback for development
let memoryInquiries: any[] = [
  {
    _id: 'demo-inq-1',
    fullName: 'Shantanu patil',
    email: 'Shantanu.patil@gmail.com',
    phone: '+91 80804899xx',
    propertyTitle: 'Sea-Facing 4BHK Luxury Flat for Rent - Bandra West',
    city: 'Mumbai',
    inquiryType: 'Schedule Viewing',
    message:
      'We are seeking a 2-year lease for our executive family. Would appreciate a private viewing this Saturday morning.',
    privacyConsent: true,
    status: 'New',
    emailNotificationSent: true,
    notificationAttempts: 1,
    isDemo: true,
    createdAt: new Date(Date.now() - 3600000 * 4),
    updatedAt: new Date(),
  },
  {
    _id: 'demo-inq-2',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@investpune.in',
    phone: '+91 98220 98765',
    propertyTitle:
      'Independent Luxury House with Private Lawn for Sale - Koregaon Park',
    city: 'Pune',
    inquiryType: 'Pricing Details',
    message:
      'Interested in the title clearance and outright purchase procedure for the Koregaon Park bungalow. Please connect directly.',
    privacyConsent: true,
    status: 'Contacted',
    emailNotificationSent: true,
    notificationAttempts: 1,
    isDemo: true,
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(),
  },
];

function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export interface CreateInquiryDto {
  fullName: string;
  phone: string;
  email?: string;
  city?: 'Mumbai' | 'Pune' | 'Other';
  inquiryType?:
    | 'Schedule Viewing'
    | 'Pricing Details'
    | 'General Inquiry'
    | 'Virtual Tour';
  message?: string;
  propertyRef?: string;
  propertyTitle?: string;
  privacyConsent?: boolean;
  isDemo?: boolean;
}

const DEFAULT_CITY: CreateInquiryDto['city'] = 'Other';
const DEFAULT_INQUIRY_TYPE: CreateInquiryDto['inquiryType'] =
  'General Inquiry';

function normalizeInquiryData(data: CreateInquiryDto) {
  return {
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    email: typeof data.email === 'string' ? data.email.trim() : '',
    city: data.city || DEFAULT_CITY,
    inquiryType: data.inquiryType || DEFAULT_INQUIRY_TYPE,
    message: typeof data.message === 'string' ? data.message.trim() : '',
    propertyRef: data.propertyRef || undefined,
    propertyTitle: data.propertyTitle?.trim() || '',
    privacyConsent: data.privacyConsent ?? false,
    isDemo: data.isDemo ?? false,
  };
}

function validateRequiredFields(data: CreateInquiryDto): void {
  if (
    typeof data.fullName !== 'string' ||
    data.fullName.trim().length < 2
  ) {
    throw new Error('Full name must be at least 2 characters');
  }

  if (
    typeof data.phone !== 'string' ||
    data.phone.trim().length < 7
  ) {
    throw new Error('A valid phone number is required');
  }
}

function getNotificationPayload(inquiry: any) {
  return {
    fullName: inquiry.fullName,
    email: inquiry.email || '',
    phone: inquiry.phone,
    city: inquiry.city || 'Other',
    inquiryType: inquiry.inquiryType || 'General Inquiry',
    propertyTitle: inquiry.propertyTitle || '',
    message: inquiry.message || '',
    inquiryId: inquiry._id?.toString(),
    createdAt: inquiry.createdAt,
  };
}

export async function createAndProcessInquiry(data: CreateInquiryDto) {
  // Only full name and phone number are mandatory.
  validateRequiredFields(data);

  const normalizedData = normalizeInquiryData(data);

  // CRITICAL: Persist the inquiry BEFORE attempting email delivery.
  let savedInquiry: any = null;

  if (isConnected()) {
    savedInquiry = await Inquiry.create({
      ...normalizedData,
      status: 'New',
      emailNotificationSent: false,
      notificationAttempts: 0,
    });
  } else {
    savedInquiry = {
      ...normalizedData,
      _id: 'inq-' + Date.now(),
      status: 'New',
      emailNotificationSent: false,
      emailError: '',
      notificationAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryInquiries.unshift(savedInquiry);
  }

  // Attempt email notification asynchronously so client submission never hangs
  const dispatchPromise = (async () => {
    try {
      const emailResult = await sendInquiryAlertEmail(
        getNotificationPayload(savedInquiry)
      );

      if (emailResult.success) {
        savedInquiry.emailNotificationSent = true;
        savedInquiry.emailError = '';
        console.log(`[SMTP] Alert email dispatched successfully for inquiry: ${savedInquiry._id}`);
      } else {
        savedInquiry.emailNotificationSent = false;
        savedInquiry.emailError = emailResult.error || 'SMTP delivery failed';
        console.warn(`[SMTP Warning] Inquiry ${savedInquiry._id}: ${emailResult.error}`);
      }

      savedInquiry.notificationAttempts = (savedInquiry.notificationAttempts || 0) + 1;
      savedInquiry.lastNotificationAttemptAt = new Date();

      if (isConnected() && typeof savedInquiry.save === 'function') {
        await savedInquiry.save();
      }
    } catch (err: any) {
      console.warn('[Inquiry Notification Error]:', err.message);

      savedInquiry.emailNotificationSent = false;
      savedInquiry.emailError = err.message || 'Unknown email notification error';
      savedInquiry.notificationAttempts = (savedInquiry.notificationAttempts || 0) + 1;
      savedInquiry.lastNotificationAttemptAt = new Date();

      if (isConnected() && typeof savedInquiry.save === 'function') {
        await savedInquiry.save();
      }
    }
  })();

  // Await at most 1 second: if SMTP sends instantly, update the response; otherwise let it finish in background
  await Promise.race([
    dispatchPromise,
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);

  return savedInquiry;
}

export interface InquiryFilterParams {
  status?: string;
  city?: string;
  search?: string;
}

export async function getInquiriesAdmin(
  params: InquiryFilterParams = {}
) {
  if (isConnected()) {
    const query: any = {};

    if (params.status && params.status !== 'All') {
      query.status = params.status;
    }

    if (params.city && params.city !== 'All') {
      query.city = params.city;
    }

    if (params.search?.trim()) {
      const s = new RegExp(
        params.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      query.$or = [
        { fullName: s },
        { email: s },
        { phone: s },
        { propertyTitle: s },
        { message: s },
      ];
    }

    return await Inquiry.find(query).sort({ createdAt: -1 });
  }

  // In-memory filter
  let results = [...memoryInquiries];

  if (params.status && params.status !== 'All') {
    results = results.filter(
      (inq) => inq.status === params.status
    );
  }

  if (params.city && params.city !== 'All') {
    results = results.filter(
      (inq) =>
        (inq.city || '').toLowerCase() ===
        params.city?.toLowerCase()
    );
  }

  if (params.search?.trim()) {
    const s = params.search.trim().toLowerCase();

    results = results.filter(
      (inq) =>
        (inq.fullName || '').toLowerCase().includes(s) ||
        (inq.email || '').toLowerCase().includes(s) ||
        (inq.phone || '').toLowerCase().includes(s) ||
        (inq.propertyTitle || '').toLowerCase().includes(s) ||
        (inq.message || '').toLowerCase().includes(s)
    );
  }

  return results;
}

export async function updateInquiryStatus(
  id: string,
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed'
) {
  if (isConnected()) {
    return await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );
  }

  const inq = memoryInquiries.find(
    (item) => item._id === id
  );

  if (inq) {
    inq.status = status;
    inq.updatedAt = new Date();
    return inq;
  }

  return null;
}

export async function retryInquiryEmailNotification(id: string) {
  let inq: any = null;

  if (isConnected()) {
    inq = await Inquiry.findById(id);
  } else {
    inq = memoryInquiries.find((item) => item._id === id);
  }

  if (!inq) {
    throw new Error('Inquiry not found for email retry');
  }

  let emailResult: any;

  try {
    emailResult = await sendInquiryAlertEmail(
      getNotificationPayload(inq)
    );

    if (emailResult.success) {
      inq.emailNotificationSent = true;
      inq.emailError = '';
    } else {
      inq.emailNotificationSent = false;
      inq.emailError = emailResult.error || 'Retry failed';
    }
  } catch (err: any) {
    emailResult = {
      success: false,
      error: err.message || 'Unknown email notification error',
    };

    inq.emailNotificationSent = false;
    inq.emailError = emailResult.error;
  }

  inq.notificationAttempts = (inq.notificationAttempts || 0) + 1;
  inq.lastNotificationAttemptAt = new Date();

  if (isConnected()) {
    await inq.save();
  }

  return {
    success: emailResult.success,
    error: emailResult.error,
    inquiry: inq,
  };
}

export default {
  createAndProcessInquiry,
  getInquiriesAdmin,
  updateInquiryStatus,
  retryInquiryEmailNotification,
};
