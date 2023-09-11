export interface ChannelController {
  /**
   * Get all the channels in a server
   * @param serverId
   * @returns {Promise<MessageChannel[]>}
   */
  getChannels(serverId: string): Promise<MessageChannel[]>

  /**
   * Create a new channel
   * @param serverId
   * @param channelId
   * @returns {Promise<void>}
   */
  createChannel(serverId: string, channelId: string): Promise<void>

  /**
   * Delete a channel
   * @param channelId
   * @param serverId
   * @returns {Promise<void>}
   */
  deleteChannel(channelId: string, serverId: string): Promise<void>

  /**
   * Get channel information
   * @param channelId
   * @param serverId
   * @returns {Promise<MessageChannel>}
   */
  getChannel(channelId: string, serverId: string): Promise<MessageChannel>

  /**
   * Get paginated messages in a channel
   * @param channelId
   * @param serverId
   * @param from
   * @param limit
   * @returns {Promise<Message[]>}
   * @throws ChannelNotFound if the channel does not exist
   * @throws UserNotAuthorized if the user is not authorized to access the channel
   * @throws ServerNotFound if the server does not exist
   */
  getChannelMessagesPaginated(
    channelId: string,
    serverId: string,
    from: number,
    limit: number
  ): Promise<any>

  /**
   * Send a message in a channel
   * @param channelId
   * @param serverId
   * @param content
   * @returns {Promise<void>}
   * @throws ChannelNotFound if the channel does not exist
   * @throws UserNotAuthorized if the user is not authorized to access the channel
   * @throws ServerNotFound if the server does not exist
   */
  sendMessage(channelId: string, serverId: string, content: string): Promise<any>
}
