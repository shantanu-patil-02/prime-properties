import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  name: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Authorized Administrator' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
