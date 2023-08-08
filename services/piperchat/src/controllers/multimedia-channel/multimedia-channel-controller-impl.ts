import { MessageChannel } from "../../models/message-channel-model";
import { MultimediaChannelRepository } from "../../repositories/multimedia-channel/multimedia-channel-repository";
import { MultimediaChannelRepositoryImpl } from "../../repositories/multimedia-channel/multimedia-channel-repository-impl";
import { Checker } from "../checker";
import {
  MessageChannelController,
  MessageChannelControllerExceptions,
} from "../message-channel/message-channel-controller";

export class MessageChannelControllerImpl implements MessageChannelController {
  private multimediaChannelRepository: MultimediaChannelRepository =
    new MultimediaChannelRepositoryImpl();
  private checker = new Checker();

  async getChannels(
    serverId: number,
    username: string
  ): Promise<MessageChannel[]> {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    return await this.multimediaChannelRepository.getMultimediaChannels(
      serverId
    );
  }

  async getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel> {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    try {
      return await this.multimediaChannelRepository.getChannelById(
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
    return await this.multimediaChannelRepository.createMultimediaChannel(
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
      return await this.multimediaChannelRepository.updateMultimediaChannel(
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
      await this.multimediaChannelRepository.deleteMultimediaChannel(
        serverId,
        channelId
      );
    } catch (e) {
      throw new MessageChannelControllerExceptions.MessageChannelNotFound();
    }
  }
}
