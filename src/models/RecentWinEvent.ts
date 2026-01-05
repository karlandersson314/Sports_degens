import mongoose, { Schema, Document } from "mongoose";

export enum CurrencyType {
  USD = "USD",
  EUR = "EUR",
}

export interface IRecentWinEvent extends Document {
  id: number;
  user_id: string;
  game_round_id: string;
  game_id: number;
  currency: CurrencyType;
  wager_amount: bigint;
  payout_amount: bigint;
  multiplier_bps: bigint;
  created_at: Date;
}

const RecentWinEventSchema = new Schema<IRecentWinEvent>({
  id: { type: Number, required: true, unique: true },
  user_id: { type: String, required: true },
  game_round_id: { type: String, required: true },
  game_id: { type: Number, required: true },
  currency: { type: String, enum: Object.values(CurrencyType), required: true },
  wager_amount: { type: Schema.Types.Decimal128, required: true },
  payout_amount: { type: Schema.Types.Decimal128, required: true },
  multiplier_bps: { type: Schema.Types.Decimal128, required: true },
  created_at: { type: Date, required: true },
});

export const RecentWinEvent = mongoose.model<IRecentWinEvent>(
  "RecentWinEvent",
  RecentWinEventSchema
);
