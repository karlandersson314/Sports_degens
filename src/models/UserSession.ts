import mongoose, { Schema, Document } from "mongoose";

export interface IUserSession extends Document {
  id: string;
  user_id: string;
  created_at: Date;
  last_seen_at: Date;
  ip_address: string;
  country_code: string;
  city: string;
  user_agent: string;
  is_vpn_suspected: boolean;
}

const UserSessionSchema = new Schema<IUserSession>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  created_at: { type: Date, required: true },
  last_seen_at: { type: Date, required: true },
  ip_address: { type: String, required: true },
  country_code: { type: String, required: true, maxlength: 2 },
  city: { type: String, required: true },
  user_agent: { type: String, required: true },
  is_vpn_suspected: { type: Boolean, required: true },
});

export const UserSession = mongoose.model<IUserSession>(
  "UserSession",
  UserSessionSchema
);
