import { Schema, model } from 'mongoose'

/**
 * A channel is a room in a server.
 * It is associated with a session.
 */
export interface Channel {
  id: string
  sessionId: string
}

export const ChannelSchema = new Schema<Channel>({
  id: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
})

export interface Server {
  _id: string
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
