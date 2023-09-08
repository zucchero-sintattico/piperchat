import { notifiableUsers } from '@models/notification-model'
import { NewMessage } from '@api/notifications/messages'
export interface Message {
  from: string
  to: string
  content: string
}

export interface NotificationRepository {
  /**
   * Perform operation on new message arrived.
   * @param message The message arrived.
   */
  onNewMessage(message: Message): void
}

export class NotificationRepositoryImpl implements NotificationRepository {
  onNewMessage(message: Message): void {
    notifiableUsers.sendIfPresent(
      message.to,
      new NewMessage(message.from, message.content)
    )
  }
}
