import { FriendsController } from './friends-controller'
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
    const user = await this.userRepository.getUserByUsername(username)
    return user.friendsRequests
  }

  async getFriends(username: string): Promise<string[]> {
    const user = await this.userRepository.getUserByUsername(username)
    return user.friends
  }

  async sendFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.sendFriendRequest(username, friendUsername)
    await this.publish(
      FriendRequestSentMessage,
      new FriendRequestSentMessage({
        from: username,
        to: friendUsername,
      })
    )
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.acceptFriendRequest(username, friendUsername)
    await this.publish(
      FriendRequestAcceptedMessage,
      new FriendRequestAcceptedMessage({
        from: username,
        to: friendUsername,
      })
    )
  }

  async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.denyFriendRequest(username, friendUsername)
    await this.publish(
      FriendRequestDeniedMessage,
      new FriendRequestDeniedMessage({
        from: username,
        to: friendUsername,
      })
    )
  }
}
