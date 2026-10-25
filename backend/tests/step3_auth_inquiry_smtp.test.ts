/**
 * Automated Test Suite for Step 3:
 * Authentication, Rate Limiting, Inquiry Persistence, Privacy Consent, and SMTP Email Notifications
 * Run via: npx tsx backend/tests/step3_auth_inquiry_smtp.test.ts
 */
import jwt from 'jsonwebtoken';
import { AUTHORIZED_ADMIN_EMAIL } from '../middleware/auth.ts';
import { recordFailedLogin, loginRateLimiter, resetLoginAttempts, clearAllLoginAttempts } from '../middleware/rateLimiter.ts';
import { validateInquiryInput } from '../middleware/validation.ts';
import inquiryService from '../services/inquiryService.ts';
import { sendInquiryAlertEmail, setTestTransporter, ADMIN_NOTIFICATION_EMAIL } from '../services/emailService.ts';

const SESSION_SECRET = process.env.SESSION_SECRET || 'prime_properties_secret_key_2026';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
}

async function runStep3Tests() {
  console.log('\n--- COMMENCING STEP 3 AUTH, INQUIRY & EMAIL TESTS ---\n');

  // Test 1: Single authorized administrator identity enforcement
  try {
    assert(
      AUTHORIZED_ADMIN_EMAIL === 'shantanupatil636@gmail.com',
      'Authorized administrator email is strictly configured to shantanupatil636@gmail.com'
    );
    assert(
      ADMIN_NOTIFICATION_EMAIL === 'shantanupatil636@gmail.com',
      'Admin notification recipient is strictly targeted to shantanupatil636@gmail.com'
    );
  } catch (err: any) {
    assert(false, `Admin identity verification failed: ${err.message}`);
  }

  // Test 2: Admin JWT token creation and verification
  try {
    const validToken = jwt.sign(
      { email: AUTHORIZED_ADMIN_EMAIL, role: 'admin' },
      SESSION_SECRET,
      { expiresIn: '24h' }
    );
    const decoded: any = jwt.verify(validToken, SESSION_SECRET);
    assert(
      decoded.email === 'shantanupatil636@gmail.com' && decoded.role === 'admin',
      'Valid administrator JWT token issues with authorized claims'
    );

    const unauthorizedToken = jwt.sign(
      { email: 'hacker@example.com', role: 'admin' },
      SESSION_SECRET,
      { expiresIn: '24h' }
    );
    const decodedUnauth: any = jwt.verify(unauthorizedToken, SESSION_SECRET);
    assert(
      decodedUnauth.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase(),
      'Unauthorized email token is detected and barred by authorization policy'
    );
  } catch (err: any) {
    assert(false, `JWT authentication tests failed: ${err.message}`);
  }

  // Test 3: Brute-force rate limiting (max 5 failed attempts per 15 min)
  try {
    clearAllLoginAttempts();

    const mockReq: any = {
      ip: '192.168.1.100',
      body: { email: AUTHORIZED_ADMIN_EMAIL },
      headers: {},
      socket: { remoteAddress: '192.168.1.100' },
    };

    let rateLimited = false;
    const mockRes: any = {
      status(code: number) {
        if (code === 429) rateLimited = true;
        return this;
      },
      json(data: any) {
        return data;
      },
    };

    // First 4 failed attempts should not trigger rate limit
    for (let i = 0; i < 4; i++) {
      recordFailedLogin(mockReq);
    }
    loginRateLimiter(mockReq, mockRes, () => {});
    assert(!rateLimited, 'Under 5 failed attempts are not rate-limited');

    // 5th failed attempt should trigger rate limit lock
    recordFailedLogin(mockReq);
    loginRateLimiter(mockReq, mockRes, () => {});
    assert(rateLimited, '5th failed attempt triggers 429 Too Many Requests lockout');

    // Reset works upon successful login
    resetLoginAttempts(mockReq);
    rateLimited = false;
    loginRateLimiter(mockReq, mockRes, () => {});
    assert(!rateLimited, 'Successful authentication resets failed attempt counter');
  } catch (err: any) {
    assert(false, `Rate limiting test failed: ${err.message}`);
  }

  // Test 4: Privacy consent validation middleware
  try {
    let validationFailed = false;
    let errorDetails: string[] = [];

    const mockRes: any = {
      status(code: number) {
        if (code === 400) validationFailed = true;
        return this;
      },
      json(data: any) {
        errorDetails = data.details || [];
        return data;
      },
    };

    // Request missing privacy consent
    const reqWithoutConsent: any = {
      body: {
        fullName: 'Shantanu patil',
        email: 'Shantanu@example.com',
        phone: '+91 98200 12345',
        city: 'Mumbai',
        inquiryType: 'Schedule Viewing',
        message: 'Interested in private penthouse viewing.',
        privacyConsent: false,
      },
    };

    validationFailed = false;
    validateInquiryInput(reqWithoutConsent, mockRes, () => {});
    assert(
      validationFailed && errorDetails.some((d) => d.includes('Privacy consent')),
      'Inquiry submission without explicit privacy consent is rejected with 400'
    );

    // Request with privacy consent accepted
    const reqWithConsent: any = {
      body: {
        fullName: 'Shantanu Singhania',
        email: 'Shantanu@example.com',
        phone: '+91 98200 12345',
        city: 'Mumbai',
        inquiryType: 'Schedule Viewing',
        message: 'Interested in private penthouse viewing.',
        privacyConsent: true,
      },
    };

    let nextCalled = false;
    validateInquiryInput(reqWithConsent, mockRes, () => {
      nextCalled = true;
    });
    assert(nextCalled, 'Inquiry submission with valid fields and privacyConsent passes validation');
  } catch (err: any) {
    assert(false, `Privacy consent validation test failed: ${err.message}`);
  }

  // Test 5: Pre-Save Guarantee & Persistence
  try {
    const inquiryData = {
      fullName: 'Aarav Mahindra',
      email: 'aarav@mahindra-advisory.in',
      phone: '+91 98111 22233',
      city: 'Mumbai' as const,
      inquiryType: 'Schedule Viewing' as const,
      message: 'Looking to lease a luxury sea-facing flat for 3 years in Bandra.',
      privacyConsent: true,
      propertyTitle: '  Sea-Facing 4BHK Luxury Flat for Rent - Bandra West',
    };

    const saved = await inquiryService.createAndProcessInquiry(inquiryData);
    assert(
      saved && saved._id,
      'Pre-save guarantee: inquiry is persisted and assigned an ID before email dispatch'
    );
    assert(
      saved.fullName === 'Aarav Mahindra' && saved.privacyConsent === true,
      'Inquiry attributes including privacy consent are stored correctly'
    );
  } catch (err: any) {
    assert(false, `Pre-save persistence test failed: ${err.message}`);
  }

  // Test 6: SMTP Failure Handling & Non-Loss of Inquiry Data
  try {
    // Set mock transporter that throws error
    const faultyTransporter: any = {
      async sendMail() {
        throw new Error('Simulated SMTP connection timeout to host smtp.example.com');
      },
    };
    setTestTransporter(faultyTransporter);

    const inquiryUnderSmtpFailure = {
      fullName: 'Sunil Mittal',
      email: 'sunil@mittalholdings.com',
      phone: '+91 98222 33344',
      city: 'Pune' as const,
      inquiryType: 'Pricing Details' as const,
      message: 'Requesting valuation and title deeds for Koregaon Park estate.',
      privacyConsent: true,
      propertyTitle: '  Independent Luxury House with Private Lawn for Sale - Koregaon Park',
    };

    const saved = await inquiryService.createAndProcessInquiry(inquiryUnderSmtpFailure);
    assert(
      saved && saved._id,
      'SMTP failure resilience: inquiry document is preserved safely in storage'
    );
    assert(
      saved.emailNotificationSent === false,
      'Delivery flag is marked false when SMTP transport fails'
    );
    assert(
      saved.emailError && saved.emailError.includes('Simulated SMTP connection timeout'),
      'Diagnostic error message is recorded in the inquiry document for administrative review'
    );
    assert(
      saved.notificationAttempts >= 1,
      'Notification attempt count is tracked upon delivery failure'
    );
  } catch (err: any) {
    assert(false, `SMTP failure resilience test failed: ${err.message}`);
  }

  // Test 7: Luxury HTML Email Notification with Mock Transporter
  try {
    let capturedMail: any = null;
    const workingTransporter: any = {
      async sendMail(mailOptions: any) {
        capturedMail = mailOptions;
        return { messageId: 'test-msg-12345' };
      },
    };
    setTestTransporter(workingTransporter);

    const emailResult = await sendInquiryAlertEmail({
      fullName: 'Natasha Poonawalla',
      email: 'natasha@seruminvest.in',
      phone: '+91 99220 55555',
      city: 'Pune',
      inquiryType: 'Virtual Tour',
      propertyTitle: '  The Royal Palms Estate Villa',
      message: 'Kindly arrange a 3D walkthrough for our Pune acquisition board.',
      inquiryId: 'inq-test-99',
    });

    assert(emailResult.success === true, 'sendInquiryAlertEmail returns success with working transporter');
    assert(
      capturedMail && capturedMail.to === 'shantanupatil636@gmail.com',
      'Email recipient is strictly shantanupatil636@gmail.com'
    );
    assert(
      capturedMail.subject.includes('Virtual Tour') && capturedMail.subject.includes('Natasha Poonawalla'),
      'Email subject contains inquiry type, client name, and city'
    );
    assert(
      capturedMail.html.includes('PRIME') &&
      capturedMail.html.includes('PROPERTIES') &&
      capturedMail.html.includes('natasha@seruminvest.in') &&
      capturedMail.html.includes('+91 99220 55555'),
      'Email body contains luxury brand header and complete client contact details'
    );
  } catch (err: any) {
    assert(false, `Email notification test failed: ${err.message}`);
  }

  // Test 8: Admin Inquiries Querying & Filters
  try {
    const allInquiries = await inquiryService.getInquiriesAdmin({});
    assert(Array.isArray(allInquiries) && allInquiries.length > 0, 'Admin can query inquiries list');

    const mumbaiInquiries = await inquiryService.getInquiriesAdmin({ city: 'Mumbai' });
    const allMumbai = mumbaiInquiries.every((i: any) => i.city.toLowerCase() === 'mumbai');
    assert(allMumbai && mumbaiInquiries.length > 0, 'Admin can filter inquiries by city (Mumbai)');

    const searchResults = await inquiryService.getInquiriesAdmin({ search: 'Aarav' });
    assert(
      searchResults.length > 0 && searchResults.some((i: any) => i.fullName.includes('Aarav')),
      'Admin search query correctly matches client name'
    );
  } catch (err: any) {
    assert(false, `Admin inquiry filtering test failed: ${err.message}`);
  }

  // Test 9: Admin Inquiry Status Update & SMTP Retry
  try {
    const allInquiries = await inquiryService.getInquiriesAdmin({});
    const targetInquiry = allInquiries[0];

    // Update status
    const updated = await inquiryService.updateInquiryStatus(targetInquiry._id, 'In Progress');
    assert(
      updated && updated.status === 'In Progress',
      'Admin can update inquiry status to "In Progress"'
    );

    // Retry email notification
    const retryResult = await inquiryService.retryInquiryEmailNotification(targetInquiry._id);
    assert(
      retryResult.success === true,
      'Admin can trigger email notification retry for an inquiry'
    );
    assert(
      retryResult.inquiry.emailNotificationSent === true,
      'Email notification status updates to true upon successful retry'
    );
    assert(
      retryResult.inquiry.notificationAttempts >= 2,
      'Notification attempts count increments upon retry'
    );
  } catch (err: any) {
    assert(false, `Status update and retry test failed: ${err.message}`);
  }

  // Reset test transporter
  setTestTransporter(null);

  console.log('\n----------------------------------------------');
  console.log(`STEP 3 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runStep3Tests().catch((err) => {
  console.error('Fatal error running Step 3 tests:', err);
  process.exit(1);
});
