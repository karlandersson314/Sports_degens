import mongoose, { Schema, Document } from "mongoose";

export interface IMarketSelection extends Document {
  id: string;
  market_id: string;
  label: string;
  player_id: string;
  line_value: number;
  side: string;
}

const MarketSelectionSchema = new Schema<IMarketSelection>({
  id: { type: String, required: true, unique: true },
  market_id: { type: String, required: true },
  label: { type: String, required: true },
  player_id: { type: String, required: true },
  line_value: { type: Number, required: true },
  side: { type: String, required: true },
});

export const MarketSelection = mongoose.model<IMarketSelection>(
  "MarketSelection",
  MarketSelectionSchema
);
