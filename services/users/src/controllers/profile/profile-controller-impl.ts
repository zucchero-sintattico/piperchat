import { RabbitMQ } from '@piperchat/commons'
import { ProfileController } from './profile-controller'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserUpdatedMessage } from '@messages-api/users'

export class ProfileControllerImpl implements ProfileController {
  private broker: RabbitMQ = RabbitMQ.getInstance()
  private userRepository: UserRepository = new UserRepositoryImpl()

  async updateUserPhoto(username: string, photo: Buffer): Promise<void> {
    await this.userRepository.updateUserPhoto(username, photo)
    await this.broker.publish(
      new UserUpdatedMessage({
        username,
        profilePicture: photo,
      })
    )
  }

  async updateUserDescription(username: string, description: string): Promise<void> {
    await this.userRepository.updateUserDescription(username, description)
    await this.broker.publish(
      new UserUpdatedMessage({
        username,
        description: description,
      })
    )
  }
}
