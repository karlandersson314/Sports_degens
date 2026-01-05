import mongoose, { Schema, Document } from "mongoose";

export interface ISport extends Document {
  id: number;
  name: string;
  code: string;
}

const SportSchema = new Schema<ISport>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
});

export const Sport = mongoose.model<ISport>("Sport", SportSchema);
