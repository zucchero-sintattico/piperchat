import { Schema, model } from "mongoose";

export interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface Direct {
  _id: string;
  partecipants: [string];
  messages: [Message];
}

export interface MessageChannel {
  _id: string;
  id: string;
  messages: [Message];
}

export interface Server {
  _id: string;
  id: string;
  partecipants: [string];
  messagesChannels: [MessageChannel];
}

export const MessageSchema = new Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

export const DirectSchema = new Schema({
  partecipants: { type: [String], required: true, minlength: 2, maxlength: 2 },
  messages: { type: [MessageSchema], required: true, default: [] },
});

export const MessageChannelSchema = new Schema({
  id: { type: String, required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
});

export const ServerSchema = new Schema({
  id: { type: String, required: true },
  partecipants: { type: [String], required: true, minlength: 1 },
  messagesChannels: { type: [MessageChannelSchema], required: true, default: [] },
});

export const Directs = model<Message>("Directs", DirectSchema);
//export const MessageChannels = model<MessageChannel>("MessageChannels", MessageChannelSchema);
export const Servers = model<Server>("Servers", ServerSchema);