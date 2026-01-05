import mongoose, { Schema, Document } from "mongoose";

export interface ISportsbook extends Document {
  id: string;
  name: string;
  code: string;
  base_url: string;
}

const SportsbookSchema = new Schema<ISportsbook>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  base_url: { type: String, required: true },
});

export const Sportsbook = mongoose.model<ISportsbook>(
  "Sportsbook",
  SportsbookSchema
);
