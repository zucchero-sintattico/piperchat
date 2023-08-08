import { MultimediaChannel } from "../../models/multimedia-channel-model";

export interface MultimediaChannelRepository {
  /**
   * Returns all multimedia channels for a given server.
   * @param serverId
   * @returns All multimedia channels for the given server.
   * @throws If the server could not be found.
   * @throws If the multimedia channels could not be found.
   * @throws If the multimedia channels could not be returned.
   */
  getMultimediaChannels(serverId: number): Promise<MultimediaChannel[]>;

  /**
   * Creates a new multimedia channel for a given server.
   * @param serverId
   * @param multimediaChannel
   * @returns The created multimedia channel.
   * @throws If the server could not be found.
   * @throws If the multimedia channel could not be created.
   * @throws If the multimedia channel could not be returned.
   */
  createMultimediaChannel(
    serverId: number,
    multimediaChannel: MultimediaChannel
  ): Promise<MultimediaChannel>;

  /**
   * Gets a multimedia channel by its id.
   * @param serverId
   * @param channelId
   * @returns The multimedia channel with the given id.
   * @throws If the server could not be found.
   * @throws If the multimedia channel could not be found.
   * @throws If the multimedia channel could not be returned.
   */
  getChannelById(
    serverId: number,
    channelId: number
  ): Promise<MultimediaChannel>;

  /**
   * Updates a multimedia channel by its id.
   * @param serverId
   * @param channelId
   * @param multimediaChannel
   * @returns The updated multimedia channel.
   * @throws If the server could not be found.
   * @throws If the multimedia channel could not be found.
   * @throws If the multimedia channel could not be updated.
   * @throws If the multimedia channel could not be returned.
   */
  updateMultimediaChannel(
    serverId: number,
    channelId: number,
    multimediaChannel: MultimediaChannel
  ): Promise<MultimediaChannel>;

  /**
   * Deletes a multimedia channel by its id.
   * @param serverId
   * @param channelId
   * @returns The deleted multimedia channel.
   * @throws If the server could not be found.
   * @throws If the multimedia channel could not be found.
   * @throws If the multimedia channel could not be deleted.
   */
  deleteMultimediaChannel(
    serverId: number,
    channelId: number
  ): Promise<MultimediaChannel>;
}
