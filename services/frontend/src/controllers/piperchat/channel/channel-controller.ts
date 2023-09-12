import {
  CreateChannelApi,
  DeleteChannelApi,
  GetChannelByIdApi,
  GetChannelsApi,
  UpdateChannelApi
} from '@api/piperchat/channel'

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
   * Update a channel
   */
  updateChannel(request: UpdateChannelApi.Request.Type): Promise<UpdateChannelApi.Response>

  /**
   * Delete a channel
   */
  deleteChannel(request: DeleteChannelApi.Request.Type): Promise<DeleteChannelApi.Response>
}
