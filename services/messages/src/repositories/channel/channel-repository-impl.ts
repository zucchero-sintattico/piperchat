import { ServerRepository } from '../server/server-repository'
import { ServerRepositoryImpl } from '../server/server-repository-impl'
import { ChannelRepository } from './channel-repository'
import { Servers, MessageChannel, Message } from '@models/messages-model'

export class ChannelRepositoryImpl implements ChannelRepository {
  private serverRepository: ServerRepository = new ServerRepositoryImpl()

  async getChannels(serverId: string): Promise<MessageChannel[]> {
    const server = await Servers.findOne({ id: serverId }).orFail()
    return server.messagesChannels
  }

  async createChannel(serverId: string, channelId: string): Promise<void> {
    await Servers.findOneAndUpdate(
      { id: serverId },
      { $push: { messagesChannels: { id: channelId, messages: [] } } }
    ).orFail()
  }

  async deleteChannel(channelId: string, serverId: string): Promise<void> {
    await Servers.findOneAndUpdate(
      { id: serverId },
      { $pull: { messagesChannels: { id: channelId } } }
    ).orFail()
  }

  async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
    const server = await Servers.findOne({ id: serverId })
    if (!server) {
      throw new Error('Server not found')
    }
    const channel = server.messagesChannels.find((channel) => channel.id === channelId)
    if (!channel) {
      throw new Error('Channel not found')
    }
    return channel
  }

  async getChannelMessagesPaginated(
    channelId: string,
    serverId: string,
    from: number,
    limit: number
  ): Promise<Message[]> {
    const channel = await this.getChannel(channelId, serverId)
    return channel.messages.slice(
      channel.messages.length - limit - from,
      channel.messages.length - from
    )
  }

  async sendMessage(
    channelId: string,
    serverId: string,
    sender: string,
    content: string
  ): Promise<void> {
    await Servers.updateOne(
      { id: serverId, 'messagesChannels.id': channelId },
      { $push: { 'messagesChannels.$.messages': { sender, content } } }
    )
  }
}
