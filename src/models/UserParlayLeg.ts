import mongoose, { Schema, Document } from "mongoose";

export interface IUserParlayLeg extends Document {
  id: number;
  user_parlay_id: string;
  selection_id: string;
  result: string;
  settled_at: Date;
}

const UserParlayLegSchema = new Schema<IUserParlayLeg>({
  id: { type: Number, required: true, unique: true },
  user_parlay_id: { type: String, required: true },
  selection_id: { type: String, required: true },
  result: { type: String, required: true },
  settled_at: { type: Date, required: true },
});

export const UserParlayLeg = mongoose.model<IUserParlayLeg>(
  "UserParlayLeg",
  UserParlayLegSchema
);
