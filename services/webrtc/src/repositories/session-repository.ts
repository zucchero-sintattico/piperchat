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
    const session = await Sessions.create({
      allowedUsers,
      participants: [],
    })
    return session.id
  }

  async getSession(sessionId: string): Promise<Session> {
    return await Sessions.findById(sessionId).orFail()
  }

  async addAllowedUserToSession(sessionId: string, username: string): Promise<void> {
    await Sessions.findByIdAndUpdate(sessionId, {
      $addToSet: { allowedUsers: username },
    }).orFail()
  }

  async removeAllowedUserFromSession(sessionId: string, username: string): Promise<void> {
    await Sessions.findByIdAndUpdate(sessionId, {
      $pull: { allowedUsers: username },
    }).orFail()
  }

  async addUserToSession(sessionId: string, username: string): Promise<void> {
    await Sessions.findByIdAndUpdate(sessionId, {
      $addToSet: { participants: username },
    }).orFail()
  }

  async removeUserFromSession(sessionId: string, username: string): Promise<void> {
    await Sessions.findByIdAndUpdate(sessionId, {
      $pull: { participants: username },
    }).orFail()
  }

  async getUserInSession(sessionId: string, username: string): Promise<string> {
    const session = await Sessions.findById(sessionId).orFail()
    return session.participants.find((p) => p === username)!
  }
}
