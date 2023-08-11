import { RabbitMQ } from "../../../utils/rabbit-mq";
import { ServerEventRepository } from "./server-events-repository";

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

  async publishServerCreated(server: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.created",
        Buffer.from(JSON.stringify(server))
      );
    }
  }

  async publishServerUpdated(server: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.updated",
        Buffer.from(JSON.stringify(server))
      );
    }
  }

  async publishServerDeleted(server: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.deleted",
        Buffer.from(JSON.stringify(server))
      );
    }
  }

  async publishUserJoined(user: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.joined",
        Buffer.from(JSON.stringify(user))
      );
    }
  }

  async publishUserLeft(user: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.left",
        Buffer.from(JSON.stringify(user))
      );
    }
  }

  async publishUserKicked(user: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "servers",
        "server.user.kicked",
        Buffer.from(JSON.stringify(user))
      );
    }
  }
}
