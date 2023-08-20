import { ChannelEventsRepository } from './channel-events-repository'
import { RabbitMQ } from '@piperchat/commons'
export class ChannelEventsRepositoryImpl implements ChannelEventsRepository {
  private broker: RabbitMQ | undefined

  getChannel() {
    if (!this.broker) {
      this.broker = RabbitMQ.getInstance()
    }
    return this.broker?.getChannel()
  }

  async publishChannelCreated(payload: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish('channels', 'channel.created', Buffer.from(JSON.stringify(payload)))
    }
  }

  async publishChannelUpdated(payload: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish('channels', 'channel.updated', Buffer.from(JSON.stringify(payload)))
    }
  }

  async publishChannelDeleted(payload: any) {
    const channel = this.getChannel()
    if (channel) {
      channel.publish('channels', 'channel.deleted', Buffer.from(JSON.stringify(payload)))
    }
  }
}
