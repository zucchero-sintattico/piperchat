import { RabbitMQ } from '@commons/utils/rabbit-mq'
import { UserJoinedDirectCall, UserLeftDirectCall } from '@messages-api/directs'
import {
  UserJoinedMultimediaChannel,
  UserLeftMultimediaChannel,
} from '@messages-api/channels'

export interface EventsRepository {
  publishUserJoinedChannelEvent(
    serverId: string,
    channelId: string,
    userId: string
  ): Promise<void>
  publishUserLeftChannelEvent(
    serverId: string,
    channelId: string,
    userId: string
  ): Promise<void>
  publishUserJoinedDirectSessionEvent(userId: string, friendId: string): Promise<void>
  publishUserLeftDirectSessionEvent(userId: string, friendId: string): Promise<void>
}

export class EventsRepositoryImpl implements EventsRepository {
  private broker: RabbitMQ = RabbitMQ.getInstance()
  async publishUserJoinedChannelEvent(
    serverId: string,
    channelId: string,
    userId: string
  ): Promise<void> {
    await this.broker.publish(
      UserJoinedMultimediaChannel,
      new UserJoinedMultimediaChannel({
        serverId,
        channelId,
        username: userId,
      })
    )
  }

  async publishUserLeftChannelEvent(
    serverId: string,
    channelId: string,
    userId: string
  ): Promise<void> {
    await this.broker.publish(
      UserLeftMultimediaChannel,
      new UserLeftMultimediaChannel({
        serverId,
        channelId,
        username: userId,
      })
    )
  }

  async publishUserJoinedDirectSessionEvent(
    userId: string,
    friendId: string
  ): Promise<void> {
    await this.broker.publish(
      UserJoinedDirectCall,
      new UserJoinedDirectCall({
        joiner: userId,
        other: friendId,
      })
    )
  }

  async publishUserLeftDirectSessionEvent(
    userId: string,
    friendId: string
  ): Promise<void> {
    await this.broker.publish(
      UserLeftDirectCall,
      new UserLeftDirectCall({
        leaver: userId,
        other: friendId,
      })
    )
  }
}
