import { Servers } from "../models/server-model";
import { Channels } from "../models/server-model";
import { Conversations } from "../models/server-model";
import { Messages } from "../models/server-model";

export class ServersRepository {
  async getServerById(id: String, user: String) {
    const server = await Servers.findOne({ id: id, members: user });
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

  async getAllServers() {
    const QUERY_LIMIT = 1000;
    return await Servers.find().limit(QUERY_LIMIT);
  }
}
