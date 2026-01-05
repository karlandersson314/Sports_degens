import mongoose, { Schema, Document } from "mongoose";

export interface IArbitrageOpportunity extends Document {
  id: number;
  market_id: string;
  total_implied_prob: number;
  profit_percent: number;
  leg_count: number;
  created_at: Date;
}

const ArbitrageOpportunitySchema = new Schema<IArbitrageOpportunity>({
  id: { type: Number, required: true, unique: true },
  market_id: { type: String, required: true },
  total_implied_prob: { type: Number, required: true },
  profit_percent: { type: Number, required: true },
  leg_count: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const ArbitrageOpportunity = mongoose.model<IArbitrageOpportunity>(
  "ArbitrageOpportunity",
  ArbitrageOpportunitySchema
);
