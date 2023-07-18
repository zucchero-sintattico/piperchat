import { Channels } from "../models/chat-model";
import { Servers } from "../models/chat-model";
export class ChannelRepository {
  async getAllChannels() {
    const QUERY_LIMIT = 1000;
    return await Channels.find().limit(QUERY_LIMIT);
  }

  async createChannel(
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
    return await channel.save();
  }

  async getChannelById(id: String) {
    const channel = await Channels.findOne({ id: id });
    return channel;
  }

  async getChannelsByUsername(username: String) {
    const channel = await Channels.find({ members: username });
    return channel;
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

  async addMemberToChannel(channelId: String, member: String) {
    const channel = await Channels.findOne({ id: channelId });
    if (!channel) {
      return null;
    }
    channel.members.push(member.toString());
    return await channel.save();
  }

  async removeMemberFromChannel(channelId: String, member: String) {
    const channel = await Channels.findOne({ id: channelId });
    if (!channel) {
      return null;
    }
    channel.members = channel.members.filter((m) => m != member);
    return await channel.save();
  }

  async addMessageToChannel(channelId: String, message: String) {
    const channel = await Channels.findOne({ id: channelId });
    if (!channel) {
      return null;
    }
    channel.messages.push(message);
    return await channel.save();
  }
}
