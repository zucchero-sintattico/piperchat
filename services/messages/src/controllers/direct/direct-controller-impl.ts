import { DirectController } from './direct-controller'

import { DirectRepository } from '@repositories/direct/direct-repository'
import { Message } from '@models/messages-model'
import { DirectRepositoryImpl } from '@repositories/direct/direct-repository-impl'
import { RabbitMQ } from '@commons/utils/rabbit-mq'
import { NewMessageOnDirect } from '@messages-api/directs'
export class DirectControllerImpl implements DirectController {
  private directRepository: DirectRepository = new DirectRepositoryImpl()

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

    await RabbitMQ.getInstance().publish(
      NewMessageOnDirect,
      new NewMessageOnDirect({
        sender: username1,
        receiver: username2,
        message: message,
      })
    )
  }
}
