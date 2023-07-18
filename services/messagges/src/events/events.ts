import { MessageRepository } from "../repositories/message-repository";
import { ConversationsRepository } from "../repositories/conversation-repository";
import { ServersRepository } from "../repositories/server-repository";
import { RabbitMQ } from "../utils/rabbit-mq";

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
  private static broker: RabbitMQ;
  private static messageRepository: MessageRepository = new MessageRepository();
  private static conversationRepository: ConversationsRepository =
    new ConversationsRepository();
  private static serverRepository: ServersRepository = new ServersRepository();

  static async initialize() {
    this.broker = RabbitMQ.getInstance();
    await this.declareQueue();
    await this.setupListeners();
  }

  static async declareQueue() {
    const channel = this.broker.getChannel();

    // Declare the exchange
    await channel?.assertExchange("message", "fanout", {
      durable: true,
    });
  }

  static async setupListeners() {
    this.subscribeToExchange("message", async (event, data) => {
      switch (event) {
        case "message.created":
          await this.messageRepository.createMessage(data.sender, data.content);
          break;

        default:
          break;
      }
    });

    this.subscribeToExchange("conversation", async (event, data) => {
      switch (event) {
        case "conversation.created":
          await this.conversationRepository.createConversation(
            data.participants
          );
          break;

        case "conversation.deleted":
          await this.conversationRepository.deleteConversation(data.name);
          break;
      }
    });

    this.subscribeToExchange("channel", async (event, data) => {
      switch (event) {
        case "channel.created":
          await this.serverRepository.createChannel(data.name, data.serverId);
          break;

        case "channel.deleted":
          await this.serverRepository.removeChannelFromServer(
            data.name,
            data.serverId
          );
          break;
      }
    });
  }

  private static async subscribeToExchange(
    exchange: string,
    callback: (event: string, data: any) => void
  ) {
    const channel = this.broker.getChannel();
    const queue = await channel?.assertQueue("", {
      exclusive: true,
    });
    if (!queue) {
      return;
    }
    await channel?.bindQueue(queue.queue, exchange, "");
    channel?.consume(queue.queue, async (message) => {
      if (!message) {
        return;
      }

      const content = message.content.toString();
      const data = JSON.parse(content);
      callback(message.fields.routingKey, data);
    });
  }
}
