import { Channel } from "../../models/channel-model";
export interface ChannelRepository {
  /**
   * Returns all  channels for a given server.
   * @param serverId
   * @returns All channels for the given server.
   * @throws If the server could not be found.
   * @throws If the channels could not be found.
   * @throws If the channels could not be returned.
   */
  getChannels(serverId: number): Promise<Channel[]>;

  /**
   * Creates a new channel for a given server.
   * @param serverId
   * @param name
   * @param channelType
   * @param description
   * @throws If the server could not be found.
   * @throws If the channel could not be created.
   * @throws If the channel could not be returned.
   */
  createChannel(
    serverId: number,
    name: string,
    channelType: string,
    description?: string
  ): Promise<void>;

  /**
   * Gets a channel by its id.
   * @param serverId
   * @param channelId
   * @returns The channel with the given id.
   * @throws If the server could not be found.
   * @throws If the channel could not be found.
   * @throws If the channel could not be returned.
   */
  getChannelById(serverId: number, channelId: number): Promise<Channel>;

  /**
   * Updates a channel by its id.
   * @param serverId
   * @param channelId
   * @param name
   * @param description
   * @throws If the server could not be found.
   * @throws If the channel could not be found.
   * @throws If the channel could not be updated.
   * @throws If the channel could not be returned.
   */
  updateChannel(
    serverId: number,
    channelId: number,
    name?: string,
    description?: string
  ): Promise<void>;

  /**
   * Deletes a channel by its id.
   * @param serverId
   * @param channelId
   * @throws If the server could not be found.
   * @throws If the channel could not be found.
   * @throws If the channel could not be deleted.
   */
  deleteChannel(serverId: number, channelId: number): Promise<void>;
}
