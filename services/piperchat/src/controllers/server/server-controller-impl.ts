import { Server } from "../../models/server-model";
import { ServerRepository } from "../../repositories/server/server-repository";
import { ServerRepositoryImpl } from "../../repositories/server/server-repository-impl";
import { ServerEventRepository } from "../../events/repositories/server/server-events-repository";
import { ServerEventRepositoryImpl } from "../../events/repositories/server/server-event-repository-impl";
import { Checker } from "../checker";
import {
  ServerController,
  ServerControllerExceptions,
} from "./server-controller";

export class ServerControllerImpl implements ServerController {
  private serverRepository: ServerRepository = new ServerRepositoryImpl();
  private serverEventRepository: ServerEventRepository =
    new ServerEventRepositoryImpl();
  private checker = new Checker();

  async createServer(
    name: string,
    description: string,
    owner: string
  ): Promise<Server> {
    const server = await this.serverRepository.createServer(
      name,
      description,
      owner
    );
    this.serverEventRepository.publishServerCreated({
      _id: server._id,
      name: server.name,
      description: server.description,
    });
    return server;
  }
  async getServers(username: string): Promise<Server[]> {
    try {
      return await this.serverRepository.getServers(username);
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound();
    }
  }
  async getServer(id: string): Promise<Server> {
    try {
      return await this.serverRepository.getServerById(id);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }
  async updateServer(
    id: string,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<Server> {
    // check if user is owner
    let server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      const serverUpdated = await this.serverRepository.updateServerById(
        id,
        name,
        description
      );
      this.serverEventRepository.publishServerUpdated({
        serverId: serverUpdated._id,
        name: serverUpdated.name,
        description: serverUpdated.description,
      });
      return serverUpdated;
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }
  async deleteServer(id: string, username: string): Promise<void> {
    const server = await this.checker.getServerIfExists(id);
    // check if user is owner
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      await this.serverRepository.deleteServerById(id);
      this.serverEventRepository.publishServerDeleted({
        serverId: server._id,
      });
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }

  async getServerParticipants(id: string, username: string): Promise<string[]> {
    const server = await this.checker.getServerIfExists(id);
    // check if user is in server
    this.checker.checkIfUserIsInTheServer(server, username);
    const participants = await this.serverRepository.getServerParticipants(
      server._id
    );
    return participants;
  }

  async joinServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    const serverUpdated = await this.serverRepository.addServerParticipant(
      server._id,
      username
    );
    this.serverEventRepository.publishUserJoined({
      serverId: serverUpdated._id,
      username: username,
    });
    return serverUpdated;
  }
  async leaveServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsInTheServer(server, username);
    if (server.owner === username) {
      throw new ServerControllerExceptions.OwnerCannotLeave();
    }
    try {
      const serverUpdated = await this.serverRepository.removeServerParticipant(
        id,
        username
      );
      this.serverEventRepository.publishUserLeft({
        serverId: serverUpdated._id,
        username: username,
      });
      return serverUpdated;
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound();
    }
  }

  async kickUserFromTheServer(
    id: string,
    username: string,
    admin: string
  ): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsTheOwner(server, admin);
    if (server.owner === username) {
      throw new ServerControllerExceptions.OwnerCannotLeave();
    }
    try {
      const serverUpdated = await this.serverRepository.removeServerParticipant(
        id,
        username
      );
      this.serverEventRepository.publishUserKicked({
        serverId: serverUpdated._id,
        username: username,
      });
      return serverUpdated;
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound();
    }
  }
}
