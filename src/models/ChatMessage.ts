import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  id: number;
  room_id: string;
  user_id: string;
  message: string;
  created_at: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  id: { type: Number, required: true, unique: true },
  room_id: { type: String, required: true },
  user_id: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
