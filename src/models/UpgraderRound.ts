import mongoose, { Schema, Document } from "mongoose";

export interface IUpgraderRound extends Document {
  game_round_id: string;
  created_at: Date;
}

const UpgraderRoundSchema = new Schema<IUpgraderRound>({
  game_round_id: { type: String, required: true, unique: true },
  created_at: { type: Date, required: true },
});

export const UpgraderRound = mongoose.model<IUpgraderRound>(
  "UpgraderRound",
  UpgraderRoundSchema
);
