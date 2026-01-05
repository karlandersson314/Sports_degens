import mongoose, { Schema, Document } from "mongoose";

export interface IPositiveEVOpportunity extends Document {
  id: number;
  selection_id: string;
  target_sportsbook_id: string;
  true_prob: number;
  book_implied_prob: number;
  edge_percent: number;
  expected_value: number;
  odds_snapshot_id: number;
  created_at: Date;
}

const PositiveEVOpportunitySchema = new Schema<IPositiveEVOpportunity>({
  id: { type: Number, required: true, unique: true },
  selection_id: { type: String, required: true },
  target_sportsbook_id: { type: String, required: true },
  true_prob: { type: Number, required: true },
  book_implied_prob: { type: Number, required: true },
  edge_percent: { type: Number, required: true },
  expected_value: { type: Number, required: true },
  odds_snapshot_id: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const PositiveEVOpportunity = mongoose.model<IPositiveEVOpportunity>(
  "PositiveEVOpportunity",
  PositiveEVOpportunitySchema
);
