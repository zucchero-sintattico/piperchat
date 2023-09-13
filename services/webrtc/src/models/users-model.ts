import { Schema, model } from 'mongoose'

export interface UserInFriendship {
  username: string
  socketId: string
}

export interface Friendship {
  _id: string
  user1: UserInFriendship
  user2: UserInFriendship
}

export const FriendshipSchema = new Schema<Friendship>({
  user1: {
    username: String,
    socketId: String,
  },
  user2: {
    username: String,
    socketId: String,
  },
})

export const Friendships = model<Friendship>('Friendships', FriendshipSchema)
