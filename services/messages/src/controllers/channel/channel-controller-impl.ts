import { ChannelRepository } from '../../repositories/channel/channel-repository';
import { ChannelRepositoryImpl } from '../../repositories/channel/channel-repository-impl';
import { ChannelController } from './channel-controller';
import { MessageChannel, Message } from '../../models/messages-model';

export class ChannelControllerImpl implements ChannelController {

    private channelRepository: ChannelRepository = new ChannelRepositoryImpl();

    getChannels(serverId: string): Promise<MessageChannel[]> {
        return this.channelRepository.getChannels(serverId);
    }

    createChannel(serverId: string, name: string, channelType: string, description: string): Promise<MessageChannel> {
        return this.channelRepository.createChannel(serverId, name, channelType, description);
    }

    deleteChannel(channelId: string, serverId: string): Promise<void> {

        return this.channelRepository.deleteChannel(channelId, serverId);
    }

    getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
        return this.channelRepository.getChannel(channelId, serverId);
    }

    modifyChannel(channelId: string, serverId: string, name: string, description: string): Promise<void> {
        return this.channelRepository.modifyChannel(channelId, serverId, name, description);
    }

    getMessages(channelId: string, serverId: string): Promise<Message[]> {
        return this.channelRepository.getMessages(channelId, serverId);
    }

    sendMessage(channelId: string, serverId: string, sender: string, message: string): Promise<void> {
        return this.channelRepository.sendMessage(channelId, serverId, sender, message);
    }


}