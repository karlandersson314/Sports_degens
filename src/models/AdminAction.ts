import mongoose, { Schema, Document } from "mongoose";

export interface IAdminAction extends Document {
  id: number;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: Record<string, any>;
  created_at: Date;
}

const AdminActionSchema = new Schema<IAdminAction>({
  id: { type: Number, required: true, unique: true },
  admin_id: { type: String, required: true },
  action_type: { type: String, required: true },
  target_type: { type: String, required: true },
  target_id: { type: String, required: true },
  details: { type: Schema.Types.Mixed, required: true },
  created_at: { type: Date, required: true },
});

export const AdminAction = mongoose.model<IAdminAction>(
  "AdminAction",
  AdminActionSchema
);
