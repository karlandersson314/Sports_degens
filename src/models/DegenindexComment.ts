import mongoose, { Schema, Document } from "mongoose";

export interface IDegenindexComment extends Document {
  id: number;
  post_id: string;
  user_id: string;
  body: string;
  created_at: Date;
}

const DegenindexCommentSchema = new Schema<IDegenindexComment>({
  id: { type: Number, required: true, unique: true },
  post_id: { type: String, required: true },
  user_id: { type: String, required: true },
  body: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const DegenindexComment = mongoose.model<IDegenindexComment>(
  "DegenindexComment",
  DegenindexCommentSchema
);
