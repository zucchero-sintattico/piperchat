import {
  MessageChannelController,
  MessageChannelControllerExceptions,
} from "./message-channel-controller";
import { MessageChannel } from "../../models/message-channel-model";
import { MessageChannelRepository } from "../../repositories/message-channel/message-channel-repository";
import { MessageChannelRepositoryImpl } from "../../repositories/message-channel/message-channel-repository-impl";
import { ServerControllerExceptions } from "../server/server-controller";
import { ServerRepository } from "../../repositories/server/server-repository";
import { ServerRepositoryImpl } from "../../repositories/server/server-repository-impl";
import { Server } from "../../models/server-model";

export class MessageChannelControllerImpl implements MessageChannelController {
  private messageChannelRepository: MessageChannelRepository =
    new MessageChannelRepositoryImpl();
  private serverRepository: ServerRepository = new ServerRepositoryImpl();

  private checkIfUserIsInTheServer(server: Server, username: string) {
    if (!server.participants.includes(username)) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
  }

  private async checkIfServerExists(serverId: number) {
    try {
      var server = await this.serverRepository.getServerById(serverId);
    } catch (e) {
      throw new ServerControllerExceptions.ServerNotFound();
    }
    return server;
  }

  private async checkIfChannelAlreadyExists(serverId: number, name: string) {
    const channels = await this.messageChannelRepository.getMessageChannels(
      serverId
    );
    if (channels.find((channel) => channel.name == name)) {
      throw new MessageChannelControllerExceptions.MessageChannelAlreadyExists();
    }
  }

  private checkIfUserIsTheOwner(server: Server, username: string) {
    if (server.owner != username) {
      throw new ServerControllerExceptions.UserNotAuthorized();
    }
  }

  async getChannels(
    serverId: number,
    username: string
  ): Promise<MessageChannel[]> {
    const server = await this.checkIfServerExists(serverId);
    this.checkIfUserIsInTheServer(server, username);
    return await this.messageChannelRepository.getMessageChannels(serverId);
  }

  async getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel> {
    const server = await this.checkIfServerExists(serverId);
    this.checkIfUserIsInTheServer(server, username);
    try {
      return await this.messageChannelRepository.getChannelById(
        serverId,
        channelId
      );
    } catch (e) {
      throw new MessageChannelControllerExceptions.MessageChannelNotFound();
    }
  }

  async createMessageChannel(
    serverId: number,
    username: string,
    name: string,
    description?: string | undefined
  ): Promise<MessageChannel> {
    const server = await this.checkIfServerExists(serverId);
    this.checkIfUserIsTheOwner(server, username);
    // check if message channel already exists
    await this.checkIfChannelAlreadyExists(serverId, name);
    return await this.messageChannelRepository.createMessageChannel(
      serverId,
      name,
      description
    );
  }

  async updateMessageChannel(
    serverId: number,
    channelId: number,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ): Promise<MessageChannel> {
    const server = await this.checkIfServerExists(serverId);
    this.checkIfUserIsTheOwner(server, username);
    if (name) {
      await this.checkIfChannelAlreadyExists(serverId, name);
    }
    try {
      return await this.messageChannelRepository.updateMessageChannel(
        serverId,
        channelId,
        name,
        description
      );
    } catch (e) {
      throw new MessageChannelControllerExceptions.MessageChannelNotFound();
    }
  }

  async deleteMessageChannel(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel> {
    const server = await this.checkIfServerExists(serverId);
    this.checkIfUserIsTheOwner(server, username);
    try {
      return await this.messageChannelRepository.deleteMessageChannel(
        serverId,
        channelId
      );
    } catch (e) {
      throw new MessageChannelControllerExceptions.MessageChannelNotFound();
    }
  }
}
