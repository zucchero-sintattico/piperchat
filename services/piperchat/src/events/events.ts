import { ServerRepositoryImpl } from "@repositories/server/server-repository-impl";
import { RabbitMQ } from "@piperchat/commons";

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
  private static broker: RabbitMQ;

  static async initialize() {
    this.broker = RabbitMQ.getInstance();
    await this.declareQueue();
    await this.setupListeners();
  }

  static async declareQueue() {
    // Declare queue
    const channel = this.broker.getChannel();

    // Declare the exchange
    await channel?.assertExchange("servers", "fanout", {
      durable: true,
    });

    await channel?.assertExchange("channels", "fanout", {
      durable: true,
    });
  }

  static async setupListeners() {
    const serversRepository = new ServerRepositoryImpl();
    this.subscribeToExchange("servers", async (event, data) => {
      switch (event) {
        case "":
          try {
          } catch (error) {
            console.error(error);
          }
          break;
      }
    });

    this.subscribeToExchange("channels", async (event, data) => {
      // TODO: Handle events
      switch (event) {
        case "":
          try {
          } catch (error) {
            console.error(error);
          }
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
    channel?.consume(queue.queue, async (message: any): Promise<void> => {
      if (!message) {
        return;
      }

      const content = message.content.toString();
      try {
        const data = JSON.parse(content);
        callback(message.fields.routingKey, data);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
