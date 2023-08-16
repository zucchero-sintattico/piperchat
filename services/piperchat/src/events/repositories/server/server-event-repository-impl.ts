import { RabbitMQ } from "../../../utils/rabbit-mq";
import { ServerEventRepository } from "./server-event-repository";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class ServerEventRepositoryImpl implements ServerEventRepository {
  private broker: RabbitMQ | undefined;

  getChannel() {
    if (!this.broker) {
      this.broker = RabbitMQ.getInstance();
    }
    return this.broker?.getChannel();
  }

  async publishServerCreated(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.created",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishServerUpdated(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.updated",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishServerDeleted(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.deleted",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishUserJoined(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.joined",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishUserLeft(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.left",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishUserKicked(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.kicked",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }
}
