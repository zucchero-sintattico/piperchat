import { Server } from "../../models/server-model";
import { ServerRepository } from "../../repositories/server/server-repository";
import { ServerRepositoryImpl } from "../../repositories/server/server-repository-impl";
import {
  ServerController,
  ServerControllerExceptions,
} from "./server-controller";

export class ServerControllerImpl implements ServerController {
  private serverRepository: ServerRepository = new ServerRepositoryImpl();

  async createServer(
    name: string,
    description: string,
    owner: string
  ): Promise<Server> {
    return await this.serverRepository.createServer(name, description, owner);
  }
  async getServers(username: string): Promise<Server[]> {
    return await this.serverRepository.getServers(username);
  }
  async getServer(id: number): Promise<Server> {
    return await this.serverRepository.getServerById(id);
  }
  async updateServer(
    id: number,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<Server> {
    // check if user is owner
    const server = await this.serverRepository.getServerById(id);
    if (server.owner !== username) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
    try {
      return await this.serverRepository.updateServerById(
        id,
        name,
        description
      );
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }
  async deleteServer(id: number, username: string): Promise<Server> {
    const server = await this.serverRepository.getServerById(id);
    if (server.owner !== username) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
    try {
      return await this.serverRepository.deleteServerById(id);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }
  async joinServer(id: number, username: string): Promise<Server> {
    try {
      await this.serverRepository.getServerById(id);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
    try {
      return await this.serverRepository.addServerParticipant(id, username);
    } catch (e) {
      throw new ServerControllerExceptions.UserAlreadyJoined();
    }
  }
  async leaveServer(id: number, username: string): Promise<Server> {
    try {
      await this.serverRepository.getServerById(id);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
    try {
      return await this.serverRepository.removeServerParticipant(id, username);
    } catch (e) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
  }
}
