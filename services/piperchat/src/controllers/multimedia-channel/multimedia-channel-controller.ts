import { MultimediaChannel } from "../../models/multimedia-channel-model";

export interface MultimediaChannelController {
  /**
   * Get a multimedia channel by server id
   * @param serverId the id of the server
   * @param username the username of the user
   * @returns the multimedia channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  getChannels(serverId: number, username: string): Promise<MultimediaChannel[]>;

  /**
   * Get a multimedia channel by id
   * @param serverId the id of the server
   * @param channelId the id of the multimedia channel
   * @param username the username of the user
   * @returns the multimedia channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   * @throws {MultimediaChannelNotFound} if the multimedia channel does not exist
   */
  getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MultimediaChannel>;

  /**
   * Create a multimedia channel
   * @param serverId
   * @param username
   * @param name the name of the multimedia channel
   * @param description? the description of the multimedia channel
   * @returns the created multimedia channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MultimediaChannelAlreadyExists} if the multimedia channel already exists
   */
  createMultimediaChannel(
    serverId: number,
    username: string,
    name: string,
    description?: string
  ): Promise<MultimediaChannel>;

  /**
   * Update a multimedia channel
   * @param serverId the id of the multimedia channel
   * @param channelId the id of the multimedia channel
   * @param username the username of the user
   * @param name? the new name of the multimedia channel
   * @param description? the new description of the multimedia channel
   * @returns the updated multimedia channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {MultimediaChannelNotFound} if the multimedia channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MultimediaChannelAlreadyExists} if the multimedia channel already exists
   */
  updateMultimediaChannel(
    serverId: number,
    channelId: number,
    username: string,
    name?: string,
    description?: string
  ): Promise<MultimediaChannel>;

  /**
   * Delete a multimedia channel
   * @param serverId the id of the server
   * @param channelId the id of the multimedia channel
   * @param username the username of the user
   * @throws {ServerNotFound} if the server does not exist
   * @throws {MultimediaChannelNotFound} if the multimedia channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteMultimediaChannel(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<void>;
}

export class MultimediaChannelControllerExceptions {
  static ServerNotFound = class extends Error {};
  static UserNotAuthorized = class extends Error {};
  static MultimediaChannelAlreadyExists = class extends Error {};
}
