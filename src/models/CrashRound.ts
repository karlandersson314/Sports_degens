import mongoose, { Schema, Document } from "mongoose";

export interface ICrashRound extends Document {
  game_round_id: string;
  crash_multiplier_bps: bigint;
  rng_seed_hash: string;
  created_at: Date;
}

const CrashRoundSchema = new Schema<ICrashRound>({
  game_round_id: { type: String, required: true, unique: true },
  crash_multiplier_bps: { type: Schema.Types.Decimal128, required: true },
  rng_seed_hash: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const CrashRound = mongoose.model<ICrashRound>(
  "CrashRound",
  CrashRoundSchema
);
