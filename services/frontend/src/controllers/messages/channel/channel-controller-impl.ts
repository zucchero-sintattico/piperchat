import axios from 'axios'
import type { ChannelController } from './channel-controller'
export class ChannelControllerImpl implements ChannelController {
  async getChannels(serverId: string): Promise<MessageChannel[]> {
    throw new Error('Method not implemented.')
  }
  async createChannel(serverId: string, channelId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async deleteChannel(channelId: string, serverId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
    throw new Error('Method not implemented.')
  }
  async getChannelMessagesPaginated(
    channelId: string,
    serverId: string,
    from: number,
    limit: number
  ): Promise<any> {
    throw new Error('Method not implemented.')
  }
  async sendMessage(channelId: string, serverId: string, content: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
