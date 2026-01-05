import mongoose, { Schema, Document } from "mongoose";

export enum PokerResult {
  WIN = "WIN",
  LOSE = "LOSE",
  FOLD = "FOLD",
  TIE = "TIE",
}

export interface IPokerHand extends Document {
  game_bet_id: string;
  seat_number: number;
  hole_cards_repr: string;
  final_hand_rank: string;
  result: PokerResult;
}

const PokerHandSchema = new Schema<IPokerHand>({
  game_bet_id: { type: String, required: true, unique: true },
  seat_number: { type: Number, required: true },
  hole_cards_repr: { type: String, required: true },
  final_hand_rank: { type: String, required: true },
  result: { type: String, enum: Object.values(PokerResult), required: true },
});

export const PokerHand = mongoose.model<IPokerHand>(
  "PokerHand",
  PokerHandSchema
);
