import { ChannelController, ChannelControllerExceptions } from './channel-controller'
import { ChannelRepository } from '@repositories/channel/channel-repository'
import { ChannelRepositoryImpl } from '@repositories/channel/channel-repository-impl'
import { ChannelEventRepository } from '@events/repositories/channel/channel-event-repository'
import { ChannelEventRepositoryImpl } from '@events/repositories/channel/channel-event-repository-impl'
import { Checker } from '@controllers/checker'
import { Channel } from '@/models/channel-model'

export class ChannelControllerImpl implements ChannelController {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
  private channelEventRepository: ChannelEventRepository =
    new ChannelEventRepositoryImpl()
  private checker = new Checker()

  async getChannels(serverId: string, username: string) {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsInTheServer(server, username)
    return await this.channelRepository.getChannels(serverId)
  }

  async getChannelById(serverId: string, channelId: string, username: string) {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsInTheServer(server, username)
    try {
      return await this.channelRepository.getChannelById(serverId, channelId)
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound()
    }
  }

  async createChannel(
    serverId: string,
    username: string,
    name: string,
    channelType: string,
    description?: string | undefined
  ) {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsTheOwner(server, username)
    await this.checker.checkIfChannelAlreadyExists(serverId, name)
    const channel = await this.channelRepository.createChannel(
      serverId.toString(),
      name,
      channelType,
      description
    )
    await this.channelEventRepository.publishChannelCreated({
      serverId: serverId.toString(),
      channelId: channel._id.toString(),
      name: channel.name,
      channelType: channel.channelType,
      description: channel.description,
    })
    return channel
  }

  async updateChannel(
    serverId: string,
    channelId: string,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<Channel> {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsTheOwner(server, username)
    if (name) {
      await this.checker.checkIfChannelAlreadyExists(serverId, name)
    }
    try {
      const channelUpdated = await this.channelRepository.updateChannel(
        serverId.toString(),
        channelId.toString(),
        name,
        description
      )
      await this.channelEventRepository.publishChannelUpdated({
        serverId: serverId.toString(),
        channelId: channelUpdated._id.toString(),
        name: channelUpdated.name,
        channelType: channelUpdated.channelType,
        description: channelUpdated.description,
      })
      return channelUpdated
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound()
    }
  }

  async deleteChannel(serverId: string, channelId: string, username: string) {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsTheOwner(server, username)
    try {
      await this.channelRepository.deleteChannel(serverId, channelId)
      await this.channelEventRepository.publishChannelDeleted({
        serverId: serverId.toString(),
        channelId: channelId.toString(),
      })
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound()
    }
  }
}
