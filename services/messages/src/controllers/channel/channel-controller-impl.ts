import { ChannelRepository } from '../../repositories/channel/channel-repository';
import { ChannelRepositoryImpl } from '../../repositories/channel/channel-repository-impl';
import { ChannelController, ChannelControllerExceptions } from './channel-controller';
import { MessageChannel, Message } from '../../models/messages-model';

export class ChannelControllerImpl implements ChannelController {

    private channelRepository: ChannelRepository = new ChannelRepositoryImpl();

    async getChannels(serverId: string): Promise<MessageChannel[]> {
        return await this.channelRepository.getChannels(serverId);
    }

    async createChannel(serverId: string, channelId: string): Promise<void> {
        try {
            await this.channelRepository.createChannel(serverId, channelId);
        }
        catch (e) {
            throw new ChannelControllerExceptions.ServerNotFound();
        }
    }

    async deleteChannel(channelId: string, serverId: string): Promise<void> {
        await this.channelRepository.deleteChannel(channelId, serverId);
    }

    async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
        return this.channelRepository.getChannel(channelId, serverId);
    }

    async getMessages(channelId: string, serverId: string): Promise<Message[]> {
        return await this.channelRepository.getMessages(channelId, serverId);
    }

    async sendMessage(channelId: string, serverId: string, sender: string, message: string): Promise<void> {
        await this.channelRepository.sendMessage(channelId, serverId, sender, message);
    }


}