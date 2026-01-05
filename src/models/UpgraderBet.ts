import mongoose, { Schema, Document } from "mongoose";

export interface IUpgraderBet extends Document {
  game_bet_id: string;
  base_item_id: string;
  target_item_id: string;
  win_chance_bps: number;
  won: boolean;
}

const UpgraderBetSchema = new Schema<IUpgraderBet>({
  game_bet_id: { type: String, required: true, unique: true },
  base_item_id: { type: String, required: true },
  target_item_id: { type: String, required: true },
  win_chance_bps: { type: Number, required: true },
  won: { type: Boolean, required: true },
});

export const UpgraderBet = mongoose.model<IUpgraderBet>(
  "UpgraderBet",
  UpgraderBetSchema
);
