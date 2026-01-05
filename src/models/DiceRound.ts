import mongoose, { Schema, Document } from "mongoose";

export interface IDiceRound extends Document {
  game_round_id: string;
  roll_result: number;
  created_at: Date;
}

const DiceRoundSchema = new Schema<IDiceRound>({
  game_round_id: { type: String, required: true, unique: true },
  roll_result: { type: Number, required: true },
  created_at: { type: Date, required: true },
});

export const DiceRound = mongoose.model<IDiceRound>(
  "DiceRound",
  DiceRoundSchema
);
