import { MultimediaChannelRepository } from "./multimedia-channel-repository";
import { Servers } from "../../models/server-model";
import { MultimediaChannel } from "../../models/multimedia-channel-model";
export class MultimediaChannelRepositoryImpl
  implements MultimediaChannelRepository
{
  async getMultimediaChannels(serverId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    return server.multimediaChannels;
  }
  async createMultimediaChannel(
    serverId: number,
    multimediaChannel: MultimediaChannel
  ) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    server.multimediaChannels.push(multimediaChannel);
    return await server.save();
  }

  async getChannelById(serverId: number, channelId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.multimediaChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }

  async updateMultimediaChannel(
    serverId: number,
    channelId: number,
    multimediaChannel: MultimediaChannel
  ) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.multimediaChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    channel.name = multimediaChannel.name;
    channel.description = multimediaChannel.description;
    return await server.save();
  }

  async deleteMultimediaChannel(serverId: number, channelId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.multimediaChannels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    server.multimediaChannels = server.multimediaChannels.filter(
      (c) => c.id !== channelId
    );
    return await server.save();
  }
}
