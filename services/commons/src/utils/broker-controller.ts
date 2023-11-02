import { RabbitMQ } from './rabbit-mq'

export class BrokerController {
  private rabbitMQ?: RabbitMQ

  async publish<T extends object>(
    EventType: { exchange: string; routingKey: string },
    message: T
  ) {
    if (!this.rabbitMQ) {
      this.rabbitMQ = RabbitMQ.getInstance()
    }
    await this.rabbitMQ.publish(EventType, message)
  }
}
