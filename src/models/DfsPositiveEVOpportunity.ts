import mongoose, { Schema, Document } from "mongoose";

export interface IDfsPositiveEVOpportunity extends Document {
  id: number;
  slip_type_id: number;
  selection_id: string;
  leg_win_prob: number;
  edge_percent: number;
  created_at: Date;
}

const DfsPositiveEVOpportunitySchema = new Schema<IDfsPositiveEVOpportunity>({
  id: { type: Number, required: true, unique: true },
  slip_type_id: { type: Number, required: true },
  selection_id: { type: String, required: true },
  leg_win_prob: { type: Number, required: true },
  edge_percent: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const DfsPositiveEVOpportunity =
  mongoose.model<IDfsPositiveEVOpportunity>(
    "DfsPositiveEVOpportunity",
    DfsPositiveEVOpportunitySchema
  );
