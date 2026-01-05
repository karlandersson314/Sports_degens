import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  id: string;
  user_id: string;
  created_at: Date;
}

const WalletSchema = new Schema<IWallet>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
