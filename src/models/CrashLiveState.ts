import mongoose, { Schema, Document } from "mongoose";

export interface ICrashLiveState extends Document {
  game_round_id: string;
  user_id: string;
  joined_at: Date;
  cashed_out_at?: Date;
  cashout_multiplier_bps?: bigint;
}

const CrashLiveStateSchema = new Schema<ICrashLiveState>({
  game_round_id: { type: String, required: true },
  user_id: { type: String, required: true },
  joined_at: { type: Date, required: true },
  cashed_out_at: { type: Date, required: false },
  cashout_multiplier_bps: { type: Schema.Types.Decimal128, required: false },
});

CrashLiveStateSchema.index({ game_round_id: 1, user_id: 1 }, { unique: true });

export const CrashLiveState = mongoose.model<ICrashLiveState>(
  "CrashLiveState",
  CrashLiveStateSchema
);
