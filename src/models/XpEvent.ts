import mongoose, { Schema, Document } from "mongoose";

export enum XpSource {
  // Add actual sources as needed
  SOURCE_A = "SOURCE_A",
  SOURCE_B = "SOURCE_B",
}

export interface IXpEvent extends Document {
  id: number;
  user_id: string;
  source: XpSource;
  amount: bigint;
  related_bet_id?: string;
  related_tool_subscription_id?: string;
  created_at: Date;
}

const XpEventSchema = new Schema<IXpEvent>({
  id: { type: Number, required: true, unique: true },
  user_id: { type: String, required: true },
  source: { type: String, enum: Object.values(XpSource), required: true },
  amount: { type: Schema.Types.Decimal128, required: true },
  related_bet_id: { type: String, required: false },
  related_tool_subscription_id: { type: String, required: false },
  created_at: { type: Date, required: true },
});

export const XpEvent = mongoose.model<IXpEvent>("XpEvent", XpEventSchema);
