import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  id: string;
  sport_id: number;
  name: string;
  abbreviation: string;
  external_ref: string;
}

const TeamSchema = new Schema<ITeam>({
  id: { type: String, required: true, unique: true },
  sport_id: { type: Number, required: true },
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  external_ref: { type: String, required: true },
});

export const Team = mongoose.model<ITeam>("Team", TeamSchema);
