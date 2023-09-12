import { Schema, model } from 'mongoose'

export interface User {
  username: string
  friends: string[]
}

export const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    key: true,
  },
  friends: [
    {
      type: String,
      default: [],
    },
  ],
})

export const Users = model<User>('User', UserSchema)
