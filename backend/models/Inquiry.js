import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  propertyTitle: { type: String, default: '' },
  city: { type: String, required: true, enum: ['Mumbai', 'Pune', 'Other'] },
  inquiryType: { type: String, required: true, enum: ['Schedule Viewing', 'Pricing Details', 'General Inquiry', 'Virtual Tour'] },
  message: { type: String, required: true },
  status: { type: String, default: 'New', enum: ['New', 'Contacted', 'In Progress', 'Closed'] },
  emailNotificationSent: { type: Boolean, default: false },
  emailError: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
