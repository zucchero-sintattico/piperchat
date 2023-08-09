import { ChannelRepository } from "./channel-repository";
import { Servers } from "../../models/server-model";

export class ChannelRepositoryImpl implements ChannelRepository {
  async getChannels(serverId: string) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    return server.channels;
  }

  async createChannel(
    serverId: string,
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

  async getChannelById(serverId: string, channelId: string) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    const channel = server.channels.find((c) => c._id === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
  }

  async updateChannel(
    serverId: string,
    channelId: string,
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

  async deleteChannel(serverId: string, channelId: string) {
    await Servers.findByIdAndUpdate(
      serverId,
      {
        $pull: {
          channels: {
            _id: channelId,
          },
        },
      },
      {
        new: true,
      }
    ).orFail();
  }
}
