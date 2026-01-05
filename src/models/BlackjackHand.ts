import mongoose, { Schema, Document } from "mongoose";

export enum BlackjackResult {
  WIN = "WIN",
  LOSE = "LOSE",
  PUSH = "PUSH",
  BLACKJACK = "BLACKJACK",
  BUST = "BUST",
  SURRENDER = "SURRENDER",
}

export interface IBlackjackHand extends Document {
  game_bet_id: string;
  seat_number: number;
  initial_two_cards: string;
  final_hand_repr: string;
  final_total: number;
  result: BlackjackResult;
  insurance_bet?: bigint;
  insurance_payout?: bigint;
}

const BlackjackHandSchema = new Schema<IBlackjackHand>({
  game_bet_id: { type: String, required: true, unique: true },
  seat_number: { type: Number, required: true },
  initial_two_cards: { type: String, required: true },
  final_hand_repr: { type: String, required: true },
  final_total: { type: Number, required: true },
  result: {
    type: String,
    enum: Object.values(BlackjackResult),
    required: true,
  },
  insurance_bet: { type: Schema.Types.Decimal128, required: false },
  insurance_payout: { type: Schema.Types.Decimal128, required: false },
});

export const BlackjackHand = mongoose.model<IBlackjackHand>(
  "BlackjackHand",
  BlackjackHandSchema
);
