import { DirectRepository } from './direct-repository'
import { Directs, Message } from '@models/messages-model'

export class DirectRepositoryImpl implements DirectRepository {
  async getDirectMessagesPaginated(
    username1: string,
    username2: string,
    from: number,
    limit: number
  ): Promise<Message[]> {
    const direct = await Directs.findOne({
      $or: [
        { participants: [username1, username2] },
        { participants: [username2, username1] },
      ],
    })
    if (!direct) {
      throw new Error('Direct not found')
    }

    if (direct.get('messages').length < from) {
      return []
    }
    return direct
      .get('messages')
      .slice(
        Math.max(direct.get('messages').length - limit - from, 0),
        direct.get('messages').length - from
      )
  }

  async createDirect(username1: string, username2: string): Promise<void> {
    await Directs.create({
      participants: [username1, username2],
    })
  }

  async sendDirectMessage(
    username1: string,
    username2: string,
    message: string
  ): Promise<void> {
    const direct = await Directs.findOne({
      $or: [
        { participants: [username1, username2] },
        { participants: [username2, username1] },
      ],
    })
    if (!direct) {
      throw new Error('Direct not found')
    }
    await Directs.updateOne(
      {
        $or: [
          { participants: [username1, username2] },
          { participants: [username2, username1] },
        ],
      },
      {
        $push: {
          messages: {
            sender: username1,
            content: message,
          },
        },
      }
    )
  }
}
