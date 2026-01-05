import mongoose, { Schema, Document } from "mongoose";
import { OddsFormat } from "./OddsSnapshot";

/**
 * Archived OddsSnapshot records. We keep the exact same fields as OddsSnapshot
 * (no schema changes) and add a small archive timestamp.
 */
export interface IOddsSnapshotArchive extends Document {
  id: number;
  sportsbook_id: string;
  selection_id: string;
  odds_format: OddsFormat;
  odds_value: number;
  implied_prob: number;
  fetched_at: Date;
  archived_at: Date;
}

const OddsSnapshotArchiveSchema = new Schema<IOddsSnapshotArchive>({
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
  archived_at: { type: Date, required: true },
});

export const OddsSnapshotArchive = mongoose.model<IOddsSnapshotArchive>(
  "OddsSnapshotArchive",
  OddsSnapshotArchiveSchema
);
