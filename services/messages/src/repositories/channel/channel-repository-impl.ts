import { ChannelRepository } from "./channel-repository";
import { Message, Server, MessageChannel } from "../../models/messages-model";

export class ChannelRepositoryImpl implements ChannelRepository {

    //For all the methods in this class, launch an error of not implemented

    async getChannels(serverId: string): Promise<MessageChannel[]> {
        throw new Error("Method not implemented.");
    }

    async createChannel(serverId: string, name: string, channelType: string, description: string): Promise<MessageChannel> {
        throw new Error("Method not implemented.");
    }

    async deleteChannel(channelId: string, serverId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getChannel(channelId: string, serverId: string): Promise<MessageChannel> {
        throw new Error("Method not implemented.");
    }

    async modifyChannel(channelId: string, serverId: string, name: string, description: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getMessages(channelId: string, serverId: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }

    async sendMessage(channelId: string, serverId: string, sender: string, content: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}