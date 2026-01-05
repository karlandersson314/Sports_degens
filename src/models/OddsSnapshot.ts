import mongoose, { Schema, Document } from "mongoose";

export enum OddsFormat {
  DECIMAL = "DECIMAL",
  FRACTIONAL = "FRACTIONAL",
  AMERICAN = "AMERICAN",
}

export interface IOddsSnapshot extends Document {
  id: number;
  sportsbook_id: string;
  selection_id: string;
  odds_format: OddsFormat;
  odds_value: number;
  implied_prob: number;
  fetched_at: Date;
}

const OddsSnapshotSchema = new Schema<IOddsSnapshot>({
  id: { type: Number, required: true, unique: true },
  sportsbook_id: { type: String, required: true },
  selection_id: { type: String, required: true },
  odds_format: {
    type: String,
    enum: Object.values(OddsFormat),
    required: true,
  },
  odds_value: { type: Number, required: true },
  implied_prob: { type: Number, required: true },
  fetched_at: { type: Date, required: true },
});

export const OddsSnapshot = mongoose.model<IOddsSnapshot>(
  "OddsSnapshot",
  OddsSnapshotSchema
);
