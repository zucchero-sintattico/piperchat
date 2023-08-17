import { ChannelRepository } from "./channel-repository";
import { Servers, MessageChannel, Message } from "../../models/messages-model";

export class ChannelRepositoryImpl implements ChannelRepository {

    async getChannels(serverId: string): Promise<MessageChannel[]> {
        const server = await Servers.findOne({ id: serverId }).orFail();
        return server.messagesChannels;
    }

    async createChannel(serverId: string, channelId: string): Promise<void> {
        await Servers.findOneAndUpdate(
            { id: serverId },
            {
                $push: {
                    messagesChannels: {
                        id: channelId,
                        messages: [],
                    },
                },
            },
            { new: true }
        ).orFail();

    }

    async deleteChannel(channelId: string, serverId: string): Promise<void> {
        await Servers.findByIdAndUpdate(
            serverId,
            {
                $pull: {
                    channels: {
                        id: channelId,
                    },
                },
            },
            {
                new: true,
            }
        ).orFail();
    }

    async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
        const server = await Servers.findOne({ id: serverId }).orFail();
        const channel = server.messagesChannels.find((channel) => channel.id === channelId);
        if (!channel) {
            throw new Error("Channel not found");
        }
        return channel;
    }


    async getMessages(channelId: string, serverId: string): Promise<Message[]> {
        const channel = await this.getChannel(channelId, serverId);
        if (!channel) {
            throw new Error("Channel not found");
        }
        return channel.messages;
    }

    async sendMessage(channelId: string, serverId: string, sender: string, content: string): Promise<void> {
        await Servers.findOneAndUpdate(
            { id: serverId, "messagesChannels.id": channelId },
            {
                $push: {
                    "messagesChannels.$.messages": {
                        sender,
                        content,
                    },
                },
            },
            { new: true }
        ).orFail();
    }

}