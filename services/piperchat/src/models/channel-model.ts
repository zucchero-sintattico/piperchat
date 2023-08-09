import { Schema, model } from "mongoose";

export interface Channel {
  id: number;
  name: string;
  createdAt: Date;
  channelType: string;
  description?: string;
}

export const ChannelSchema = new Schema<Channel>({
  id: {
    type: Number,
    required: true,
    unique: true,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  channelType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});
