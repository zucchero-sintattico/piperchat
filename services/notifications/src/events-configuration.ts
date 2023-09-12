import { EventsConfiguration } from '@commons/events/events-configuration'
import { NewMessageOnChannel } from '@messages-api/channels'
import { NewMessageOnDirect } from '@messages-api/directs'
import { notifiableUsers } from './models/notification-model'
import {
  FriendRequestAcceptedNotification,
  FriendRequestNotification,
  NewMessageOnDirectNotification,
  NewMessageOnChannelNotification,
} from '@api/notifications/messages'
import {
  FriendRequestSentMessage,
  FriendRequestAcceptedMessage,
} from '@messages-api/friends'
import {
  ServerCreated,
  ServerDeleted,
  UserJoinedServer,
  UserLeftServer,
  UserKickedFromServer,
} from '@messages-api/servers'
import { UserOnlineMessage, UserOfflineMessage } from '@messages-api/users'
import { Servers } from './models/server'

export class NotificationsServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
    this.listenToServersUpdates()

    this.on(NewMessageOnChannel, async (event: NewMessageOnChannel) => {
      const server = await Servers.findOne({ _id: event.serverId })
      const participants = server?.participants.filter(
        (participant) => participant !== event.sender
      )
      participants?.forEach((participant) => {
        notifiableUsers.sendIfPresent(
          participant,
          new NewMessageOnChannelNotification({
            from: event.sender,
            content: event.message,
            channel: event.channelId,
          })
        )
      })
    })

    this.on(NewMessageOnDirect, async (event: NewMessageOnDirect) => {
      notifiableUsers.sendIfPresent(
        event.receiver,
        new NewMessageOnDirectNotification({
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

  listenToServersUpdates() {
    this.on(ServerCreated, async (event: ServerCreated) => {
      await Servers.create({
        _id: event.id,
        owner: event.owner,
        participants: [event.owner],
      })
    })

    this.on(ServerDeleted, async (event: ServerDeleted) => {
      await Servers.deleteOne({ _id: event.id })
    })

    this.on(UserJoinedServer, async (event: UserJoinedServer) => {
      await Servers.updateOne(
        { _id: event.serverId },
        { $push: { participants: event.username } }
      )
    })

    this.on(UserLeftServer, async (event: UserLeftServer) => {
      await Servers.updateOne(
        { _id: event.serverId },
        { $pull: { participants: event.username } }
      )
    })

    this.on(UserKickedFromServer, async (event: UserKickedFromServer) => {
      await Servers.updateOne(
        { _id: event.serverId },
        { $pull: { participants: event.username } }
      )
    })
  }
}
