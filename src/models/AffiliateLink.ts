import mongoose, { Schema, Document } from "mongoose";

export interface IAffiliateLink extends Document {
  id: number;
  referred_user_id: string;
  affiliate_id: string;
  valid_from: Date;
  valid_until: Date;
  created_at: Date;
}

const AffiliateLinkSchema = new Schema<IAffiliateLink>({
  id: { type: Number, required: true, unique: true },
  referred_user_id: { type: String, required: true },
  affiliate_id: { type: String, required: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  created_at: { type: Date, required: true },
});

export const AffiliateLink = mongoose.model<IAffiliateLink>(
  "AffiliateLink",
  AffiliateLinkSchema
);
