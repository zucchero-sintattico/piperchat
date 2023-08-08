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
    name: string,
    description?: string | undefined
  ) {
    return await Servers.findOneAndUpdate(
      { id: serverId },
      {
        $push: {
          multimediaChannels: {
            name: name,
            description: description,
          },
        },
      }
    ).orFail();
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
    name?: string,
    description?: string | undefined
  ) {
    return await Servers.findByIdAndUpdate(
      serverId,
      {
        $set: {
          "multimediaChannels.$[channel].name": name,
          "multimediaChannels.$[channel].description": description,
        },
      },
      {
        arrayFilters: [{ "channel.id": channelId }],
        new: true,
      }
    ).orFail();
  }

  async deleteMultimediaChannel(serverId: number, channelId: number) {
    return await Servers.findByIdAndUpdate(
      serverId,
      {
        $pull: {
          multimediaChannels: {
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
