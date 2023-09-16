import { Schema, model } from 'mongoose'

export interface Channel {
  id: string
  channelType: string
}

export const ChannelSchema = new Schema<Channel>({
  channelType: {
    type: String,
    required: true,
  },
})

ChannelSchema.set('toJSON', {
  virtuals: true,
})

export interface Server {
  id: string
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

ServerSchema.set('toJSON', {
  virtuals: true,
})

export const Servers = model<Server>('Server', ServerSchema)
