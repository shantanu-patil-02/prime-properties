import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  city: { type: String, required: true, enum: ['Mumbai', 'Pune'] },
  location: { type: String, required: true }, // e.g. Worli, Bandra, Koregaon Park
  propertyType: { type: String, required: true, enum: ['Penthouse', 'Villa', 'Luxury Apartment', 'Duplex', 'Estate'] },
  purpose: { type: String, default: 'sale', enum: ['sale', 'rent'] },
  price: { type: Number, required: true },
  priceDisplay: { type: String, required: true }, // e.g. "₹25 Cr"
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSqFt: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  availability: { type: String, default: 'Available', enum: ['Available', 'Under Offer', 'Sold'] },
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
