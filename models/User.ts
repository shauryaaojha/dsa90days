import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string | null;
  name: string;
  createdAt: Date;
  pledgeAcceptedAt: Date | null;
  provider: 'credentials' | 'google';
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pledgeAcceptedAt: {
    type: Date,
    default: null,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
