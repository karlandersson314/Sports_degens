import mongoose, { Schema, Document } from "mongoose";

export interface ICaptchaChallenge extends Document {
  id: number;
  user_id?: string;
  session_id: string;
  prompt: string;
  answer_hash: string;
  created_at: Date;
  expires_at: Date;
  attempts: number;
  solved_at?: Date;
  success: boolean;
}

const CaptchaChallengeSchema = new Schema<ICaptchaChallenge>({
  id: { type: Number, required: true, unique: true },
  user_id: { type: String, required: false },
  session_id: { type: String, required: true },
  prompt: { type: String, required: true },
  answer_hash: { type: String, required: true },
  created_at: { type: Date, required: true },
  expires_at: { type: Date, required: true },
  attempts: { type: Number, required: true, default: 0 },
  solved_at: { type: Date, required: false },
  success: { type: Boolean, required: true },
});

export const CaptchaChallenge = mongoose.model<ICaptchaChallenge>(
  "CaptchaChallenge",
  CaptchaChallengeSchema
);
