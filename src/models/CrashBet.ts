import mongoose, { Schema, Document } from "mongoose";

export interface ICrashBet extends Document {
  game_bet_id: string;
  cashout_multiplier_bps?: bigint;
  auto_cashout_bps?: bigint;
  strategy?: Record<string, any>;
}

const CrashBetSchema = new Schema<ICrashBet>({
  game_bet_id: { type: String, required: true, unique: true },
  cashout_multiplier_bps: { type: Schema.Types.Decimal128, required: false },
  auto_cashout_bps: { type: Schema.Types.Decimal128, required: false },
  strategy: { type: Schema.Types.Mixed, required: false },
});

export const CrashBet = mongoose.model<ICrashBet>("CrashBet", CrashBetSchema);
