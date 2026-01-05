import mongoose, { Schema, Document } from "mongoose";

export enum SdCurrencyType {
  USD = "USD",
  EUR = "EUR",
  GC = "GC", // Gold Coins (sweepstakes)
  DC = "DC", // Degen Cash
}

export enum SdTxnType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  BET = "BET",
  WIN = "WIN",
  LOSS = "LOSS",
  // Add more as needed
}

export interface IWalletTransaction extends Document {
  id: number;
  wallet_id: string;
  currency: SdCurrencyType;
  txn_type: SdTxnType;
  amount: mongoose.Types.Decimal128;
  balance_after: mongoose.Types.Decimal128;
  related_game_round_id?: string;
  related_bet_id?: string;
  related_tool_subscription_id?: string;
  related_affiliate_commission_id?: number;
  metadata?: Record<string, any>;
  created_at: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>({
  id: { type: Number, required: true, unique: true },
  wallet_id: { type: String, required: true },
  currency: {
    type: String,
    enum: Object.values(SdCurrencyType),
    required: true,
  },
  txn_type: { type: String, enum: Object.values(SdTxnType), required: true },
  amount: { type: Schema.Types.Decimal128, required: true },
  balance_after: { type: Schema.Types.Decimal128, required: true },
  related_game_round_id: { type: String, required: false },
  related_bet_id: { type: String, required: false },
  related_tool_subscription_id: { type: String, required: false },
  related_affiliate_commission_id: { type: Number, required: false },
  metadata: { type: Schema.Types.Mixed, required: false },
  created_at: { type: Date, required: true },
});

export const WalletTransaction = mongoose.model<IWalletTransaction>(
  "WalletTransaction",
  WalletTransactionSchema
);
