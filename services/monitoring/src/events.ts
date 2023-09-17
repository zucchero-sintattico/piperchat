import { Channel } from 'amqplib'
import { MonitoringRepository } from '@repositories/monitoring-repository'
import { MonitoringRepositoryImpl } from '@repositories/monitoring-repository-impl'
import { RabbitMQ } from '@commons/utils/rabbit-mq'

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class AllEventsListener {
  private static broker: RabbitMQ
  private static monitoringRepository: MonitoringRepository =
    new MonitoringRepositoryImpl()

  private static exchanges = ['message', 'user', 'server', 'channel', 'notification']

  static async initialize() {
    this.broker = RabbitMQ.getInstance()
    await this.declareQueue()
    await this.setupListeners()
  }

  private static async assertExchange(
    channel: Channel | undefined,
    exchangeName: string
  ) {
    await channel?.assertExchange(exchangeName, 'fanout', {
      durable: true,
    })
  }

  static async declareQueue() {
    const channel = this.broker.getChannel()
    // Declare the exchange
    for (const exchange of this.exchanges) {
      await this.assertExchange(channel, exchange)
    }
  }

  static async setupListeners() {
    // Logs listeners
    for (const exchange of this.exchanges) {
      await this.subscribeToExchange(exchange, async (event, data) => {
        await this.monitoringRepository.log({
          topic: exchange,
          event: event,
          payload: data,
        })
      })
    }
    // setUpHealtCheckListener()
  }

  private static async subscribeToExchange(
    exchange: string,
    callback: (event: string, data: unknown) => void
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
