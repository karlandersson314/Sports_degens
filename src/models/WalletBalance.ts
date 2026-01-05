import mongoose, { Schema, Document } from "mongoose";

export interface IWalletBalance extends Document {
  wallet_id: string;
  gc_balance: mongoose.Types.Decimal128;
  dc_balance: mongoose.Types.Decimal128;
  rakeback_balance: mongoose.Types.Decimal128;
  locked_gc_balance: mongoose.Types.Decimal128;
  locked_dc_balance: mongoose.Types.Decimal128;
  updated_at: Date;
}

const WalletBalanceSchema = new Schema<IWalletBalance>({
  wallet_id: { type: String, required: true, unique: true },
  gc_balance: { type: Schema.Types.Decimal128, required: true },
  dc_balance: { type: Schema.Types.Decimal128, required: true },
  rakeback_balance: { type: Schema.Types.Decimal128, required: true },
  locked_gc_balance: {
    type: Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  locked_dc_balance: {
    type: Schema.Types.Decimal128,
    required: true,
    default: 0,
  },
  updated_at: { type: Date, required: true },
});

export const WalletBalance = mongoose.model<IWalletBalance>(
  "WalletBalance",
  WalletBalanceSchema
);
