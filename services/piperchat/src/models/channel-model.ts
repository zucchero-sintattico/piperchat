import { Schema } from "mongoose";

export interface Channel {
  _id: string;
  name: string;
  createdAt: Date;
  channelType: string;
  description?: string;
}

export const ChannelSchema = new Schema<Channel>({
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
