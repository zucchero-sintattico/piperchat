import { Server } from '@models/server-model'
import { ServerRepository } from '@repositories/server/server-repository'
import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { Checker } from '../checker'
import { ServerController, ServerControllerExceptions } from './server-controller'
import { RabbitMQ } from '@commons/utils/rabbit-mq'

import {
  ServerCreated,
  ServerUpdated,
  ServerDeleted,
  UserJoinedServer,
  UserLeftServer,
  UserKickedFromServer,
} from '@messages-api/servers'

export class ServerControllerImpl implements ServerController {
  private serverRepository: ServerRepository = new ServerRepositoryImpl()
  private checker = new Checker()

  async createServer(name: string, description: string, owner: string): Promise<Server> {
    const server = await this.serverRepository.createServer(name, description, owner)

    await RabbitMQ.getInstance().publish(
      ServerCreated,
      new ServerCreated({
        id: server.id,
        name: server.name,
        description: server.description,
        owner: server.owner,
      })
    )

    return server
  }
  async getServers(username: string): Promise<Server[]> {
    try {
      return await this.serverRepository.getServers(username)
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound()
    }
  }
  async getServer(id: string): Promise<Server> {
    try {
      return await this.serverRepository.getServerById(id)
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound()
    }
  }
  async updateServer(
    id: string,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<Server> {
    // check if user is owner
    const server = await this.checker.getServerIfExists(id)
    this.checker.checkIfUserIsTheOwner(server, username)
    try {
      const serverUpdated = await this.serverRepository.updateServerById(
        id,
        name,
        description
      )
      await RabbitMQ.getInstance().publish(
        ServerUpdated,
        new ServerUpdated({
          id: serverUpdated.id.toString(),
          name: serverUpdated.name,
          description: serverUpdated.description,
        })
      )
      return serverUpdated
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound()
    }
  }
  async deleteServer(id: string, username: string): Promise<void> {
    const server = await this.checker.getServerIfExists(id)
    // check if user is owner
    this.checker.checkIfUserIsTheOwner(server, username)
    try {
      await this.serverRepository.deleteServerById(id)
      await RabbitMQ.getInstance().publish(
        ServerDeleted,
        new ServerDeleted({
          id: id,
        })
      )
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound()
    }
  }

  async getServerParticipants(id: string, username: string): Promise<string[]> {
    const server = await this.checker.getServerIfExists(id)
    // check if user is in server
    this.checker.checkIfUserIsInTheServer(server, username)
    const participants = await this.serverRepository.getServerParticipants(server.id)
    return participants
  }

  async joinServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id)
    const serverUpdated = await this.serverRepository.addServerParticipant(
      server.id,
      username
    )
    await RabbitMQ.getInstance().publish(
      UserJoinedServer,
      new UserJoinedServer({
        serverId: serverUpdated.id.toString(),
        username: username,
      })
    )
    return serverUpdated
  }
  async leaveServer(id: string, username: string): Promise<Server> {
    const server = await this.checker.getServerIfExists(id)
    this.checker.checkIfUserIsInTheServer(server, username)
    if (server.owner === username) {
      throw new ServerControllerExceptions.OwnerCannotLeave()
    }
    try {
      const serverUpdated = await this.serverRepository.removeServerParticipant(
        id,
        username
      )
      await RabbitMQ.getInstance().publish(
        UserLeftServer,
        new UserLeftServer({
          serverId: serverUpdated.id.toString(),
          username: username,
        })
      )
      return serverUpdated
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound()
    }
  }

  async kickUserFromTheServer(
    id: string,
    username: string,
    admin: string
  ): Promise<Server> {
    const server = await this.checker.getServerIfExists(id)
    this.checker.checkIfUserIsTheOwner(server, admin)
    if (server.owner === username) {
      throw new ServerControllerExceptions.OwnerCannotLeave()
    }
    try {
      const serverUpdated = await this.serverRepository.removeServerParticipant(
        id,
        username
      )
      await RabbitMQ.getInstance().publish(
        UserKickedFromServer,
        new UserKickedFromServer({
          serverId: serverUpdated.id.toString(),
          username: username,
        })
      )
      return serverUpdated
    } catch (e) {
      throw new ServerControllerExceptions.UserNotFound()
    }
  }
}
