import { GetDirectMessagesApi, SendDirectMessageApi } from '@api/messages/direct'
export interface DirectController {
  /**
   * Get direct messages between two users using as pagination the "from" and "limit" query params
   */
  getDirectMessagesPaginated(
    request: GetDirectMessagesApi.Request.Type
  ): Promise<GetDirectMessagesApi.Response>

  /**
   * Send a direct message from one user to another
   */
  sendDirectMessage(
    request: SendDirectMessageApi.Request.Type
  ): Promise<SendDirectMessageApi.Response>
}
