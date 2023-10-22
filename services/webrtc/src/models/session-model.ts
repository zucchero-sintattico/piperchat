import { Schema, model } from 'mongoose'

export interface UserInSession {
  username: string
  socketId: string
}

export interface Session {
  id: string
  allowedUsers: string[]
  participants: string[]
}

export const SessionSchema = new Schema<Session>({
  allowedUsers: {
    type: [String],
    required: true,
  },
  participants: [String],
})

export const Sessions = model<Session>('Session', SessionSchema)
