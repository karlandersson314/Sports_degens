import mongoose, { Schema, Document } from "mongoose";

export interface IParlayRecommendationLeg extends Document {
  id: number;
  parlay_id: number;
  selection_id: string;
  sportsbook_id: string;
  leg_order: number;
  leg_odds_snapshot_id: number;
}

const ParlayRecommendationLegSchema = new Schema<IParlayRecommendationLeg>({
  id: { type: Number, required: true, unique: true },
  parlay_id: { type: Number, required: true },
  selection_id: { type: String, required: true },
  sportsbook_id: { type: String, required: true },
  leg_order: { type: Number, required: true },
  leg_odds_snapshot_id: { type: Number, required: true },
});

export const ParlayRecommendationLeg = mongoose.model<IParlayRecommendationLeg>(
  "ParlayRecommendationLeg",
  ParlayRecommendationLegSchema
);
