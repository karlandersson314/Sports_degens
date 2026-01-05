import mongoose, { Schema, Document } from "mongoose";

export interface IDegenindexPost extends Document {
  id: string;
  user_id: string;
  title: string;
  body: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

const DegenindexPostSchema = new Schema<IDegenindexPost>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  image_url: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  is_deleted: { type: Boolean, required: true },
});

export const DegenindexPost = mongoose.model<IDegenindexPost>(
  "DegenindexPost",
  DegenindexPostSchema
);
