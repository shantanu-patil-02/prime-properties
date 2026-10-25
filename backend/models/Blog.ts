import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Market Trends' | 'Architecture' | 'Investment' | 'Lifestyle' | 'Mumbai' | 'Pune';
  author: string;
  isPublished: boolean;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Market Trends', 'Architecture', 'Investment', 'Lifestyle', 'Mumbai', 'Pune'],
      index: true,
    },
    author: { type: String, default: 'Prime Properties Editorial' },
    isPublished: { type: Boolean, default: true, index: true },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Blog: Model<IBlog> =
  (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
