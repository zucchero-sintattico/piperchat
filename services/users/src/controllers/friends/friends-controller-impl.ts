import { FriendsController } from './friends-controller'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'

export class FriendsControllerImpl implements FriendsController {
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
  }

  async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.acceptFriendRequest(username, friendUsername)
  }

  async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
    await this.userRepository.denyFriendRequest(username, friendUsername)
  }
}
