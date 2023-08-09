import {
  ChannelController,
  ChannelControllerExceptions,
} from "./channel-controller";
import { ChannelRepository } from "../../repositories/channel/channel-repository";
import { ChannelRepositoryImpl } from "../../repositories/channel/channel-repository-impl";
import { Checker } from "../checker";

export class ChannelControllerImpl implements ChannelController {
  private channelRepository: ChannelRepository = new ChannelRepositoryImpl();
  private checker = new Checker();

  async getChannels(serverId: number, username: string) {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    return await this.channelRepository.getChannels(serverId);
  }

  async getChannelById(serverId: number, channelId: number, username: string) {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsInTheServer(server, username);
    try {
      return await this.channelRepository.getChannelById(serverId, channelId);
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound();
    }
  }

  async createChannel(
    serverId: number,
    username: string,
    name: string,
    channelType: string,
    description?: string | undefined
  ) {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    await this.checker.checkIfChannelAlreadyExists(serverId, name);
    await this.channelRepository.createChannel(
      serverId,
      name,
      channelType,
      description
    );
  }

  async updateChannel(
    serverId: number,
    channelId: number,
    username: string,
    name?: string | undefined,
    description?: string | undefined
  ) {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    if (name) {
      await this.checker.checkIfChannelAlreadyExists(serverId, name);
    }
    try {
      await this.channelRepository.updateChannel(
        serverId,
        channelId,
        name,
        description
      );
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound();
    }
  }

  async deleteChannel(serverId: number, channelId: number, username: string) {
    const server = await this.checker.getServerIfExists(serverId);
    this.checker.checkIfUserIsTheOwner(server, username);
    try {
      await this.channelRepository.deleteChannel(serverId, channelId);
    } catch (e) {
      throw new ChannelControllerExceptions.ChannelNotFound();
    }
  }
}
