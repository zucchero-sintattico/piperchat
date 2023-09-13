import { Schema, model } from 'mongoose'

export interface UserInChannel {
  username: string
  socketId: string
}

export const UserInChannelSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
})

export interface Channel {
  id: string
  participants: UserInChannel[]
}

export const ChannelSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    auto: true,
  },
  participants: {
    type: [UserInChannelSchema],
    required: true,
    default: [],
  },
})

export interface Server {
  id: string
  participants: string[]
  channels: Channel[]
}

export const ServerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    auto: true,
  },
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
