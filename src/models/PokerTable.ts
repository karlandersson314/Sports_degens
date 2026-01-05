import mongoose, { Schema, Document } from "mongoose";

export interface IPokerTable extends Document {
  id: string;
  name: string;
  max_seats: number;
  is_cash_game: boolean;
  big_blind: bigint;
  created_at: Date;
}

const PokerTableSchema = new Schema<IPokerTable>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  max_seats: { type: Number, required: true },
  is_cash_game: { type: Boolean, required: true },
  big_blind: { type: Schema.Types.Decimal128, required: true },
  created_at: { type: Date, required: true },
});

export const PokerTable = mongoose.model<IPokerTable>(
  "PokerTable",
  PokerTableSchema
);
