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
      await this.createDirect(username1, username2)
      return []
    }
    return direct.get('messages').slice(from, from + limit)
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
      await this.createDirect(username1, username2)
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
