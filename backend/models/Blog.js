import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true, enum: ['Market Trends', 'Architecture', 'Investment', 'Lifestyle', 'Mumbai', 'Pune'] },
  author: { type: String, default: 'Prime Properties Editorial' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
