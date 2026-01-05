import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  id: number;
  code: string;
  name: string;
}

const GameSchema = new Schema<IGame>({
  id: { type: Number, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
});

export const Game = mongoose.model<IGame>("Game", GameSchema);
