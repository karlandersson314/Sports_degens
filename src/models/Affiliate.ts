import mongoose, { Schema, Document } from "mongoose";

export enum AffiliateType {
  // Add actual types as needed
  TYPE_A = "TYPE_A",
  TYPE_B = "TYPE_B",
}

export interface IAffiliate extends Document {
  id: string;
  user_id: string;
  code: string;
  type: AffiliateType;
  domain: string;
  commission_rate_bps: number;
  created_at: Date;
  active: boolean;
}

const AffiliateSchema = new Schema<IAffiliate>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  code: { type: String, required: true, maxlength: 32 },
  type: { type: String, enum: Object.values(AffiliateType), required: true },
  domain: { type: String, required: true },
  commission_rate_bps: { type: Number, required: true },
  created_at: { type: Date, required: true },
  active: { type: Boolean, required: true },
});

export const Affiliate = mongoose.model<IAffiliate>(
  "Affiliate",
  AffiliateSchema
);
