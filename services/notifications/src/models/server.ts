import { Schema, model } from 'mongoose'

export interface Channel {
  _id: string
  channelType: string
}

export const ChannelSchema = new Schema<Channel>({
  channelType: {
    type: String,
    required: true,
  },
})

export interface Server {
  _id: string
  owner: string
  participants: string[]
  channels: Channel[]
}

export const ServerSchema = new Schema<Server>({
  owner: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  channels: {
    type: [ChannelSchema],
    required: true,
    default: [],
  },
})

export const Servers = model<Server>('Server', ServerSchema)
