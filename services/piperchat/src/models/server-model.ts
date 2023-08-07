import { Schema, model } from "mongoose";
import { MessageChannel, MessageChannelSchema } from "./message-channel-model";
import {
  MultimediaChannel,
  MultimediaChannelSchema,
} from "./multimedia-channel-model";

export interface Server {
  id: number;
  name: string;
  description: string;
  owner: string;
  participants: string[];
  createdAt: Date;
  messageChannels: MessageChannel[];
  multimediaChannels: MultimediaChannel[];
}

export const ServerSchema = new Schema<Server>({
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
  },
  owner: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messageChannels: {
    type: [MessageChannelSchema],
    required: false,
    default: [],
  },
  multimediaChannels: {
    type: [MultimediaChannelSchema],
    required: false,
    default: [],
  },
});

export const Servers = model<Server>("Server", ServerSchema);
