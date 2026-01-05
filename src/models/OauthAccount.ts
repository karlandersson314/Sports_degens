import mongoose, { Schema, Document } from "mongoose";

export enum OauthProvider {
  GOOGLE = "GOOGLE",
  DISCORD = "DISCORD",
  // Add more as needed
}

export interface IOauthAccount extends Document {
  id: string;
  user_id: string;
  provider: OauthProvider;
  provider_user_id: string;
  created_at: Date;
}

const OauthAccountSchema = new Schema<IOauthAccount>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  provider: {
    type: String,
    enum: Object.values(OauthProvider),
    required: true,
  },
  provider_user_id: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const OauthAccount = mongoose.model<IOauthAccount>(
  "OauthAccount",
  OauthAccountSchema
);
