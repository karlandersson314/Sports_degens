import mongoose, { Schema, Document } from "mongoose";

export interface IChatRoom extends Document {
  id: string;
  name: string;
  created_at: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  created_at: { type: Date, required: true },
});

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
