import { Session, Sessions } from '@/models/session-model'

export interface SessionRepository {
  createSession(allowedUsers: string[]): Promise<string>
  getSession(sessionId: string): Promise<Session>
  addAllowedUserToSession(sessionId: string, username: string): Promise<void>
  removeAllowedUserFromSession(sessionId: string, username: string): Promise<void>
  addUserToSession(sessionId: string, username: string): Promise<void>
  removeUserFromSession(sessionId: string, username: string): Promise<void>
  getUserInSession(sessionId: string, username: string): Promise<string>
}

export class SessionRepositoryImpl implements SessionRepository {
  async createSession(allowedUsers: string[]): Promise<string> {
    const session = new Sessions({
      allowedUsers,
      participants: [],
    })
    await session.save()
    return session.id
  }

  async getSession(sessionId: string): Promise<Session> {
    return await Sessions.findById(sessionId).orFail()
  }

  async addAllowedUserToSession(sessionId: string, username: string): Promise<void> {
    await Sessions.updateOne({ id: sessionId }, { $addToSet: { allowedUsers: username } })
  }

  async removeAllowedUserFromSession(sessionId: string, username: string): Promise<void> {
    await Sessions.updateOne({ id: sessionId }, { $pull: { allowedUsers: username } })
  }

  async addUserToSession(sessionId: string, username: string): Promise<void> {
    const session = await Sessions.findById(sessionId).orFail()
    session.participants.push(username)
    await session.save()
  }

  async removeUserFromSession(sessionId: string, username: string): Promise<void> {
    await Sessions.updateOne({ id: sessionId }, { $pull: { participants: { username } } })
  }

  async getUserInSession(sessionId: string, username: string): Promise<string> {
    const session = await Sessions.findById(sessionId).orFail()
    return session.participants.find((p) => p === username)!
  }
}
