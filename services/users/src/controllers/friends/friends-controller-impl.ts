import { FriendsController, FriendsControllerExceptions } from './friends-controller'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import {
  FriendRequestAcceptedMessage,
  FriendRequestDeniedMessage,
  FriendRequestSentMessage,
} from '@messages-api/friends'
import { BrokerController } from '@commons/utils/broker-controller'

export class FriendsControllerImpl extends BrokerController implements FriendsController {
  private userRepository = new UserRepositoryImpl()

  async getFriendsRequests(username: string): Promise<string[]> {
    try {
      const user = await this.userRepository.getUserByUsername(username)
      return user.friendsRequests
    } catch (e) {
      throw new FriendsControllerExceptions.UserNotFound()
    }
  }

  async getFriends(username: string): Promise<string[]> {
    try {
      const user = await this.userRepository.getUserByUsername(username)
      const friends = user.friends
      return friends
    } catch (e) {
      throw new FriendsControllerExceptions.UserNotFound()
    }
  }

  async sendFriendRequest(username: string, friendUsername: string): Promise<void> {
    if (username === friendUsername) {
      throw new FriendsControllerExceptions.CannotSendFriendRequestToYourself()
    }
    try {
      await this.userRepository.sendFriendRequest(username, friendUsername)
      await this.publish(
        FriendRequestSentMessage,
        new FriendRequestSentMessage({
          from: username,
          to: friendUsername,
        })
      )
    } catch (e) {
      const error = e as Error
      if (error.message == 'Already friends') {
        throw new FriendsControllerExceptions.FriendRequestAlreadySent()
      } else if (error.message == 'User not found') {
        throw new FriendsControllerExceptions.UserNotFound()
      } else if (error.message == 'Request already exists') {
        throw new FriendsControllerExceptions.FriendRequestAlreadySent()
      }
    }
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    try {
      await this.userRepository.acceptFriendRequest(username, friendUsername)
      await this.publish(
        FriendRequestAcceptedMessage,
        new FriendRequestAcceptedMessage({
          from: username,
          to: friendUsername,
        })
      )
    } catch (e) {
      const error = e as Error
      if (error.message == 'Friend request does not exist') {
        throw new FriendsControllerExceptions.FriendRequestNotPresent()
      } else if (error.message == 'User not found') {
        throw new FriendsControllerExceptions.UserNotFound()
      }
    }
  }

  async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
    try {
      await this.userRepository.denyFriendRequest(username, friendUsername)
      await this.publish(
        FriendRequestDeniedMessage,
        new FriendRequestDeniedMessage({
          from: username,
          to: friendUsername,
        })
      )
    } catch (e) {
      const error = e as Error
      if (error.message == 'Friend request does not exist') {
        throw new FriendsControllerExceptions.FriendRequestNotPresent()
      } else if (error.message == 'User not found') {
        throw new FriendsControllerExceptions.UserNotFound()
      }
    }
  }
}
