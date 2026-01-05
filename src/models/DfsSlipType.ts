import mongoose, { Schema, Document } from "mongoose";

export interface IDfsSlipType extends Document {
  id: number;
  platform: string;
  code: string;
  legs_count: number;
  break_even_prob: number;
}

const DfsSlipTypeSchema = new Schema<IDfsSlipType>({
  id: { type: Number, required: true, unique: true },
  platform: { type: String, required: true },
  code: { type: String, required: true },
  legs_count: { type: Number, required: true },
  break_even_prob: { type: Number, required: true },
});

export const DfsSlipType = mongoose.model<IDfsSlipType>(
  "DfsSlipType",
  DfsSlipTypeSchema
);
