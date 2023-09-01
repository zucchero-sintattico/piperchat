import { RabbitMQ } from '@piperchat/commons'
import { ServiceEventsRepository } from '@piperchat/commons'
import {
  NotificationRepository,
  NotificationRepositoryImpl,
} from '@repositories/notification-repository'

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
  private static broker: RabbitMQ
  private static serviceEventsRepository: ServiceEventsRepository =
    new ServiceEventsRepository()

  static async initialize() {
    console.log('Initializing service events')
    this.broker = RabbitMQ.getInstance()
    console.log('Broker initialized')
    console.log('Declaring queue')
    await this.declareQueue()
    console.log('Queue declared')
    console.log('Setting up listeners')
    await this.setupListeners()
    console.log('Listeners set up')
    console.log('Publishing service status online')
    await this.serviceEventsRepository.publishServiceStatusOnline('notifications')
    console.log('Service status published')
  }

  static async shutdown() {
    await this.serviceEventsRepository.publishServiceStatusOffline('notifications')
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
    const notificationRepository: NotificationRepository =
      new NotificationRepositoryImpl()
    this.subscribeToExchange('messages', async (event, data) => {
      switch (event) {
        case 'message.direct.sent':
          try {
            notificationRepository.onNewMessage(data)
          } catch (error) {
            console.error(error)
          }
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
    channel?.consume(queue.queue, async (message: any): Promise<void> => {
      if (!message) {
        return
      }

      const content = message.content.toString()
      try {
        const data = JSON.parse(content)
        callback(message.fields.routingKey, data)
      } catch (error) {
        console.error(error)
      }
    })
  }
}
