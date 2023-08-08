import { MessageChannel } from "../../models/message-channel-model";

export interface MessageChannelController {
  /**
   * Get a message channel by server id
   * @param serverId the id of the server
   * @param username the username of the user
   * @returns the message channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  getChannels(serverId: number, username: string): Promise<MessageChannel[]>;

  /**
   * Get a message channel by id
   * @param serverId the id of the server
   * @param channelId the id of the message channel
   * @param username the username of the user
   * @returns the message channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   * @throws {MessageChannelNotFound} if the message channel does not exist
   */
  getChannelById(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel>;

  /**
   * Create a message channel
   * @param serverId
   * @param username
   * @param name the name of the message channel
   * @param description? the description of the message channel
   * @returns the created message channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MessageChannelAlreadyExists} if the message channel already exists
   */
  createMessageChannel(
    serverId: number,
    username: string,
    name: string,
    description?: string
  ): Promise<MessageChannel>;

  /**
   * Update a message channel
   * @param serverId the id of the message channel
   * @param channelId the id of the message channel
   * @param username the username of the user
   * @param name? the new name of the message channel
   * @param description? the new description of the message channel
   * @returns the updated message channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {MessageChannelNotFound} if the message channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MessageChannelAlreadyExists} if the message channel already exists
   */
  updateMessageChannel(
    serverId: number,
    channelId: number,
    username: string,
    name?: string,
    description?: string
  ): Promise<MessageChannel>;

  /**
   * Delete a message channel
   * @param serverId the id of the server
   * @param channelId the id of the message channel
   * @param username the username of the user
   * @returns the deleted message channel
   * @throws {MessageChannelNotFound} if the message channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteMessageChannel(
    serverId: number,
    channelId: number,
    username: string
  ): Promise<MessageChannel>;
}

export class MessageChannelControllerExceptions {
  static ServerNotFound = class extends Error {};
  static UserNotAuthorized = class extends Error {};
  static MessageChannelAlreadyExists = class extends Error {};
  static MessageChannelNotFound = class extends Error {};
}
