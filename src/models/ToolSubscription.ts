import mongoose, { Schema, Document } from "mongoose";

export interface IToolSubscription extends Document {
  id: string;
  user_id: string;
  plan_id: number;
  started_at: Date;
  expires_at: Date;
  canceled_at?: Date;
  is_active: boolean;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

const ToolSubscriptionSchema = new Schema<IToolSubscription>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  plan_id: { type: Number, required: true },
  started_at: { type: Date, required: true },
  expires_at: { type: Date, required: true },
  canceled_at: { type: Date, required: false },
  is_active: { type: Boolean, required: true },
  stripe_customer_id: { type: String, required: false },
  stripe_subscription_id: { type: String, required: false },
});

export const ToolSubscription = mongoose.model<IToolSubscription>(
  "ToolSubscription",
  ToolSubscriptionSchema
);
