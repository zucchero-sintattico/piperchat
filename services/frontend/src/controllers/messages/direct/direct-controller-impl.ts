import type { DirectController } from './direct-controller'
import { AxiosController } from '@/controllers/axios-controller'
import { GetDirectMessagesApi, SendDirectMessageApi } from '@api/messages/direct'

export class DirectControllerImpl extends AxiosController implements DirectController {
  async getDirectMessagesPaginated(
    request: GetDirectMessagesApi.Request.Type
  ): Promise<GetDirectMessagesApi.Response> {
    const params = request as GetDirectMessagesApi.Request.Params
    const query = request as GetDirectMessagesApi.Request.Query
    return await this.get<GetDirectMessagesApi.Response>(
      `/users/${params.username}/messages?from=${query.from}&limit=${query.limit}`
    )
  }

  async sendDirectMessage(
    request: SendDirectMessageApi.Request.Type
  ): Promise<SendDirectMessageApi.Response> {
    const params = request as SendDirectMessageApi.Request.Params
    const body = request as SendDirectMessageApi.Request.Body
    return await this.post<SendDirectMessageApi.Response>(
      `/users/${params.username}/messages`,
      body
    )
  }
}
