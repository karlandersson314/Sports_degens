import mongoose, { Schema, Document } from "mongoose";

export interface INewsItem extends Document {
  id: number;
  sport_id: number;
  player_id: string;
  team_id: string;
  headline: string;
  body: string;
  source_name: string;
  source_url: string;
  published_at: Date;
  fetched_at: Date;
}

const NewsItemSchema = new Schema<INewsItem>({
  id: { type: Number, required: true, unique: true },
  sport_id: { type: Number, required: true },
  player_id: { type: String, required: true },
  team_id: { type: String, required: true },
  headline: { type: String, required: true },
  body: { type: String, required: true },
  source_name: { type: String, required: true },
  source_url: { type: String, required: true },
  published_at: { type: Date, required: true },
  fetched_at: { type: Date, required: true },
});

export const NewsItem = mongoose.model<INewsItem>("NewsItem", NewsItemSchema);
