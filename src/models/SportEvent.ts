import mongoose, { Schema, Document } from "mongoose";

export interface ISportEvent extends Document {
  id: string;
  sport_id: number;
  league_code: string;
  home_team_id: string;
  away_team_id: string;
  starts_at: Date;
  status: string;
  external_ref: string;
}

const SportEventSchema = new Schema<ISportEvent>({
  id: { type: String, required: true, unique: true },
  sport_id: { type: Number, required: true },
  league_code: { type: String, required: true },
  home_team_id: { type: String, required: true },
  away_team_id: { type: String, required: true },
  starts_at: { type: Date, required: true },
  status: { type: String, required: true },
  external_ref: { type: String, required: true },
});

export const SportEvent = mongoose.model<ISportEvent>(
  "SportEvent",
  SportEventSchema
);
