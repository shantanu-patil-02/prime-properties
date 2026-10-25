/**
 * Request input validation schemas and middleware
 */
import { Request, Response, NextFunction } from 'express';

export function validatePropertyInput(req: Request, res: Response, next: NextFunction) {
  const { title, city, location, propertyType, price, priceDisplay, bedrooms, bathrooms, areaSqFt } = req.body;

  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!city || !['Mumbai', 'Pune'].includes(city)) {
    errors.push('City must be either Mumbai or Pune');
  }

  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    errors.push('Location is required (e.g. Worli, Koregaon Park)');
  }

  const validTypes = ['Flat', 'House', 'Penthouse', 'Villa'];
  if (!propertyType || !validTypes.includes(propertyType)) {
    errors.push(`Property type must be one of: ${validTypes.join(', ')}`);
  }

  const { purpose } = req.body;
  if (purpose && !['sale', 'rent', 'Sale', 'Rent'].includes(purpose)) {
    errors.push('Purpose must be either "sale" or "rent"');
  }

  if (price === undefined || typeof Number(price) !== 'number' || Number(price) <= 0) {
    errors.push('Valid positive numeric price is required');
  }

  if (!priceDisplay || typeof priceDisplay !== 'string') {
    errors.push('Price display string is required (e.g. "₹25 Cr")');
  }

  if (bedrooms !== undefined && Number(bedrooms) < 0) {
    errors.push('Bedrooms must be non-negative');
  }

  if (bathrooms !== undefined && Number(bathrooms) < 0) {
    errors.push('Bathrooms must be non-negative');
  }

  if (areaSqFt !== undefined && Number(areaSqFt) <= 0) {
    errors.push('Area in sq.ft must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  next();
}

export function validateAvailabilityUpdate(req: Request, res: Response, next: NextFunction) {
  const { availability } = req.body;
  const validStatuses = ['Available', 'Under Offer', 'Sold'];

  if (!availability || !validStatuses.includes(availability)) {
    return res.status(400).json({
      success: false,
      error: `Availability must be one of: ${validStatuses.join(', ')}`,
    });
  }

  next();
}


export function validateInquiryInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    fullName,
    email,
    phone,
    city,
    inquiryType,
    message,
  } = req.body;

  const errors: string[] = [];

  // Full Name: required, minimum 2 characters
  if (
    !fullName ||
    typeof fullName !== 'string' ||
    fullName.trim().length < 2
  ) {
    errors.push('Full name must be at least 2 characters');
  }

  // Email: optional, but must be valid if provided
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    email !== undefined &&
    email !== null &&
    email.trim() !== '' &&
    (typeof email !== 'string' || !emailRegex.test(email.trim()))
  ) {
    errors.push('Please provide a valid email address');
  }

  // Phone: required
  if (
    !phone ||
    typeof phone !== 'string' ||
    phone.trim().length < 7
  ) {
    errors.push('A valid phone number is required');
  }

  // City: retain existing validation
  if (!city || !['Mumbai', 'Pune', 'Other'].includes(city)) {
    errors.push('City must be Mumbai, Pune, or Other');
  }

  // Inquiry type: retain existing validation
  const validInquiryTypes = [
    'Schedule Viewing',
    'Pricing Details',
    'General Inquiry',
    'Virtual Tour',
  ];

  if (!inquiryType || !validInquiryTypes.includes(inquiryType)) {
    errors.push(
      `Inquiry type must be one of: ${validInquiryTypes.join(', ')}`
    );
  }

  // Message: optional, no minimum length
  if (
    message !== undefined &&
    message !== null &&
    typeof message !== 'string'
  ) {
    errors.push('Message must be text');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Inquiry validation failed',
      details: errors,
    });
  }

  next();
}

