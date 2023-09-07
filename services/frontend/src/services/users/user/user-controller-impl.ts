import { User } from '@models/user-model'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserController, UserStatusInfo } from './user-controller'

export class UserControllerImpl implements UserController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.getUserByUsername(username)
    return {
      username: user.username,
      email: user.email,
      online: user.online,
      lastActive: user.lastActive
    } as User
  }

  async getUserStatus(username: string): Promise<UserStatusInfo> {
    const user = await this.userRepository.getUserByUsername(username)
    return {
      online: user.online,
      lastActive: user.lastActive
    } as UserStatusInfo
  }

  async getUserPhoto(username: string): Promise<Buffer> {
    return await this.userRepository.getUserPhoto(username)
  }

  async getUserDescription(username: string): Promise<string> {
    return await this.userRepository.getUserDescription(username)
  }
}
