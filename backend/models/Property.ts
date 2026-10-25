import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;
  city: 'Mumbai' | 'Pune';
  location: string;
  propertyType: 'Flat' | 'House' | 'Penthouse' | 'Villa';
  purpose: 'sale' | 'rent';
  price: number;
  priceDisplay: string;
  priceApproved: boolean; // Optional administrator-approved public-facing price
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  amenities: string[];
  isPublished: boolean;
  isFeatured: boolean;
  availability: 'Available' | 'Under Offer' | 'Sold';
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    city: { type: String, required: true, enum: ['Mumbai', 'Pune'], index: true },
    location: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      required: true,
      enum: ['Flat', 'House', 'Penthouse', 'Villa'],
      index: true,
    },
    purpose: { type: String, required: true, default: 'sale', enum: ['sale', 'rent'], index: true },
    price: { type: Number, required: true, min: 0 },
    priceDisplay: { type: String, required: true, trim: true },
    priceApproved: { type: Boolean, default: true },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    areaSqFt: { type: Number, required: true, min: 100 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    availability: {
      type: String,
      default: 'Available',
      enum: ['Available', 'Under Offer', 'Sold'],
      index: true,
    },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for fast search and filter
propertySchema.index({ isPublished: 1, city: 1, propertyType: 1 });
propertySchema.index({ isPublished: 1, purpose: 1, city: 1 });
propertySchema.index({ isPublished: 1, price: 1 });

const Property: Model<IProperty> =
  (mongoose.models.Property as Model<IProperty>) || mongoose.model<IProperty>('Property', propertySchema);

export default Property;
