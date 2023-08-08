import { MessageChannel } from "../../models/message-channel-model";

export interface MessageChannelController {
  /**
   * Create a message channel
   * @param serverId
   * @param username
   * @param name the name of the message channel
   * @returns the created message channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MessageChannelAlreadyExists} if the message channel already exists
   * @throws {MessageChannelNameInvalid} if the message channel name is invalid
   */
  createMessageChannel(
    serverId: number,
    username: string,
    name: string
  ): Promise<MessageChannel>;

  /**
   * Update a message channel
   * @param id the id of the message channel
   * @param username the username of the user
   * @param name? the new name of the message channel
   * @returns the updated message channel
   * @throws {MessageChannelNotFound} if the message channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {MessageChannelAlreadyExists} if the message channel already exists
   * @throws {MessageChannelNameInvalid} if the message channel name is invalid
   */
  updateMessageChannel(
    id: number,
    username: string,
    name?: string
  ): Promise<MessageChannel>;

  /**
   * Delete a message channel
   * @param id
   * @returns the deleted message channel
   * @throws {MessageChannelNotFound} if the message channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteMessageChannel(id: number): Promise<MessageChannel>;
}

export class MessageChannelControllerExceptions {
  static ServerNotFound = class extends Error {};
  static UserNotAuthorized = class extends Error {};
  static MessageChannelAlreadyExists = class extends Error {};
  static MessageChannelNameInvalid = class extends Error {};
  static MessageChannelNotFound = class extends Error {};
}
