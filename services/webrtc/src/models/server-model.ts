import { Schema, model } from 'mongoose'

export interface Channel {
  id: string
  sessionId: string
}

export const ChannelSchema = new Schema<Channel>({
  sessionId: {
    type: String,
    required: true,
  },
})

export interface Server {
  id: string
  participants: string[]
  channels: Channel[]
}

export const ServerSchema = new Schema<Server>({
  participants: {
    type: [String],
    required: true,
    default: [],
  },
  channels: {
    type: [ChannelSchema],
    required: true,
    default: [],
  },
})

export const Servers = model<Server>('Server', ServerSchema)
