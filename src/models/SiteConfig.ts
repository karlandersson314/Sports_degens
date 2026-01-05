import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  key: string;
  value: Record<string, any>;
  updated_at: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  updated_at: { type: Date, required: true },
});

export const SiteConfig = mongoose.model<ISiteConfig>(
  "SiteConfig",
  SiteConfigSchema
);
