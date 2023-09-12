import { RabbitMQ } from '../utils/rabbit-mq'

export class BasicEventsRepository {
  private broker: RabbitMQ | undefined

  protected getChannel() {
    if (!this.broker) {
      this.broker = RabbitMQ.getInstance()
    }
    return this.broker.getChannel()
  }
}
