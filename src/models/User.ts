import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  discordId?: string;
  googleId?: string;
  steamId?: string;
  level: number;
  xp: number;
  totalWagered: number;
  rakebackBalance: number;
  goldCoins: number;
  degenCash: number;
  hasToolsAccess: boolean;
  toolsSubscriptionExpiry?: Date;
  stripeCustomerId?: string;
  affiliateCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: function(this: IUser) {
        // Password not required if OAuth login
        return !this.discordId && !this.googleId && !this.steamId;
      },
    },
    discordId: String,
    googleId: String,
    steamId: String,
    level: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    totalWagered: {
      type: Number,
      default: 0,
    },
    rakebackBalance: {
      type: Number,
      default: 0,
    },
    goldCoins: {
      type: Number,
      default: 0,
    },
    degenCash: {
      type: Number,
      default: 0,
    },
    hasToolsAccess: {
      type: Boolean,
      default: false,
    },
    toolsSubscriptionExpiry: Date,
    stripeCustomerId: String,
    affiliateCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

