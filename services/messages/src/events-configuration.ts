import { EventsConfiguration } from '@commons/events/events-configuration'
import { ServerRepository } from '@repositories/server/server-repository'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import {
  ServerCreated,
  ServerDeleted,
  UserJoinedServer,
  UserLeftServer,
  UserKickedFromServer,
} from '@messages-api/servers'
import { ChannelCreated, ChannelDeleted } from '@messages-api/channels'
import { CreateChannelApi } from '@api/piperchat/channel'

export class MessagesServiceEventsConfiguration extends EventsConfiguration {
  private serverRepository: ServerRepository = new ServerRepositoryImpl()
  constructor() {
    super()
    this.on(ServerCreated, async (event: ServerCreated) => {
      await this.serverRepository.addServer(event.id, event.owner)
    })

    this.on(ServerDeleted, async (event: ServerDeleted) => {
      await this.serverRepository.removeServer(event.id)
    })

    this.on(UserJoinedServer, async (event: UserJoinedServer) => {
      await this.serverRepository.addParticipant(event.serverId, event.username)
    })

    this.on(UserLeftServer, async (event: UserLeftServer) => {
      await this.serverRepository.removeParticipant(event.serverId, event.username)
    })

    this.on(UserKickedFromServer, async (event: UserKickedFromServer) => {
      await this.serverRepository.removeParticipant(event.serverId, event.username)
    })

    this.on(ChannelCreated, async (event: ChannelCreated) => {
      if (event.channelType == CreateChannelApi.ChannelType.Messages) {
        await this.serverRepository.addMessageChannel(event.serverId, event.channelId)
      }
    })

    this.on(ChannelDeleted, async (event: ChannelDeleted) => {
      if (
        await this.serverRepository.containsMessageChannel(
          event.serverId,
          event.channelId
        )
      ) {
        this.serverRepository.removeMessageChannel(event.serverId, event.channelId)
      }
    })
  }
}
