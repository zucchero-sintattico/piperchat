import { Schema, model } from "mongoose";

export interface MessageChannel {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

export const MessageChannelSchema = new Schema<MessageChannel>({
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
  description: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
