import { ChannelRepository } from '@repositories/channel/channel-repository'
import { ChannelRepositoryImpl } from '@repositories/channel/channel-repository-impl'
import { ChannelController, ChannelControllerExceptions } from './channel-controller'
import { MessageChannel, Message } from '@models/messages-model'
import { ServerRepository } from '@repositories/server/server-repository'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { RabbitMQ } from '@commons/utils/rabbit-mq'
import { NewMessageOnChannel } from '@messages-api/channels'

export class ChannelControllerImpl implements ChannelController {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl()
  private serverRepository: ServerRepository = new ServerRepositoryImpl()

  async getChannels(serverId: string): Promise<MessageChannel[]> {
    return await this.channelRepository.getChannels(serverId)
  }

  async createChannel(serverId: string, channelId: string): Promise<void> {
    try {
      await this.channelRepository.createChannel(serverId, channelId)
    } catch (e) {
      throw new ChannelControllerExceptions.ServerNotFound()
    }
  }

  async deleteChannel(channelId: string, serverId: string): Promise<void> {
    await this.channelRepository.deleteChannel(channelId, serverId)
  }

  async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
    return this.channelRepository.getChannel(channelId, serverId)
  }

  async getChannelMessagesPaginated(
    channelId: string,
    serverId: string,
    from: number,
    limit: number
  ): Promise<Message[]> {
    await this.checkIfChannelExists(channelId, serverId)
    return await this.channelRepository.getChannelMessagesPaginated(
      channelId,
      serverId,
      from,
      limit
    )
  }

  async sendMessage(
    channelId: string,
    serverId: string,
    sender: string,
    message: string
  ): Promise<void> {
    await this.checkIfUserIsInTheServer(serverId, sender)
    await this.checkIfChannelExists(channelId, serverId)
    await this.channelRepository.sendMessage(channelId, serverId, sender, message)

    await RabbitMQ.getInstance().publish(
      NewMessageOnChannel,
      new NewMessageOnChannel({
        serverId: serverId,
        channelId: channelId,
        sender: sender,
        message: message,
      })
    )
  }

  async checkIfChannelExists(channelId: string, serverId: string): Promise<boolean> {
    const channels = await this.channelRepository.getChannels(serverId)
    if (channels.find((channel) => channel.id.toString() === channelId.toString()))
      return true
    else {
      throw new ChannelControllerExceptions.ChannelNotFound()
    }
  }

  async checkIfUserIsInTheServer(serverId: string, userId: string): Promise<boolean> {
    const participants = await this.serverRepository.getServerParticipants(serverId)
    if (participants.includes(userId)) return true
    else {
      throw new ChannelControllerExceptions.UserNotAuthorized()
    }
  }
}
