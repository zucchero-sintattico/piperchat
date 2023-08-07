import { MessageChannelRepository } from "./message-channel-repository";
import { Servers } from "../../models/server-model";
import { MessageChannel } from "../../models/message-channel-model";

export class MessageChannelRepositoryImpl implements MessageChannelRepository {
  async getMessageChannels(serverId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    return server.messageChannels;
  }

  async createMessageChannel(serverId: number, messageChannel: MessageChannel) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    server.messageChannels.push(messageChannel);
    return await server.save();
  }

  async getChannelById(serverId: number, channelId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.messageChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }

  async updateMessageChannel(
    serverId: number,
    channelId: number,
    messageChannel: MessageChannel
  ) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.messageChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    channel.name = messageChannel.name;
    channel.description = messageChannel.description;
    return await server.save();
  }

  async deleteMessageChannel(serverId: number, channelId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.messageChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    server.messageChannels = server.messageChannels.filter(
      (c) => c.id !== channelId
    );
    return await server.save();
  }
}
