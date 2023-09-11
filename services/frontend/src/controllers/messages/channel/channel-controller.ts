import { GetChannelMessagesApi, SendMessageInChannelApi } from '@api/messages/channel'
export interface ChannelController {
  /**
   * Get paginated messages in a channel
   */
  getChannelMessagesPaginated(
    request: GetChannelMessagesApi.Request.Type
  ): Promise<GetChannelMessagesApi.Response>

  /**
   * Send a message in a channel
   */
  sendMessage(
    request: SendMessageInChannelApi.Request.Type
  ): Promise<SendMessageInChannelApi.Response>
}
