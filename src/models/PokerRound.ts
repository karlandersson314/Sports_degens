import mongoose, { Schema, Document } from "mongoose";

export interface IPokerRound extends Document {
  game_round_id: string;
  table_id: string;
  hand_number: bigint;
  board_repr: string;
  pot_size: bigint;
  created_at: Date;
}

const PokerRoundSchema = new Schema<IPokerRound>({
  game_round_id: { type: String, required: true, unique: true },
  table_id: { type: String, required: true },
  hand_number: { type: Schema.Types.Decimal128, required: true },
  board_repr: { type: String, required: true },
  pot_size: { type: Schema.Types.Decimal128, required: true },
  created_at: { type: Date, required: true },
});

export const PokerRound = mongoose.model<IPokerRound>(
  "PokerRound",
  PokerRoundSchema
);
