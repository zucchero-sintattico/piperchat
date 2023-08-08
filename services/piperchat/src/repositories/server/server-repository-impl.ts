import { Servers, Server } from "../../models/server-model";
import { ServerRepository } from "./server-repository";

export class ServerRepositoryImpl implements ServerRepository {
  async createServer(name: string, description: string, owner: string) {
    return await Servers.create({ name, description, owner });
  }

  async getServerById(id: number) {
    return await Servers.findOne({ id }).orFail();
  }

  async getServers(username: string) {
    // get servers where username is participant
    return await Servers.find({
      participants: { $elemMatch: { $eq: username } },
    }).orFail();
  }

  async updateServerById(id: number, name?: string, description?: string) {
    return await Servers.findOneAndUpdate(
      { id },
      { name, description }
    ).orFail();
  }

  async deleteServerById(id: number) {
    return await Servers.findOneAndDelete({ id }).orFail();
  }

  async getServerParticipants(id: number) {
    const server = await Servers.findOne({ id }).orFail();
    return server.participants;
  }

  async addServerParticipant(id: number, participant: string) {
    const server = await Servers.findOne({ id }).orFail();
    server.participants.push(participant);
    return await server.save();
  }

  async removeServerParticipant(id: number, participant: string) {
    const server = await Servers.findByIdAndUpdate(
      { id },
      { $pull: { participants: participant } }
    ).orFail();
    return await server.save();
  }
}
