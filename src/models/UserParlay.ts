import mongoose, { Schema, Document } from "mongoose";

export interface IUserParlay extends Document {
  id: string;
  user_id: string;
  parlay_recommendation_id: string;
  sportsbook_id: string;
  stake_amount: mongoose.Types.Decimal128;
  potential_payout: mongoose.Types.Decimal128;
  placed_at: Date;
  settled_at: Date;
  status: string;
}

const UserParlaySchema = new Schema<IUserParlay>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  parlay_recommendation_id: { type: String, required: true },
  sportsbook_id: { type: String, required: true },
  stake_amount: { type: Schema.Types.Decimal128, required: true },
  potential_payout: { type: Schema.Types.Decimal128, required: true },
  placed_at: { type: Date, required: true },
  settled_at: { type: Date, required: true },
  status: { type: String, required: true },
});

export const UserParlay = mongoose.model<IUserParlay>(
  "UserParlay",
  UserParlaySchema
);
