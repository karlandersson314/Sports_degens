import mongoose, { Schema, Document } from "mongoose";

export interface IMarket extends Document {
  id: string;
  sport_event_id: string;
  key: string;
  label: string;
  metadata: Record<string, any>;
}

const MarketSchema = new Schema<IMarket>({
  id: { type: String, required: true, unique: true },
  sport_event_id: { type: String, required: true },
  key: { type: String, required: true },
  label: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, required: true },
});

export const Market = mongoose.model<IMarket>("Market", MarketSchema);
