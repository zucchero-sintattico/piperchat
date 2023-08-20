import { BasicEventsRepository } from '@piperchat/commons'
import { MessageEventsRepository } from './message-events-repository'

export class MessageEventsRepositoryImpl
  extends BasicEventsRepository
  implements MessageEventsRepository
{
  async publishNewMessageOnChannel(payload: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish(
        'messages',
        'message.channel.sent',
        Buffer.from(JSON.stringify(payload))
      )
    }
  }

  async publishNewMessageOnDirect(payload: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish(
        'messages',
        'message.direct.sent',
        Buffer.from(JSON.stringify(payload))
      )
    }
  }
}
