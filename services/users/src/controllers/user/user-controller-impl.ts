import { Photo, User } from '@models/user-model'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserController, UserControllerExceptions } from './user-controller'

export class UserControllerImpl implements UserController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async getUser(username: string): Promise<User> {
    try {
      return await this.userRepository.getUserByUsername(username)
    } catch (e) {
      throw new UserControllerExceptions.UserNotFound()
    }
  }

  async getUserPhoto(username: string): Promise<Photo> {
    try {
      return await this.userRepository.getUserPhoto(username)
    } catch (e) {
      throw new UserControllerExceptions.UserNotFound()
    }
  }

  async getUserDescription(username: string): Promise<string> {
    try {
      return await this.userRepository.getUserDescription(username)
    } catch (e) {
      throw new UserControllerExceptions.UserNotFound()
    }
  }
}
