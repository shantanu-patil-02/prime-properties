/**
 * Inquiry Controller
 * Public submission with validation & pre-save persistence.
 * Protected administrative query, status updates, and email retries.
 */
import { Request, Response, NextFunction } from 'express';
import inquiryService from '../services/inquiryService.ts';

export async function submitInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const savedInquiry = await inquiryService.createAndProcessInquiry(req.body);
    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. A private luxury advisor has received your request.',
      inquiry: savedInquiry,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function getInquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, city, search } = req.query;
    const inquiries = await inquiryService.getInquiriesAdmin({
      status: status ? String(status) : undefined,
      city: city ? String(city) : undefined,
      search: search ? String(search) : undefined,
    });

    return res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await inquiryService.updateInquiryStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry record not found',
      });
    }

    return res.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      inquiry: updated,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function retryEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await inquiryService.retryInquiryEmailNotification(id);

    return res.json({
      success: result.success,
      message: result.success
        ? 'Email notification dispatched successfully to administrator'
        : `Email notification retry failed: ${result.error}`,
      error: result.error,
      inquiry: result.inquiry,
    });
  } catch (err: any) {
    next(err);
  }
}

export default {
  submitInquiry,
  getInquiries,
  updateStatus,
  retryEmail,
};
