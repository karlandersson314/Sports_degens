import mongoose, { Schema, Document } from "mongoose";

export interface IBlackjackTable extends Document {
  id: string;
  name: string;
  max_seats: number;
  created_at: Date;
  is_private: boolean;
}

const BlackjackTableSchema = new Schema<IBlackjackTable>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  max_seats: { type: Number, required: true },
  created_at: { type: Date, required: true },
  is_private: { type: Boolean, required: true },
});

export const BlackjackTable = mongoose.model<IBlackjackTable>(
  "BlackjackTable",
  BlackjackTableSchema
);
