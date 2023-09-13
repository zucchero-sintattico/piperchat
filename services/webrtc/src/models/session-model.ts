import { Schema, model } from 'mongoose'

export interface UserInSession {
  username: string
  socketId: string
}

const UserInSessionSchema = new Schema<UserInSession>({
  username: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
})

export interface Session {
  id: string
  allowedUsers: string[]
  participants: UserInSession[]
}

export const SessionSchema = new Schema<Session>({
  id: {
    type: String,
    required: true,
    unique: true,
    auto: true,
  },
  allowedUsers: {
    type: [String],
    required: true,
  },
  participants: [UserInSessionSchema],
})

export const Sessions = model<Session>('Session', SessionSchema)
