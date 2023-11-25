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
    await Friendships.create({
      first,
      second,
      sessionId,
    })
  }

  async existsFriendship(first: string, second: string): Promise<boolean> {
    // Check if the friendship exists in both ways
    const firstToSecond = await Friendships.exists({
      first,
      second,
    })
    const secondToFirst = await Friendships.exists({
      first: second,
      second: first,
    })
    return firstToSecond !== null || secondToFirst !== null
  }

  async getFriendshipSessionId(first: string, second: string): Promise<string> {
    // Check if the friendship exists in both ways
    const firstToSecond = await Friendships.findOne({
      first,
      second,
    })
    const secondToFirst = await Friendships.findOne({
      first: second,
      second: first,
    })
    if (firstToSecond !== null) {
      return firstToSecond.sessionId
    } else if (secondToFirst !== null) {
      return secondToFirst.sessionId
    } else {
      throw new Error('Friendship not found')
    }
  }

  async setFriendshipSessionId(
    first: string,
    second: string,
    sessionId: string
  ): Promise<void> {
    // Check if the friendship exists in both ways
    const firstToSecond = await Friendships.findOne({
      first,
      second,
    })
    const secondToFirst = await Friendships.findOne({
      first: second,
      second: first,
    })
    if (firstToSecond !== null) {
      firstToSecond.sessionId = sessionId
      await firstToSecond.save()
    } else if (secondToFirst !== null) {
      secondToFirst.sessionId = sessionId
      await secondToFirst.save()
    } else {
      throw new Error('Friendship not found')
    }
  }
}
