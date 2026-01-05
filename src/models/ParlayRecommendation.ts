import mongoose, { Schema, Document } from "mongoose";

export enum ToolFeature {
  // Add actual features as needed
  FEATURE_A = "FEATURE_A",
  FEATURE_B = "FEATURE_B",
}

export interface IParlayRecommendation extends Document {
  id: string;
  user_id: string;
  feature_source: ToolFeature;
  generator_version: string;
  created_at: Date;
}

const ParlayRecommendationSchema = new Schema<IParlayRecommendation>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  feature_source: {
    type: String,
    enum: Object.values(ToolFeature),
    required: true,
  },
  generator_version: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const ParlayRecommendation = mongoose.model<IParlayRecommendation>(
  "ParlayRecommendation",
  ParlayRecommendationSchema
);
