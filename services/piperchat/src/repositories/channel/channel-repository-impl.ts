import { ChannelRepository } from "./channel-repository";
import { Servers } from "../../models/server-model";

export class ChannelRepositoryImpl implements ChannelRepository {
  async getChannels(serverId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    return server.channels;
  }

  async createChannel(
    serverId: number,
    name: string,
    channelType: string,
    description?: string | undefined
  ) {
    await Servers.findOneAndUpdate(
      { id: serverId },
      {
        $push: {
          channels: {
            name: name,
            channelType: channelType,
            description: description,
          },
        },
      }
    ).orFail();
  }

  async getChannelById(serverId: number, channelId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.channels.find((c) => c.id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }

  async updateChannel(
    serverId: number,
    channelId: number,
    name?: string | undefined,
    description?: string | undefined
  ) {
    await Servers.findByIdAndUpdate(
      serverId,
      {
        $set: {
          "channels.$[channel].name": name,
          "channels.$[channel].description": description,
        },
      },
      {
        arrayFilters: [{ "channel.id": channelId }],
        new: true,
      }
    ).orFail();
  }

  async deleteChannel(serverId: number, channelId: number) {
    await Servers.findByIdAndUpdate(
      serverId,
      {
        $pull: {
          messageChannels: {
            id: channelId,
          },
        },
      },
      {
        new: true,
      }
    ).orFail();
  }
}
