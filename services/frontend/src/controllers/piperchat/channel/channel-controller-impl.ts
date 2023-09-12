import type {
  CreateChannelApi,
  DeleteChannelApi,
  GetChannelByIdApi,
  GetChannelsApi,
  UpdateChannelApi
} from '@api/piperchat/channel'
import type { ChannelController } from './channel-controller'
import { AxiosController } from '@/controllers/axios-controller'

export class ChannelControllerImpl extends AxiosController implements ChannelController {
  async deleteChannel(request: DeleteChannelApi.Request.Type): Promise<DeleteChannelApi.Response> {
    const params = request as DeleteChannelApi.Request.Params
    return await this.delete<DeleteChannelApi.Response>(
      `/servers/${params.serverId}/channels/${params.channelId}`
    )
  }

  async getChannels(request: GetChannelsApi.Request.Type): Promise<GetChannelsApi.Response> {
    const params = request as GetChannelsApi.Request.Params
    return await this.get<GetChannelsApi.Response>(`/servers/${params.serverId}/channels`)
  }

  async getChannelById(
    request: GetChannelByIdApi.Request.Type
  ): Promise<GetChannelByIdApi.Response> {
    const params = request as GetChannelByIdApi.Request.Params
    return await this.get<GetChannelByIdApi.Response>(
      `/servers/${params.serverId}/channels/${params.channelId}`
    )
  }

  async createChannel(request: CreateChannelApi.Request.Type): Promise<CreateChannelApi.Response> {
    const params = request as CreateChannelApi.Request.Params
    const body = request as CreateChannelApi.Request.Body
    return await this.post<CreateChannelApi.Response>(`/servers/${params.serverId}/channels`, body)
  }

  async updateChannel(request: UpdateChannelApi.Request.Type): Promise<UpdateChannelApi.Response> {
    const params = request as UpdateChannelApi.Request.Params
    const body = request as UpdateChannelApi.Request.Body
    return await this.put<UpdateChannelApi.Response>(
      `/servers/${params.serverId}/channels/${params.channelId}`,
      body
    )
  }
}
