import { MessageChannel } from "../../models/message-channel-model";
export interface MessageChannelRepository {
  /**
   * Returns all message channels for a given server.
   * @param serverId
   * @returns All message channels for the given server.
   * @throws If the server could not be found.
   * @throws If the message channels could not be found.
   * @throws If the message channels could not be returned.
   */
  getMessageChannels(serverId: number): Promise<MessageChannel[]>;

  /**
   * Creates a new message channel for a given server.
   * @param serverId
   * @param messageChannel
   * @returns The created message channel.
   * @throws If the server could not be found.
   * @throws If the message channel could not be created.
   * @throws If the message channel could not be returned.
   */
  createMessageChannel(
    serverId: number,
    messageChannel: MessageChannel
  ): Promise<MessageChannel>;

  /**
   * Gets a message channel by its id.
   * @param serverId
   * @param channelId
   * @returns The message channel with the given id.
   * @throws If the server could not be found.
   * @throws If the message channel could not be found.
   * @throws If the message channel could not be returned.
   */
  getChannelById(serverId: number, channelId: number): Promise<MessageChannel>;

  /**
   * Updates a message channel by its id.
   * @param serverId
   * @param channelId
   * @param messageChannel
   * @returns The updated message channel.
   * @throws If the server could not be found.
   * @throws If the message channel could not be found.
   * @throws If the message channel could not be updated.
   * @throws If the message channel could not be returned.
   */
  updateMessageChannel(
    serverId: number,
    channelId: number,
    messageChannel: MessageChannel
  ): Promise<MessageChannel>;

  /**
   * Deletes a message channel by its id.
   * @param serverId
   * @param channelId
   * @returns The deleted message channel.
   * @throws If the server could not be found.
   * @throws If the message channel could not be found.
   * @throws If the message channel could not be deleted.
   */
  deleteMessageChannel(
    serverId: number,
    channelId: number
  ): Promise<MessageChannel>;
}
