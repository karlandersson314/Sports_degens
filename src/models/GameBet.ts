import mongoose, { Schema, Document } from "mongoose";

export enum SdCurrencyType {
  USD = "USD",
  EUR = "EUR",
}

export interface IGameBet extends Document {
  id: string;
  game_round_id: string;
  user_id: string;
  wallet_id: string;
  currency: SdCurrencyType;
  wager_amount: bigint;
  payout_amount: bigint;
  net_result: bigint;
  parameters: Record<string, any>;
  created_at: Date;
  settled_at: Date;
  updated_at: Date;
}

const GameBetSchema = new Schema<IGameBet>({
  id: { type: String, required: true, unique: true },
  game_round_id: { type: String, required: true },
  user_id: { type: String, required: true },
  wallet_id: { type: String, required: true },
  currency: {
    type: String,
    enum: Object.values(SdCurrencyType),
    required: true,
  },
  wager_amount: { type: Schema.Types.Decimal128, required: true },
  payout_amount: { type: Schema.Types.Decimal128, required: true },
  net_result: { type: Schema.Types.Decimal128, required: true },
  parameters: { type: Schema.Types.Mixed, required: true },
  created_at: { type: Date, required: true },
  settled_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const GameBet = mongoose.model<IGameBet>("GameBet", GameBetSchema);
