import mongoose, { Schema, Document } from "mongoose";

export interface IToolPlan extends Document {
  id: number;
  name: string;
  price_cents: number;
  billing_interval: string;
  active: boolean;
}

const ToolPlanSchema = new Schema<IToolPlan>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price_cents: { type: Number, required: true },
  billing_interval: { type: String, required: true },
  active: { type: Boolean, required: true },
});

export const ToolPlan = mongoose.model<IToolPlan>("ToolPlan", ToolPlanSchema);
