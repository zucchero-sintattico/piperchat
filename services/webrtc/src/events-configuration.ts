import { EventsConfiguration } from '@commons/events/events-configuration'
import {
  ServerCreated,
  ServerDeleted,
  UserJoinedServer,
  UserKickedFromServer,
  UserLeftServer,
} from '@messages-api/servers'
import { ChannelCreated, ChannelDeleted } from '@messages-api/channels'
import { Servers } from './models/channels-model'
export class WebRtcServiceEventsConfiguration extends EventsConfiguration {
  constructor() {
    super()
    this.listenToServersUpdates()
    this.listenToServerParticipants()
    this.listenToChannelsUpdates()
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
}
