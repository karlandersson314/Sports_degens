import mongoose, { Schema, Document } from "mongoose";

export enum PaymentProvider {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface IDeposit extends Document {
  id: string;
  user_id: string;
  payment_method_id: string;
  provider: PaymentProvider;
  amount_cents: mongoose.Types.Decimal128;
  status: PaymentStatus;
  external_tx_id?: string;
  idempotency_key?: string;
  created_at: Date;
  completed_at?: Date;
  wallet_txn_id?: mongoose.Types.Decimal128;
}

const DepositSchema = new Schema<IDeposit>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  payment_method_id: { type: String, required: true },
  provider: {
    type: String,
    enum: Object.values(PaymentProvider),
    required: true,
  },
  amount_cents: { type: Schema.Types.Decimal128, required: true },
  status: { type: String, enum: Object.values(PaymentStatus), required: true },
  external_tx_id: { type: String, required: false },
  idempotency_key: { type: String, required: false },
  created_at: { type: Date, required: true },
  completed_at: { type: Date, required: false },
  wallet_txn_id: { type: Schema.Types.Decimal128, required: false },
});

export const Deposit = mongoose.model<IDeposit>("Deposit", DepositSchema);
