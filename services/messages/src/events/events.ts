import { RabbitMQ } from '@piperchat/commons'
import { ServiceEventsRepository } from '@piperchat/commons'

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
  private static broker: RabbitMQ;
  private static serviceEventsRepository: ServiceEventsRepository = new ServiceEventsRepository();

  static async initialize() {
    this.broker = RabbitMQ.getInstance()
    await this.declareQueue()
    await this.setupListeners()
    await this.serviceEventsRepository.publishServiceStatusOnline('messages')
  }

  static async shutdown() {
    await this.serviceEventsRepository.publishServiceStatusOffline('messages')
  }

  static async declareQueue() {
    const channel = this.broker.getChannel()

    // Declare the exchange
    await channel?.assertExchange('messages', 'fanout', {
      durable: true,
    })

    await channel?.assertExchange('services', 'fanout', {
      durable: true,
    })
  }

  static async setupListeners() {
    this.subscribeToExchange('messages', async (event, data) => {
      switch (event) {
        case '':
          break
      }
    })
  }

  private static async subscribeToExchange(
    exchange: string,
    callback: (event: string, data: any) => void
  ) {
    const channel = this.broker.getChannel()
    const queue = await channel?.assertQueue('', {
      exclusive: true,
    })
    if (!queue) {
      return
    }
    await channel?.bindQueue(queue.queue, exchange, '')
    channel?.consume(queue.queue, async (message) => {
      if (!message) {
        return
      }

      const content = message.content.toString()
      const data = JSON.parse(content)
      callback(message.fields.routingKey, data)
    })
  }
}
