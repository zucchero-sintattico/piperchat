import { BasicEventRepository } from "./basic-event-repository";
import { MessageEventRepository } from "./message-event-repository";

export class MessageEventRepositoryImpl
  extends BasicEventRepository
  implements MessageEventRepository
{
  async publishNewMessageOnChannel(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "messages",
        "message.channel.sent",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }

  async publishNewMessageOnDirect(payload: any) {
    const channel = this.getChannel();
    if (channel) {
      channel.publish(
        "messages",
        "message.direct.sent",
        Buffer.from(JSON.stringify(payload))
      );
    }
  }
}
