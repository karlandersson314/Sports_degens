import mongoose, { Schema, Document } from "mongoose";

export enum DiceBetType {
  OVER = "OVER",
  UNDER = "UNDER",
}

export interface IDiceBet extends Document {
  game_bet_id: string;
  bet_type: DiceBetType;
  target_value: number;
  win_chance_bps: number;
  payout_multiplier_bps: bigint;
}

const DiceBetSchema = new Schema<IDiceBet>({
  game_bet_id: { type: String, required: true, unique: true },
  bet_type: { type: String, enum: Object.values(DiceBetType), required: true },
  target_value: { type: Number, required: true },
  win_chance_bps: { type: Number, required: true },
  payout_multiplier_bps: { type: Schema.Types.Decimal128, required: true },
});

export const DiceBet = mongoose.model<IDiceBet>("DiceBet", DiceBetSchema);
