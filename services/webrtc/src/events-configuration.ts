import { EventsConfiguration } from '@commons/events/events-configuration'
import {
  ServerCreated,
  ServerDeleted,
  UserJoinedServer,
  UserKickedFromServer,
  UserLeftServer,
} from '@messages-api/servers'
import { FriendRequestAcceptedMessage } from '@messages-api/friends'
import { ChannelCreated, ChannelDeleted } from '@messages-api/channels'
import { Servers } from './models/server-model'

import { CreateChannelApi } from '@api/piperchat/channel'
import {
  SessionRepository,
  SessionRepositoryImpl,
} from './repositories/session-repository'
import {
  FriendshipRepository,
  FriendshipRepositoryImpl,
} from './repositories/friendship-repository'
import {
  ChannelRepository,
  ChannelRepositoryImpl,
} from './repositories/channel-repository'
export class WebRtcServiceEventsConfiguration extends EventsConfiguration {
  private sessionRepository: SessionRepository = new SessionRepositoryImpl()
  private friendshipRepository: FriendshipRepository = new FriendshipRepositoryImpl()
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()

  constructor() {
    super()
    this.listenToServersUpdates()
    this.listenToServerParticipants()
    this.listenToChannelsUpdates()
    this.listenToFriendsUpdates()
  }

  listenToServersUpdates() {
    this.on(ServerCreated, async (event: ServerCreated) => {
      console.log('[Event] ServerCreated: ', event)
      await this.channelRepository.createServer(event.id, event.owner)
    })

    this.on(ServerDeleted, async (event: ServerDeleted) => {
      console.log('[Event] ServerDeleted: ', event)
      await this.channelRepository.deleteServer(event.id)
    })
  }

  listenToServerParticipants() {
    this.on(UserJoinedServer, async (event: UserJoinedServer) => {
      console.log('[Event] UserJoinedServer: ', event)
      await this.channelRepository.addServerParticipant(event.serverId, event.username)
    })

    this.on(UserLeftServer, async (event: UserLeftServer) => {
      console.log('[Event] UserLeftServer: ', event)
      await this.channelRepository.removeServerParticipant(event.serverId, event.username)
    })

    this.on(UserKickedFromServer, async (event: UserKickedFromServer) => {
      console.log('[Event] UserKickedFromServer: ', event)
      await this.channelRepository.removeServerParticipant(event.serverId, event.username)
    })
  }

  listenToChannelsUpdates() {
    this.on(ChannelCreated, async (event: ChannelCreated) => {
      if (event.channelType !== CreateChannelApi.ChannelType.Multimedia) {
        return
      }

      console.log('[Event] ChannelCreated: ', event)

      const server = await Servers.findOne({ id: event.serverId }).orFail()
      const sessionId = await this.sessionRepository.createSession(server.participants)

      await this.channelRepository.createChannelInServer(
        event.serverId,
        event.channelId,
        sessionId
      )
    })

    this.on(ChannelDeleted, async (event: ChannelDeleted) => {
      try {
        console.log('[Event] ChannelDeleted: ', event)
        await this.channelRepository.deleteChannelInServer(
          event.serverId,
          event.channelId
        )
      } catch (error) {
        // do nothing
      }
    })
  }

  listenToFriendsUpdates() {
    this.on(FriendRequestAcceptedMessage, async (event: FriendRequestAcceptedMessage) => {
      console.log('[Event] FriendRequestAcceptedMessage: ', event)
      const sessionId = await this.sessionRepository.createSession([event.from, event.to])
      await this.friendshipRepository.createFriendship(event.from, event.to, sessionId)
    })
  }
}
