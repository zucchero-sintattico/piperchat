import { ChannelRepository } from "./channel-repository";
import { Server, Servers } from "@models/server-model";

export class ChannelRepositoryImpl implements ChannelRepository {
  async getChannels(serverId: string) {
    const server = await Servers.findOne({ _id: serverId }).orFail();
    return server.channels;
  }

  async createChannel(
    serverId: string,
    name: string,
    channelType: string,
    description?: string | undefined
  ) {
    const server = await Servers.findOneAndUpdate(
      { _id: serverId },
      {
        $push: {
          channels: {
            name: name,
            channelType: channelType,
            description: description,
          },
        },
      },
      { new: true }
    ).orFail();
    return server.channels[server.channels.length - 1];
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
    // find and update channel by _id
    const server = await Servers.findOneAndUpdate(
      { _id: serverId, "channels._id": channelId },
      {
        $set: {
          "channels.$.name": name,
          "channels.$.description": description,
        },
      },
      { new: true }
    ).orFail();

    // const server = await Servers.findOne({ _id: serverId }).orFail();
    const channels = server.channels;
    const channel = channels.find((chan) => chan._id.toString() === channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }
    return channel;
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
