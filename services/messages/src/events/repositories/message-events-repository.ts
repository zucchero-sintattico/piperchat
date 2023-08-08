import { RabbitMQ } from "../../utils/rabbit-mq";
import { BasicEventsRepository } from "./basic-events-repository";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class MessageEventsRepository extends BasicEventsRepository {
  async publishNewMessage(user: any) {
    const channel = this.getChannel();
    channel?.publish("message", "user.new", Buffer.from(JSON.stringify(user)));
  }
  // TODO: Add more events
}
