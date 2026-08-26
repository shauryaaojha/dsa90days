import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDay0to1Progress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: string;       // e.g. "cpp-1.1"
  completed: boolean;
  completedAt: Date | null;
}

const Day0to1ProgressSchema = new Schema<IDay0to1Progress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  topicId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

// Fast lookup: one completion row per user+topic.
Day0to1ProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
// Faculty dashboard: count completions per user.
Day0to1ProgressSchema.index({ userId: 1, completed: 1 });

const Day0to1Progress: Model<IDay0to1Progress> =
  mongoose.models.Day0to1Progress ||
  mongoose.model<IDay0to1Progress>('Day0to1Progress', Day0to1ProgressSchema);

export default Day0to1Progress;
