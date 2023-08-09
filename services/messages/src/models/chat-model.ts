import { Schema, model } from "mongoose";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface Direct {
  id: string;
  partecipants: [string];
  messages: [Message];
}

export const MessageSchema = new Schema({
  id: String,
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export const DirectSchema = new Schema({
  id: String,
  partecipants: { type: [String], required: true, minlength: 2, maxlength: 2 },
  messages: { type: [MessageSchema], required: true, default: [] },
});

export const Directs = model<Message>("Directs", DirectSchema);
