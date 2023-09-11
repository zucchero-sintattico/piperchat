import { User } from '@models/user-model'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserController } from './user-controller'

export class UserControllerImpl implements UserController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async getUser(username: string): Promise<User> {
    return await this.userRepository.getUserByUsername(username)
  }

  async getUserPhoto(username: string): Promise<Buffer> {
    return await this.userRepository.getUserPhoto(username)
  }

  async getUserDescription(username: string): Promise<string> {
    return await this.userRepository.getUserDescription(username)
  }
}
