import { Schema, model } from 'mongoose'

export interface User {
  username: string
  email: string
  password: string
  description: string
  profilePicture: Buffer
  createdAt: Date
  online: boolean
  lastActive: Date
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
    type: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
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
