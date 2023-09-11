export interface ChannelController {
  /**
   * Get achannel by server id
   * @param serverId the id of the server
   * @returns the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  getChannels(serverId: string): Promise<any>

  /**
   * Get achannel by id
   * @param serverId the id of the server
   * @param channelId the id of the channel
   * @returns the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   * @throws {ChannelNotFound} if the channel does not exist
   */
  getChannelById(serverId: string, channelId: string): Promise<any>

  /**
   * Create achannel
   * @param serverId
   * @param name the name of the channel
   * @param channelType the type of the channel
   * @param description? the description of the channel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {ChannelAlreadyExists} if the channel already exists
   */
  createChannel(
    serverId: string,
    name: string,
    channelType: string,
    description?: string
  ): Promise<any>

  /**
   * Update achannel
   * @param serverId the id of the channel
   * @param channelId the id of the channel
   * @param name? the new name of the channel
   * @param description? the new description of the channel
   * @returns the updatedchannel
   * @throws {ServerNotFound} if the server does not exist
   * @throws {ChannelNotFound} if the channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {ChannelAlreadyExists} if the channel already exists
   */
  updateChannel(
    serverId: string,
    channelId: string,
    name?: string,
    description?: string
  ): Promise<any>

  /**
   * Delete achannel
   * @param serverId the id of the server
   * @param channelId the id of the channel
   * @returns the deletedchannel
   * @throws {ChannelNotFound} if the channel does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {ChannelNotFound} if the channel does not exist
   */
  deleteChannel(serverId: string, channelId: string): Promise<any>
}
