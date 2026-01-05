import mongoose, { Schema, Document } from "mongoose";

export enum AdminRole {
  // Add actual roles as needed
  SUPERADMIN = "SUPERADMIN",
  MODERATOR = "MODERATOR",
}

export interface IAdminUser extends Document {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: Date;
  active: boolean;
}

const AdminUserSchema = new Schema<IAdminUser>({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  role: { type: String, enum: Object.values(AdminRole), required: true },
  created_at: { type: Date, required: true },
  active: { type: Boolean, required: true },
});

export const AdminUser = mongoose.model<IAdminUser>(
  "AdminUser",
  AdminUserSchema
);
