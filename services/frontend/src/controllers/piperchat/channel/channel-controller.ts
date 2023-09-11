import { CreateChannelApi, GetChannelByIdApi, GetChannelsApi } from '@api/piperchat/channel'
export interface ChannelController {
  /**
   * Get channel by server id
   */
  getChannels(request: GetChannelsApi.Request.Type): Promise<GetChannelsApi.Response>

  /**
   * Get channel by id
   */
  getChannelById(request: GetChannelByIdApi.Request.Type): Promise<GetChannelByIdApi.Response>

  /**
   * Create a channel
   */
  createChannel(request: CreateChannelApi.Request.Type): Promise<CreateChannelApi.Response>

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
