import { notifiableUsers } from '@models/notification-model'

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
    notifiableUsers.sendIfPresent(message.to, {
      type: 'new-message',
      data: {
        from: message.from,
        content: message.content,
      },
    })
  }
}
