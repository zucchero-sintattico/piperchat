import { Server } from '@models/server-model'
import { ChannelRepository } from '@repositories/channel/channel-repository'
import { ChannelRepositoryImpl } from '@repositories/channel/channel-repository-impl'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { ChannelControllerExceptions } from './channel/channel-controller'
import { ServerControllerExceptions } from './server/server-controller'

/**
 * This class is used to check if some conditions are met before executing some actions.
 */
export class Checker {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
  private serverRepository: ServerRepositoryImpl = new ServerRepositoryImpl()
  public checkIfUserIsInTheServer(server: Server, username: string) {
    if (!server.participants.includes(username)) {
      throw new ServerControllerExceptions.UserNotAuthorized()
    }
  }

  public async getServerIfExists(serverId: string) {
    try {
      return await this.serverRepository.getServerById(serverId)
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound()
    }
  }

  public async checkIfChannelAlreadyExists(serverId: string, name: string) {
    const channels = await this.channelRepository.getChannels(serverId)
    if (channels.find((channel) => channel.name == name)) {
      throw new ChannelControllerExceptions.ChannelAlreadyExists()
    }
  }

  public checkIfUserIsTheOwner(server: Server, username: string) {
    if (server.owner != username) {
      throw new ServerControllerExceptions.UserNotAuthorized()
    }
  }
}
