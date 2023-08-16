import { ChannelEventRepository } from "./channel-event-repository";
import { RabbitMQ } from "@piperchat/commons";
export class ChannelEventRepositoryImpl implements ChannelEventRepository {
  private broker: RabbitMQ | undefined;

  getChannel() {
    if (!this.broker) {
      this.broker = RabbitMQ.getInstance();
    }
    return this.broker?.getChannel();
  }

  async publishChannelCreated(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "channels",
        "channel.created",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishChannelUpdated(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "channels",
        "channel.updated",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishChannelDeleted(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "channels",
        "channel.deleted",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }
}
