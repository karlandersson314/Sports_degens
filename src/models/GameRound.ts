import mongoose, { Schema, Document } from "mongoose";

export interface IGameRound extends Document {
  id: string;
  game_id: number;
  lobby_id: string;
  round_number: bigint;
  started_at: Date;
  ended_at?: Date;
  outcome_data: Record<string, any>;
  house_edge_bps: number;
  is_archived: boolean;
}

const GameRoundSchema = new Schema<IGameRound>({
  id: { type: String, required: true, unique: true },
  game_id: { type: Number, required: true },
  lobby_id: { type: String, required: true },
  round_number: { type: Schema.Types.Decimal128, required: true },
  started_at: { type: Date, required: true },
  ended_at: { type: Date, required: false },
  outcome_data: { type: Schema.Types.Mixed, required: true },
  house_edge_bps: { type: Number, required: true },
  is_archived: { type: Boolean, required: true },
});

export const GameRound = mongoose.model<IGameRound>(
  "GameRound",
  GameRoundSchema
);
