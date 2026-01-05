import mongoose, { Schema, Document } from "mongoose";

export enum SdCurrencyType {
  USD = "USD",
  EUR = "EUR",
}

export interface ILobbyParticipant extends Document {
  id: number;
  lobby_id: string;
  user_id: string;
  joined_at: Date;
  left_at?: Date;
  wager_amount: bigint;
  currency: SdCurrencyType;
  is_owner: boolean;
}

const LobbyParticipantSchema = new Schema<ILobbyParticipant>({
  id: { type: Number, required: true, unique: true },
  lobby_id: { type: String, required: true },
  user_id: { type: String, required: true },
  joined_at: { type: Date, required: true },
  left_at: { type: Date, required: false },
  wager_amount: { type: Schema.Types.Decimal128, required: true },
  currency: {
    type: String,
    enum: Object.values(SdCurrencyType),
    required: true,
  },
  is_owner: { type: Boolean, required: true },
});

export const LobbyParticipant = mongoose.model<ILobbyParticipant>(
  "LobbyParticipant",
  LobbyParticipantSchema
);
