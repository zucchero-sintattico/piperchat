import { RabbitMQ } from '@piperchat/commons/src/rabbit-mq'
import { ProfileController } from './profile-controller'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserUpdatedMessage } from '@piperchat/messages-api/src/users'

export class ProfileControllerImpl implements ProfileController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async updateUserPhoto(username: string, photo: Buffer): Promise<void> {
    await this.userRepository.updateUserPhoto(username, photo)
    await RabbitMQ.getInstance().publish(
      UserUpdatedMessage,
      new UserUpdatedMessage({
        username: username,
        profilePicture: photo,
      })
    )
  }

  async updateUserDescription(username: string, description: string): Promise<void> {
    await this.userRepository.updateUserDescription(username, description)
    await RabbitMQ.getInstance().publish(
      UserUpdatedMessage,
      new UserUpdatedMessage({
        username: username,
        description: description,
      })
    )
  }
}
