import { Schema, model } from 'mongoose'

export interface User {
  username: string
  email: string
  password: string
  description: string
  profilePicture: Buffer
  createdAt: Date
  refreshToken: string
  friends: string[]
  friendsRequests: string[]
  pendingFriendsRequests: string[]
}

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    key: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  refreshToken: {
    type: String,
    default: '',
  },
  friends: [
    {
      type: String,
    },
  ],
  friendsRequests: [
    {
      type: String,
    },
  ],
  pendingFriendsRequests: [
    {
      type: String,
    },
  ],
})

export const Users = model<User>('User', UserSchema)
