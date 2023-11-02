import { ChannelController, ChannelControllerExceptions } from './channel-controller'
import { ChannelRepository } from '@repositories/channel/channel-repository'
import { ChannelRepositoryImpl } from '@repositories/channel/channel-repository-impl'
import { Checker } from '@controllers/checker'
import { Channel } from '@/models/channel-model'
import { RabbitMQ } from '@commons/utils/rabbit-mq'

import { ChannelCreated, ChannelDeleted, ChannelUpdated } from '@messages-api/channels'
export class ChannelControllerImpl implements ChannelController {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
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
    description?: string
  ) {
    const server = await this.checker.getServerIfExists(serverId)
    this.checker.checkIfUserIsTheOwner(server, username)
    await this.checker.checkIfChannelAlreadyExists(serverId, name)
    const channel = await this.channelRepository.createChannel(
      serverId,
      name,
      channelType,
      description
    )
    await RabbitMQ.getInstance().publish(
      ChannelCreated,
      new ChannelCreated({
        serverId: serverId,
        channelId: channel.id,
        name: channel.name,
        channelType: channel.channelType,
        description: channel.description,
      })
    )
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
    const channel = server.channels.find((channel) => channel.id === channelId)
    if (name && channel?.name !== name) {
      await this.checker.checkIfChannelAlreadyExists(serverId, name)
    }
    try {
      const channelUpdated = await this.channelRepository.updateChannel(
        serverId.toString(),
        channelId.toString(),
        name,
        description
      )
      await RabbitMQ.getInstance().publish(
        ChannelUpdated,
        new ChannelUpdated({
          serverId: serverId.toString(),
          channelId: channelId.toString(),
          name: name,
          description: description,
        })
      )
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
      await RabbitMQ.getInstance().publish(
        ChannelDeleted,
        new ChannelDeleted({
          serverId: serverId.toString(),
          channelId: channelId.toString(),
        })
      )
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound()
    }
  }
}
