import { AxiosController } from '@/controllers/axios-controller'
import type { ChannelController } from './channel-controller'
import { GetChannelMessagesApi, SendMessageInChannelApi } from '@api/messages/channel'

export class ChannelControllerImpl extends AxiosController implements ChannelController {
  async getChannelMessagesPaginated(
    request: GetChannelMessagesApi.Request.Type
  ): Promise<GetChannelMessagesApi.Response> {
    const params = request as GetChannelMessagesApi.Request.Params
    const query = request as GetChannelMessagesApi.Request.Query
    return await this.get<GetChannelMessagesApi.Response>(
      `/servers/${params.serverId}/channels/${params.channelId}/messages?from=${query.from}&limit=${query.limit}`
    )
  }

  async sendMessage(
    request: SendMessageInChannelApi.Request.Type
  ): Promise<SendMessageInChannelApi.Response> {
    const params = request as SendMessageInChannelApi.Request.Params
    const body = request as SendMessageInChannelApi.Request.Body
    return await this.post<SendMessageInChannelApi.Response>(
      `/servers/${params.serverId}/channels/${params.channelId}/messages`,
      body
    )
  }
}
