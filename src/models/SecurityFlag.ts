import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityFlag extends Document {
  id: number;
  user_id: string;
  type: string;
  details: Record<string, any>;
  created_at: Date;
  resolved_at?: Date;
}

const SecurityFlagSchema = new Schema<ISecurityFlag>({
  id: { type: Number, required: true, unique: true },
  user_id: { type: String, required: true },
  type: { type: String, required: true },
  details: { type: Schema.Types.Mixed, required: true },
  created_at: { type: Date, required: true },
  resolved_at: { type: Date, required: false },
});

export const SecurityFlag = mongoose.model<ISecurityFlag>(
  "SecurityFlag",
  SecurityFlagSchema
);
