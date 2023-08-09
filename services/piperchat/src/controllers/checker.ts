import { Server } from "../models/server-model";
import { ChannelRepository } from "../repositories/channel/channel-repository";
import { MessageChannelRepositoryImpl } from "../repositories/channel/channel-repository-impl";
import { ServerRepositoryImpl } from "../repositories/server/server-repository-impl";
import { MessageChannelControllerExceptions } from "./channel/channel-controller";
import { ServerControllerExceptions } from "./server/server-controller";

/**
 * This class is used to check if some conditions are met before executing some actions.
 */
export class Checker {
  private messageChannelRepository: ChannelRepository =
    new MessageChannelRepositoryImpl();
  private serverRepository: ServerRepositoryImpl = new ServerRepositoryImpl();
  public checkIfUserIsInTheServer(server: Server, username: string) {
    if (!server.participants.includes(username)) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
  }

  public async getServerIfExists(serverId: number) {
    try {
      var server = await this.serverRepository.getServerById(serverId);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
    return server;
  }

  public async checkIfChannelAlreadyExists(serverId: number, name: string) {
    const channels = await this.messageChannelRepository.getChannels(serverId);
    if (channels.find((channel) => channel.name == name)) {
      throw new MessageChannelControllerExceptions.MessageChannelAlreadyExists();
    }
  }

  public checkIfUserIsTheOwner(server: Server, username: string) {
    if (server.owner != username) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
  }
}
