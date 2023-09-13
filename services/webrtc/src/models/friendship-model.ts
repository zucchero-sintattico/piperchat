import { Schema, model } from 'mongoose'

export interface Friendship {
  first: string
  second: string
  sessionId: string
}

export const FriendshipSchema = new Schema<Friendship>({
  first: {
    type: String,
    required: true,
  },
  second: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
})

export const Friendships = model<Friendship>('Friendships', FriendshipSchema)
