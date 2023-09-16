import { ProfileController } from './profile-controller'
import { UserRepository } from '@repositories/user/user-repository'
import { UserRepositoryImpl } from '@repositories/user/user-repository-impl'
import { UserUpdatedMessage } from '@messages-api/users'
import { BrokerController } from '@commons/utils/broker-controller'

export class ProfileControllerImpl extends BrokerController implements ProfileController {
  private userRepository: UserRepository = new UserRepositoryImpl()

  async updateUserPhoto(
    username: string,
    photo: { data: Buffer; contentType: string }
  ): Promise<void> {
    await this.userRepository.updateUserPhoto(username, photo)
    await this.publish(
      UserUpdatedMessage,
      new UserUpdatedMessage({
        username: username,
        profilePicture: photo.data,
      })
    )
  }

  async updateUserDescription(username: string, description: string): Promise<void> {
    await this.userRepository.updateUserDescription(username, description)
    await this.publish(
      UserUpdatedMessage,
      new UserUpdatedMessage({
        username: username,
        description: description,
      })
    )
  }
}
