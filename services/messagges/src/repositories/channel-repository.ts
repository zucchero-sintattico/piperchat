import { Channels } from "../models/chat-model";
import { Servers } from "../models/chat-model";
export class ChannelRepository {
  async getChannelsFromServer(serverId: String) {
    return await Servers.find({ id: serverId }).select("channels");
  }

  async createChannel(
    serverId: String,
    name: String,
    type: String,
    description: String,
    creator: String,
    members: String[]
  ) {
    const channel = new Channels({
      name: name,
      type: type,
      description: description,
      creator: creator,
      members: members,
    });
    // update the server copy
    await Servers.updateOne({ id: serverId }, { $push: { channels: channel } });
    return await channel.save();
  }

  async getChannelById(channelId: String) {
    return await Channels.findOne({ id: channelId });
  }

  async updateChannel(channelId: String, name: String, description: String) {
    return await Channels.updateOne(
      { id: channelId },
      { name: name, description: description }
    );
  }

  async deleteChannel(channelId: String) {
    return await Channels.deleteOne({ id: channelId });
  }
}
