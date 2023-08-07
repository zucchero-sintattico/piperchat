import { SrvRecord } from "dns";
import { Servers, Server } from "../../models/server-model";
import { ServerRepository } from "./server-repository";

export class ServerRepositoryImpl implements ServerRepository {
  async createServer(server: Server) {
    return await Servers.create(server);
  }

  async getServerById(id: number) {
    return await Servers.findOne({ id }).orFail();
  }

  async getServers() {
    var servers = await Servers.find();
    return servers.map((server) => server.id);
  }

  async updateServerById(id: number, server: Server) {
    return await Servers.findOneAndUpdate({ id }, server).orFail();
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
    const server = await Servers.findOne({ id }).orFail();
    server.participants = server.participants.filter((p) => p !== participant);
    return await server.save();
  }
}
