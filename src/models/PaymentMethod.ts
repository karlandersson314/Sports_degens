import mongoose, { Schema, Document } from "mongoose";

export enum PaymentProvider {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
  // Add more as needed
}

export interface IPaymentMethod extends Document {
  id: string;
  user_id: string;
  provider: PaymentProvider;
  type: string;
  last4: string;
  external_ref: string;
  created_at: Date;
  is_default: boolean;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  provider: {
    type: String,
    enum: Object.values(PaymentProvider),
    required: true,
  },
  type: { type: String, required: true },
  last4: { type: String, required: true, maxlength: 4 },
  external_ref: { type: String, required: true },
  created_at: { type: Date, required: true },
  is_default: { type: Boolean, required: true },
});

export const PaymentMethod = mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  PaymentMethodSchema
);
