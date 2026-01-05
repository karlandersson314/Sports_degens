import mongoose, { Schema, Document } from "mongoose";

export interface IExternalSportsBet extends Document {
  id: string;
  user_id: string;
  sportsbook_id: string;
  stake_amount: mongoose.Types.Decimal128;
  payout_amount: mongoose.Types.Decimal128;
  result: string;
  placed_at: Date;
  settled_at: Date;
  metadata: Record<string, any>;
}

const ExternalSportsBetSchema = new Schema<IExternalSportsBet>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  sportsbook_id: { type: String, required: true },
  stake_amount: { type: Schema.Types.Decimal128, required: true },
  payout_amount: { type: Schema.Types.Decimal128, required: true },
  result: { type: String, required: true },
  placed_at: { type: Date, required: true },
  settled_at: { type: Date, required: true },
  metadata: { type: Schema.Types.Mixed, required: true },
});

export const ExternalSportsBet = mongoose.model<IExternalSportsBet>(
  "ExternalSportsBet",
  ExternalSportsBetSchema
);
