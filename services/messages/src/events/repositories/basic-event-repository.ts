import { RabbitMQ } from "../../utils/rabbit-mq";

export class BasicEventRepository {
  private broker: RabbitMQ | undefined;

  protected getChannel() {
    if (!this.broker) {
      this.broker = RabbitMQ.getInstance();
    }
    return this.broker.getChannel();
  }
}
