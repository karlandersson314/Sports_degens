import mongoose, { Schema, Document } from "mongoose";

export interface IDegenindexPostVote extends Document {
  id: number;
  post_id: string;
  user_id: string;
  vote: number;
  created_at: Date;
}

const DegenindexPostVoteSchema = new Schema<IDegenindexPostVote>({
  id: { type: Number, required: true, unique: true },
  post_id: { type: String, required: true },
  user_id: { type: String, required: true },
  vote: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const DegenindexPostVote = mongoose.model<IDegenindexPostVote>(
  "DegenindexPostVote",
  DegenindexPostVoteSchema
);
