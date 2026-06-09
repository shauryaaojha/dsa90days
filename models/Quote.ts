import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  dayIndex: number;
  text: string;
  translation?: string;
  meaning: string;
  source: string;
}

const QuoteSchema = new Schema<IQuote>({
  dayIndex: { type: Number, required: true, unique: true, min: 1, max: 31 },
  text: { type: String, required: true },
  translation: { type: String },
  meaning: { type: String, required: true },
  source: { type: String, required: true },
});

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;
