import mongoose, { Schema, Document } from "mongoose";

export enum BetSourceType {
  // Add actual bet source types as needed
  SOURCE_A = "SOURCE_A",
  SOURCE_B = "SOURCE_B",
}

export interface IDegenindexPostProof extends Document {
  id: number;
  post_id: string;
  bet_source_type: BetSourceType;
  casino_bet_id: string;
  external_bet_id: string;
}

const DegenindexPostProofSchema = new Schema<IDegenindexPostProof>({
  id: { type: Number, required: true, unique: true },
  post_id: { type: String, required: true },
  bet_source_type: {
    type: String,
    enum: Object.values(BetSourceType),
    required: true,
  },
  casino_bet_id: { type: String, required: true },
  external_bet_id: { type: String, required: true },
});

export const DegenindexPostProof = mongoose.model<IDegenindexPostProof>(
  "DegenindexPostProof",
  DegenindexPostProofSchema
);
