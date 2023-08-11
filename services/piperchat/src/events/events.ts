import { RabbitMQ } from "../utils/rabbit-mq";

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
    // Setup listeners
    /*
		this.broker.getChannel()?.consume("entity.entity.created", (msg) => {
			if (msg) {
				console.log("Entity created", msg.content.toString());
				this.broker.getChannel()?.ack(msg);
				this.entityRepository.createEntity(JSON.parse(msg.content.toString()));
			}
		});
		*/
  }
}
