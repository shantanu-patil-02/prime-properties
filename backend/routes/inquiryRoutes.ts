/**
 * Inquiry Routes
 */
import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  updateStatus,
  retryEmail,
} from '../controllers/inquiryController.ts';
import { validateInquiryInput } from '../middleware/validation.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// Public submission
router.post('/inquiries', validateInquiryInput, submitInquiry);

// Protected Administrator inquiry endpoints
router.get('/admin/inquiries', requireAdmin, getInquiries);
router.patch('/admin/inquiries/:id/status', requireAdmin, updateStatus);
router.post('/admin/inquiries/:id/retry-email', requireAdmin, retryEmail);

export default router;
