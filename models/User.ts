import mongoose, { Schema, Document, Model } from 'mongoose';

/** The language a student studies Phase 0 (language foundation) in. */
export type Phase0Language = 'cpp' | 'java' | 'python' | null;

/**
 * Which path a student is on. `phase0` is language fundamentals first;
 * `phase1` jumps straight into the 90-day problem sprint. Null means they have
 * not been through track selection yet.
 */
export type UserTrack = 'phase0' | 'phase1' | null;

export interface IUser extends Document {
  email: string;
  password: string | null;
  name: string;
  createdAt: Date;
  pledgeAcceptedAt: Date | null;
  provider: 'credentials' | 'google';

  // Phase 0 — language foundation. Progress itself lives in Day0to1Progress;
  // these two fields only record which syllabus the student is being graded on
  // and when they finished it. Graduation is per-language: completing the C++
  // syllabus says nothing about Python, so switching language re-derives the
  // stamp from that language's rows.
  day0to1Language: Phase0Language;
  day0to1CompletedAt: Date | null;

  track: UserTrack;
  /**
   * When the 90-day clock started. Deliberately never overwritten once set:
   * without that guard a student could reset their own deadline just by
   * toggling to Phase 0 and back.
   */
  phase1StartedAt: Date | null;
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
  day0to1Language: {
    type: String,
    enum: ['cpp', 'java', 'python', null],
    default: null,
  },
  day0to1CompletedAt: {
    type: Date,
    default: null,
  },
  track: {
    type: String,
    enum: ['phase0', 'phase1', null],
    default: null,
  },
  phase1StartedAt: {
    type: Date,
    default: null,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
