import { Channel } from "../../models/channel-model";

export interface ChannelController {
  /**
   * Get achannel by server id
   * @param serverId the id of the server
   * @param username the username of the user
   * @returns the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  getChannels(serverId: number, username: string): Promise<Channel[]>;

  /**
   * Get achannel by id
   * @param serverId the id of the server
   * @param channelId the id of the channel
   * @param username the username of the user
   * @returns the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   * @throws {ChannelNotFound} if the channel does not exist
   */
  getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<Channel>;

  /**
   * Create achannel
   * @param serverId
   * @param username
   * @param name the name of the channel
   * @param channelType the type of the channel
   * @param description? the description of the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {ChannelAlreadyExists} if the channel already exists
   */
  createChannel(
    serverId: number,
    username: string,
    name: string,
    channelType: string,
    description?: string
  ): Promise<void>;

  /**
   * Update achannel
   * @param serverId the id of the channel
   * @param channelId the id of the channel
   * @param username the username of the user
   * @param name? the new name of the channel
   * @param description? the new description of the channel
   * @returns the updatedchannel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {ChannelNotFound} if the channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {ChannelAlreadyExists} if the channel already exists
   */
  updateChannel(
    serverId: number,
    channelId: number,
    username: string,
    name?: string,
    description?: string
  ): Promise<void>;

  /**
   * Delete achannel
   * @param serverId the id of the server
   * @param channelId the id of the channel
   * @param username the username of the user
   * @returns the deletedchannel
   * @throws {ChannelNotFound} if the channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteChannel(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<void>;
}

export class ChannelControllerExceptions {
  static ServerNotFound = class extends Error {};
  static UserNotAuthorized = class extends Error {};
  static ChannelAlreadyExists = class extends Error {};
  static ChannelNotFound = class extends Error {};
}
