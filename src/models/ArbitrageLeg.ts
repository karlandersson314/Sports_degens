import mongoose, { Schema, Document } from "mongoose";

export interface IArbitrageLeg extends Document {
  id: number;
  arbitrage_id: number;
  selection_id: string;
  sportsbook_id: string;
  odds_snapshot_id: number;
  recommended_stake_ratio: number;
}

const ArbitrageLegSchema = new Schema<IArbitrageLeg>({
  id: { type: Number, required: true, unique: true },
  arbitrage_id: { type: Number, required: true },
  selection_id: { type: String, required: true },
  sportsbook_id: { type: String, required: true },
  odds_snapshot_id: { type: Number, required: true },
  recommended_stake_ratio: { type: Number, required: true },
});

export const ArbitrageLeg = mongoose.model<IArbitrageLeg>(
  "ArbitrageLeg",
  ArbitrageLegSchema
);
