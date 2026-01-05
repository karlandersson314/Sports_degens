import mongoose, { Schema, Document } from "mongoose";

export interface IMiddleOpportunity extends Document {
  id: number;
  market_id: string;
  low_line_value: number;
  high_line_value: number;
  low_sportsbook_id: string;
  high_sportsbook_id: string;
  middle_win_prob: number;
  expected_profit_percent: number;
  created_at: Date;
}

const MiddleOpportunitySchema = new Schema<IMiddleOpportunity>({
  id: { type: Number, required: true, unique: true },
  market_id: { type: String, required: true },
  low_line_value: { type: Number, required: true },
  high_line_value: { type: Number, required: true },
  low_sportsbook_id: { type: String, required: true },
  high_sportsbook_id: { type: String, required: true },
  middle_win_prob: { type: Number, required: true },
  expected_profit_percent: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const MiddleOpportunity = mongoose.model<IMiddleOpportunity>(
  "MiddleOpportunity",
  MiddleOpportunitySchema
);
