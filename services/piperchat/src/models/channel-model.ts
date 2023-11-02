import { Schema } from 'mongoose'

export interface Channel {
  id: string
  name: string
  createdAt: Date
  channelType: 'messages' | 'multimedia'
  description?: string
}

export const ChannelSchema = new Schema<Channel>({
  name: {
    type: String,
    required: true,
  },
  channelType: {
    type: String,
    required: true,
    enum: ['messages', 'multimedia'],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
})

ChannelSchema.set('toJSON', {
  virtuals: true,
})
