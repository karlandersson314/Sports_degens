import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  id: string;
  sport_id: number;
  team_id: string;
  name: string;
  external_ref: string;
}

const PlayerSchema = new Schema<IPlayer>({
  id: { type: String, required: true, unique: true },
  sport_id: { type: Number, required: true },
  team_id: { type: String, required: true },
  name: { type: String, required: true },
  external_ref: { type: String, required: true },
});

export const Player = mongoose.model<IPlayer>("Player", PlayerSchema);
