import { EventsConfiguration } from '@commons/events/events-configuration'
import {
  ServerCreated,
  ServerDeleted,
  UserJoinedServer,
  UserKickedFromServer,
  UserLeftServer,
} from '@messages-api/servers'
import { UserDeletedMessage } from '@messages-api/users'
import { FriendRequestAcceptedMessage } from '@messages-api/friends'
import { ChannelCreated, ChannelDeleted } from '@messages-api/channels'
import { Servers } from './models/server-model'
import { Friendships } from './models/users-model'
export class WebRtcServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
    this.listenToServersUpdates()
    this.listenToServerParticipants()
    this.listenToChannelsUpdates()
    this.listenToFriendsUpdates()
  }

  listenToServersUpdates() {
    this.on(ServerCreated, async (event: ServerCreated) => {
      await Servers.create({
        id: event.id,
        participants: [event.owner],
        channels: [],
      })
    })

    this.on(ServerDeleted, async (event: ServerDeleted) => {
      await Servers.deleteOne({ id: event.id })
    })
  }

  listenToServerParticipants() {
    this.on(UserJoinedServer, async (event: UserJoinedServer) => {
      await Servers.updateOne(
        { id: event.serverId },
        { $push: { participants: event.username } }
      )
    })

    this.on(UserLeftServer, async (event: UserLeftServer) => {
      await Servers.updateOne(
        { id: event.serverId },
        { $pull: { participants: event.username } }
      )
    })

    this.on(UserKickedFromServer, async (event: UserKickedFromServer) => {
      await Servers.updateOne(
        { id: event.serverId },
        { $pull: { participants: event.username } }
      )
    })
  }

  listenToChannelsUpdates() {
    this.on(ChannelCreated, async (event: ChannelCreated) => {
      await Servers.updateOne(
        { id: event.serverId },
        { $push: { channels: { id: event.channelId, participants: [] } } }
      )
    })

    this.on(ChannelDeleted, async (event: ChannelDeleted) => {
      await Servers.updateOne(
        { id: event.serverId },
        { $pull: { channels: { id: event.channelId } } }
      )
    })
  }

  listenToFriendsUpdates() {
    this.on(UserDeletedMessage, async (event: UserDeletedMessage) => {
      await Friendships.deleteMany({
        $or: [{ 'user1.username': event.username }, { 'user2.username': event.username }],
      })
    })

    this.on(FriendRequestAcceptedMessage, async (event: FriendRequestAcceptedMessage) => {
      await Friendships.create({
        user1: {
          username: event.from,
        },
        user2: {
          username: event.to,
        },
      })
    })
  }
}
