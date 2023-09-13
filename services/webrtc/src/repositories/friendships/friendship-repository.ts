import { Friendship, Friendships, UserInFriendship } from '@/models/users-model'

export interface FriendshipRepository {
  removeSocketIdFromFriendship(myUsername: string, friendUsername: string): Promise<void>
  getFriendship(myUsername: string, friendUsername: string): Promise<Friendship>
  addSocketIdToFriendship(
    myUsername: string,
    friendUsername: string,
    id: string
  ): Promise<void>
  getUserInFriendship(
    myUsername: string,
    friendUsername: string
  ): Promise<UserInFriendship>
  areUsersFriends(username1: string, username2: string): Promise<boolean>
}

export class FriendshipRepositoryImpl implements FriendshipRepository {
  async removeSocketIdFromFriendship(
    myUsername: string,
    friendUsername: string
  ): Promise<void> {
    await Friendships.updateOne(
      {
        $or: [
          { 'user1.username': myUsername, 'user2.username': friendUsername },
          { 'user1.username': friendUsername, 'user2.username': myUsername },
        ],
      },
      {
        $set: {
          'user1.socketId': null,
          'user2.socketId': null,
        },
      }
    )
  }
  async getFriendship(myUsername: string, friendUsername: string): Promise<Friendship> {
    return await Friendships.findOne({
      $or: [
        { 'user1.username': myUsername, 'user2.username': friendUsername },
        { 'user1.username': friendUsername, 'user2.username': myUsername },
      ],
    }).orFail()
  }
  async addSocketIdToFriendship(
    myUsername: string,
    friendUsername: string,
    id: string
  ): Promise<void> {
    const friendship = await Friendships.findOne({
      $or: [
        { 'user1.username': myUsername, 'user2.username': friendUsername },
        { 'user1.username': friendUsername, 'user2.username': myUsername },
      ],
    })

    if (!friendship) {
      throw new Error('Friendship not found')
    }

    if (friendship.user1.username === myUsername) {
      friendship.user1.socketId = id
    }
    if (friendship.user2.username === myUsername) {
      friendship.user2.socketId = id
    }

    await friendship.save()
  }
  async getUserInFriendship(
    myUsername: string,
    friendUsername: string
  ): Promise<UserInFriendship> {
    const friendship = await Friendships.findOne({
      $or: [
        { 'user1.username': myUsername, 'user2.username': friendUsername },
        { 'user1.username': friendUsername, 'user2.username': myUsername },
      ],
    })
    if (!friendship) {
      throw new Error('Friendship not found')
    }
    if (friendship.user1.username === myUsername) {
      return friendship.user1
    } else {
      return friendship.user2
    }
  }
  async areUsersFriends(username1: string, username2: string): Promise<boolean> {
    const friendship = await Friendships.exists({
      $or: [
        { 'user1.username': username1, 'user2.username': username2 },
        { 'user1.username': username2, 'user2.username': username1 },
      ],
    })
    return friendship !== null
  }
}
