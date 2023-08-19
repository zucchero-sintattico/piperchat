import { User } from '@models/user-model'

export interface UserEventsRepository {
  /**
   * Publish user created event.
   * @param user
   */
  publishUserCreated(user: User): Promise<void>

  /**
   * Publish user updated event.
   * @param user
   */
  publishUserUpdated(user: User): Promise<void>

  /**
   * Publish user deleted event.
   * @param user
   */
  publishUserDeleted(user: User): Promise<void>
}
