import { EventsConfiguration } from '@commons/events/events-configuration'
import { NewMessageOnChannel } from '@messages-api/channels'
import { NewMessageOnDirect } from '@messages-api/directs'
import { notifiableUsers } from './models/notification-model'
import {
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageNotification,
} from '@api/notifications/messages'
import {
  FriendRequestSentMessage,
  FriendRequestAcceptedMessage,
} from '@messages-api/friends'
import { UserOnlineMessage, UserOfflineMessage } from '@messages-api/users'

export class NotificationsServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()

    this.on(NewMessageOnChannel, async (event: NewMessageOnChannel) => {
      // TODO: Send to channel members
    })

    this.on(NewMessageOnDirect, async (event: NewMessageOnDirect) => {
      notifiableUsers.sendIfPresent(
        event.receiver,
        new NewMessageNotification({
          from: event.sender,
          content: event.message,
        })
      )
    })

    this.on(FriendRequestSentMessage, async (event: FriendRequestSentMessage) => {
      notifiableUsers.sendIfPresent(
        event.to,
        new FriendRequestNotification({
          from: event.from,
        })
      )
    })

    this.on(FriendRequestAcceptedMessage, async (event: FriendRequestAcceptedMessage) => {
      notifiableUsers.sendIfPresent(
        event.to,
        new FriendRequestAcceptedNotification({
          from: event.from,
        })
      )
    })

    this.on(UserOnlineMessage, async (event: UserOnlineMessage) => {
      // TODO: Send to friends
    })

    this.on(UserOfflineMessage, async (event: UserOfflineMessage) => {
      // TODO: Send to friends
    })
  }
}
