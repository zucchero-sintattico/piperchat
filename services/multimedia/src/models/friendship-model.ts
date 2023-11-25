import { Schema, model } from 'mongoose'

/**
 * A friendship is a relationship between two users.
 * A friendship is created when two users add each other as friends.
 * It map the relationship to a sessionId
 */
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
