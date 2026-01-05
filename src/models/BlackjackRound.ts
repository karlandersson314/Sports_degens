import mongoose, { Schema, Document } from "mongoose";

export interface IBlackjackRound extends Document {
  game_round_id: string;
  table_id: string;
  shoe_id: string;
  dealer_final_total: number;
  dealer_busted: boolean;
  dealer_hand_repr: string;
  created_at: Date;
}

const BlackjackRoundSchema = new Schema<IBlackjackRound>({
  game_round_id: { type: String, required: true, unique: true },
  table_id: { type: String, required: true },
  shoe_id: { type: String, required: true },
  dealer_final_total: { type: Number, required: true },
  dealer_busted: { type: Boolean, required: true },
  dealer_hand_repr: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const BlackjackRound = mongoose.model<IBlackjackRound>(
  "BlackjackRound",
  BlackjackRoundSchema
);
