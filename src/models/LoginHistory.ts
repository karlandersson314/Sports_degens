import mongoose, { Schema, Document } from "mongoose";

export interface ILoginHistory extends Document {
  id: number;
  user_id: string;
  logged_in_at: Date;
  ip_address: string;
  user_agent: string;
}

const LoginHistorySchema = new Schema<ILoginHistory>({
  id: { type: Number, required: true, unique: true },
  user_id: { type: String, required: true },
  logged_in_at: { type: Date, required: true },
  ip_address: { type: String, required: true },
  user_agent: { type: String, required: true },
});

export const LoginHistory = mongoose.model<ILoginHistory>(
  "LoginHistory",
  LoginHistorySchema
);
