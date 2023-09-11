import { DirectController } from './direct-controller'

import { DirectRepository } from '@repositories/direct/direct-repository'
import { Message } from '@models/messages-model'
import { DirectRepositoryImpl } from '@repositories/direct/direct-repository-impl'
import { MessageEventsRepository } from '@/events/repositories/message-events-repository'
import { MessageEventsRepositoryImpl } from '@/events/repositories/message-events-repository-impl'

export class DirectControllerImpl implements DirectController {
  private directRepository: DirectRepository = new DirectRepositoryImpl()
  private messageEventRepository: MessageEventsRepository =
    new MessageEventsRepositoryImpl()

  async getDirectMessagesPaginated(
    username1: string,
    username2: string,
    from: number,
    limit: number
  ): Promise<Message[]> {
    return await this.directRepository.getDirectMessagesPaginated(
      username1,
      username2,
      from,
      limit
    )
  }

  async sendDirectMessage(
    username1: string,
    username2: string,
    message: string
  ): Promise<void> {
    await this.directRepository.sendDirectMessage(username1, username2, message)
    this.messageEventRepository.publishNewMessageOnDirect({
      sender: username1,
      receiver: username2,
      message: message,
    })
  }
}
