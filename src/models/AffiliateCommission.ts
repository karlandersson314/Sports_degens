import mongoose, { Schema, Document } from "mongoose";

export enum SdCurrencyType {
  USD = "USD",
  EUR = "EUR",
}

export interface IAffiliateCommission extends Document {
  id: number;
  affiliate_id: string;
  domain: string;
  user_id: string;
  casino_bet_id: string;
  tool_subscription_id: string;
  commission_amount: bigint;
  currency: SdCurrencyType;
  created_at: Date;
  paid_txn_id: number;
  is_paid: boolean;
}

const AffiliateCommissionSchema = new Schema<IAffiliateCommission>({
  id: { type: Number, required: true, unique: true },
  affiliate_id: { type: String, required: true },
  domain: { type: String, required: true },
  user_id: { type: String, required: true },
  casino_bet_id: { type: String, required: true },
  tool_subscription_id: { type: String, required: true },
  commission_amount: { type: Schema.Types.Decimal128, required: true },
  currency: {
    type: String,
    enum: Object.values(SdCurrencyType),
    required: true,
  },
  created_at: { type: Date, required: true },
  paid_txn_id: { type: Number, required: true },
  is_paid: { type: Boolean, required: true },
});

export const AffiliateCommission = mongoose.model<IAffiliateCommission>(
  "AffiliateCommission",
  AffiliateCommissionSchema
);
