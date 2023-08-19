import { Servers, Server } from "@models/server-model";
import { ServerRepository } from "./server-repository";

export class ServerRepositoryImpl implements ServerRepository {
  async createServer(name: string, description: string, owner: string) {
    const server = await Servers.create({
      name: name,
      description: description,
      owner: owner,
      participants: [owner],
    });
    await server.save();
    return server;
  }

  async getServerById(serverId: string) {
    return await Servers.findOne({ _id: serverId }).orFail();
  }

  async getServers(username: string) {
    // get servers where username is participant
    return await Servers.find({
      participants: { $elemMatch: { $eq: username } },
    }).orFail();
  }

  async updateServerById(id: string, name?: string, description?: string) {
    const server = await Servers.findOneAndUpdate(
      { _id: id },
      // replace name and description
      { $set: { name: name, description: description } },
      { new: true }
    ).orFail();

    return await server.save();
  }

  async deleteServerById(id: string) {
    await Servers.findOneAndDelete({ _id: id }, { new: true }).orFail();
  }

  async getServerParticipants(id: string) {
    const server = await Servers.findOne({ _id: id }).orFail();
    return server.participants;
  }

  async addServerParticipant(id: string, participant: string) {
    const server = await Servers.findOneAndUpdate(
      { _id: id },
      { $push: { participants: participant } },
      { new: true }
    ).orFail();

    return await server.save();
  }

  async removeServerParticipant(id: string, participant: string) {
    const server = await Servers.findOneAndUpdate(
      { _id: id },
      { $pull: { participants: participant } },
      { new: true }
    ).orFail();
    return await server.save();
  }
}
