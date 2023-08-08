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
import { Checker } from "../checker";

export class MessageChannelControllerImpl implements MessageChannelController {
  private messageChannelRepository: MessageChannelRepository =
    new MessageChannelRepositoryImpl();
  private serverRepository: ServerRepository = new ServerRepositoryImpl();

  private checker = new Checker();

  async getChannels(
    serverId: number,
    username: string
  ): Promise<MessageChannel[]> {
    const server = await this.checker.checkIfServerExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    return await this.messageChannelRepository.getMessageChannels(serverId);
  }

  async getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel> {
    const server = await this.checker.checkIfServerExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
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
    const server = await this.checker.checkIfServerExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    // check if message channel already exists
    await this.checker.checkIfChannelAlreadyExists(serverId, name);
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
    const server = await this.checker.checkIfServerExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    if (name) {
      await this.checker.checkIfChannelAlreadyExists(serverId, name);
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
    const server = await this.checker.checkIfServerExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
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
