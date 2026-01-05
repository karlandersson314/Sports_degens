import mongoose, { Schema, Document } from "mongoose";

export enum SdCurrencyType {
  // Add actual currency types as needed
  USD = "USD",
  EUR = "EUR",
}

export interface ILobby extends Document {
  id: string;
  game_id: number;
  created_by: string;
  created_at: Date;
  max_players: number;
  status: string;
  combined_wager: bigint;
  currency: SdCurrencyType;
  metadata: Record<string, any>;
}

const LobbySchema = new Schema<ILobby>({
  id: { type: String, required: true, unique: true },
  game_id: { type: Number, required: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, required: true },
  max_players: { type: Number, required: true },
  status: { type: String, required: true },
  combined_wager: { type: Schema.Types.Decimal128, required: true },
  currency: {
    type: String,
    enum: Object.values(SdCurrencyType),
    required: true,
  },
  metadata: { type: Schema.Types.Mixed, required: true },
});

export const Lobby = mongoose.model<ILobby>("Lobby", LobbySchema);
