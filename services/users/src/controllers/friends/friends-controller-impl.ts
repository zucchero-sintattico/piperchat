import { RabbitMQ } from '@commons/utils/rabbit-mq'
import { FriendsController } from './friends-controller'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import {
  FriendRequestAcceptedMessage,
  FriendRequestDeniedMessage,
  FriendRequestSentMessage,
} from '@messages-api/friends'
export class FriendsControllerImpl implements FriendsController {
  private broker: RabbitMQ = RabbitMQ.getInstance()
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
    await this.broker.publish(
      FriendRequestSentMessage,
      new FriendRequestSentMessage({
        from: username,
        to: friendUsername,
      })
    )
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.acceptFriendRequest(username, friendUsername)
    await this.broker.publish(
      FriendRequestAcceptedMessage,
      new FriendRequestAcceptedMessage({
        from: username,
        to: friendUsername,
      })
    )
  }

  async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.denyFriendRequest(username, friendUsername)
    await this.broker.publish(
      FriendRequestDeniedMessage,
      new FriendRequestDeniedMessage({
        from: username,
        to: friendUsername,
      })
    )
  }
}
