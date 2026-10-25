import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInquiry extends Document {
  fullName: string;
  email: string;
  phone: string;
  propertyRef?: mongoose.Types.ObjectId;
  propertyTitle?: string;
  city: 'Mumbai' | 'Pune' | 'Other';
  inquiryType: 'Schedule Viewing' | 'Pricing Details' | 'General Inquiry' | 'Virtual Tour';
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  privacyConsent: boolean;
  emailNotificationSent: boolean;
  emailError?: string;
  notificationAttempts: number;
  lastNotificationAttemptAt?: Date;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: false, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    propertyRef: { type: Schema.Types.ObjectId, ref: 'Property', default: null },
    propertyTitle: { type: String, default: '' },
    city: { type: String, required: true, enum: ['Mumbai', 'Pune', 'Other'] },
    inquiryType: {
      type: String,
      required: true,
      enum: ['Schedule Viewing', 'Pricing Details', 'General Inquiry', 'Virtual Tour'],
    },
    message: { type: String, required: false },
    privacyConsent: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      default: 'New',
      enum: ['New', 'Contacted', 'In Progress', 'Closed'],
      index: true,
    },
    emailNotificationSent: { type: Boolean, default: false, index: true },
    emailError: { type: String, default: '' },
    notificationAttempts: { type: Number, default: 0 },
    lastNotificationAttemptAt: { type: Date },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) || mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;
