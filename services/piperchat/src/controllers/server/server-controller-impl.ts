import { Server } from "../../models/server-model";
import { ServerRepository } from "../../repositories/server/server-repository";
import { ServerRepositoryImpl } from "../../repositories/server/server-repository-impl";
import { Checker } from "../checker";
import {
  ServerController,
  ServerControllerExceptions,
} from "./server-controller";

export class ServerControllerImpl implements ServerController {
  private serverRepository: ServerRepository = new ServerRepositoryImpl();
  private checker = new Checker();

  async createServer(
    name: string,
    description: string,
    owner: string
  ): Promise<Server> {
    return await this.serverRepository.createServer(name, description, owner);
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
    const server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsTheOwner(server, username);
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
  async deleteServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    // check if user is owner
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      return await this.serverRepository.deleteServerById(id);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
  }

  async getServerParticipants(id: string, username: string): Promise<string[]> {
    const server = await this.checker.getServerIfExists(id);
    // check if user is in server
    this.checker.checkIfUserIsInTheServer(server, username);
    const participants = await this.serverRepository.getServerParticipants(id);
    return participants;
  }

  async joinServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      return await this.serverRepository.addServerParticipant(id, username);
    } catch (e) {
      throw new ServerControllerExceptions.UserAlreadyJoined();
    }
  }
  async leaveServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id);
    this.checker.checkIfUserIsInTheServer(server, username);
    if (server.owner === username) {
      throw new ServerControllerExceptions.OwnerCannotLeave();
    }
    try {
      return await this.serverRepository.removeServerParticipant(id, username);
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
      return await this.serverRepository.removeServerParticipant(id, username);
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound();
    }
  }
}
