import { Servers } from "@models/chat-model";

export class ServersRepository {
  async getServerById(id: String) {
    const server = await Servers.findOne({ id: id });
    return server;
  }

  async getServerByName(name: String) {
    const server = await Servers.findOne({ name: name });
    return server;
  }

  async getServersByUsername(username: String) {
    const server = await Servers.find({ members: username });
    return server;
  }

  async createServer(
    name: String,
    description: String,
    creator: String,
    members: String[],
    channels: String[]
  ) {
    const server = new Servers({
      name: name,
      description: description,
      creator: creator,
      members: members,
      channels: channels,
    });
    return await server.save();
  }

  async updateServer(name: String, description: String) {
    return await Servers.updateOne({ name: name, description: description });
  }

  async deleteServer(serverId: String) {
    return await Servers.deleteOne({ id: serverId });
  }

  async getAllServers() {
    const QUERY_LIMIT = 1000;
    return await Servers.find().limit(QUERY_LIMIT);
  }

  async addMemberToServer(id: String, member: String) {
    const server = await Servers.findOne({ id: id });
    if (!server) {
      return null;
    }
    server.members.push(member.toString());
    return await server.save();
  }

  async removeMemberFromServer(id: String, member: String) {
    const server = await Servers.findOne({ id: id });
    if (!server) {
      return null;
    }
    server.members = server.members.filter((m) => m != member);
    return await server.save();
  }

  async addChannelToServer(id: String, channel: String) {
    const server = await Servers.findOne({ id: id });
    if (!server) {
      return null;
    }
    server.channels.push(channel);
    return await server.save();
  }

  async removeChannelFromServer(id: String, channel: String) {
    const server = await Servers.findOne({ id: id });
    if (!server) {
      return null;
    }
    server.channels.remove(channel);
    return await server.save();
  }
}
