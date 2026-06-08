import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: string;
  completed: boolean;
  notes: string;
  completedAt: Date | null;
}

const ProgressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

// Compound index for fast lookups
ProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const Progress: Model<IProgress> = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

export default Progress;
