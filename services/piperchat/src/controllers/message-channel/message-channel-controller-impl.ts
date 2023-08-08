import {
  MessageChannelController,
  MessageChannelControllerExceptions,
} from "./message-channel-controller";
import { MessageChannel } from "../../models/message-channel-model";
import { MessageChannelRepository } from "../../repositories/message-channel/message-channel-repository";
import { MessageChannelRepositoryImpl } from "../../repositories/message-channel/message-channel-repository-impl";
import { Checker } from "../checker";

export class MessageChannelControllerImpl implements MessageChannelController {
  private messageChannelRepository: MessageChannelRepository =
    new MessageChannelRepositoryImpl();
  private checker = new Checker();

  async getChannels(
    serverId: number,
    username: string
  ): Promise<MessageChannel[]> {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    return await this.messageChannelRepository.getMessageChannels(serverId);
  }

  async getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel> {
    const server = await this.checker.getServerIfExists(serverId);
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
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
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
    const server = await this.checker.getServerIfExists(serverId);
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
  ): Promise<void> {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      await this.messageChannelRepository.deleteMessageChannel(
        serverId,
        channelId
      );
    } catch (e) {
      throw new MessageChannelControllerExceptions.MessageChannelNotFound();
    }
  }
}
