import { Friendships } from '@/models/friendship-model'

export interface FriendshipRepository {
  createFriendship(first: string, second: string, sessionId: string): Promise<void>
  existsFriendship(first: string, second: string): Promise<boolean>
  getFriendshipSessionId(first: string, second: string): Promise<string>
  setFriendshipSessionId(first: string, second: string, sessionId: string): Promise<void>
}

export class FriendshipRepositoryImpl implements FriendshipRepository {
  async createFriendship(
    first: string,
    second: string,
    sessionId: string
  ): Promise<void> {
    const friendship = new Friendships({
      first,
      second,
      sessionId,
    })
    await friendship.save()
  }

  async existsFriendship(first: string, second: string): Promise<boolean> {
    const friendship = await Friendships.findOne({
      first,
      second,
    })
    return friendship !== null
  }

  async getFriendshipSessionId(first: string, second: string): Promise<string> {
    const friendship = await Friendships.findOne({
      first,
      second,
    }).orFail()
    return friendship.sessionId
  }

  async setFriendshipSessionId(
    first: string,
    second: string,
    sessionId: string
  ): Promise<void> {
    const friendship = await Friendships.findOne({
      first,
      second,
    }).orFail()
    friendship.sessionId = sessionId
    await friendship.save()
  }
}
