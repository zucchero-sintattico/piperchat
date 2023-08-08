import { MessageChannelRepository } from "./message-channel-repository";
import { Servers } from "../../models/server-model";
import { MessageChannel } from "../../models/message-channel-model";

export class MessageChannelRepositoryImpl implements MessageChannelRepository {
  async getMessageChannels(serverId: number) {
    const server = await Servers.findOne({ id: serverId }).orFail();
    return server.messageChannels;
  }

  async createMessageChannel(
    serverId: number,
    name: string,
    description?: string | undefined
  ) {
    return await Servers.findOneAndUpdate(
      { id: serverId },
      {
        $push: {
          messageChannels: {
            name: name,
            description: description,
          },
        },
      }
    ).orFail();
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
    name?: string | undefined,
    description?: string | undefined
  ) {
    return await Servers.findByIdAndUpdate(
      serverId,
      {
        $set: {
          "messageChannels.$[channel].name": name,
          "messageChannels.$[channel].description": description,
        },
      },
      {
        arrayFilters: [{ "channel.id": channelId }],
        new: true,
      }
    ).orFail();
  }

  async deleteMessageChannel(serverId: number, channelId: number) {
    return await Servers.findByIdAndUpdate(
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
