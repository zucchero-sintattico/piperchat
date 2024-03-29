import { RabbitMQ } from '../utils/rabbit-mq'
import { EventsConfiguration } from './events-configuration'

export class ServiceEvents {
  static async initialize(
    Rabbit: RabbitMQ,
    configuration: EventsConfiguration
  ): Promise<void> {
    const broker = Rabbit
    for (const exchange of Object.keys(configuration.exchanges)) {
      const exchangeConfig = configuration.exchanges[exchange]
      const channel = broker.getChannel()
      await channel?.assertExchange(exchange, 'fanout', { durable: true })
      const queue = await channel?.assertQueue('', { exclusive: true })
      if (!queue) {
        throw new Error('Could not assert queue')
      }
      await channel?.bindQueue(queue.queue, exchange, '')
      await channel?.consume(
        queue.queue,
        (message) => {
          if (message) {
            try {
              const data = JSON.parse(message.content.toString())
              const routingKey = message.fields.routingKey
              const event = exchangeConfig.events[routingKey]
              if (event) {
                event(data)
              }
            } catch (error) {
              console.error(error)
            }
          }
        },
        { noAck: true }
      )
    }
  }
}
