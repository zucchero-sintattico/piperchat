import { RabbitMQ } from "@commons/rabbit-mq";

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
	private static broker: RabbitMQ;
	// private static entityRepository: EntityRepository = new EntityRepository();

	static async initialize() {
		this.broker = RabbitMQ.getInstance();
		await this.declareQueue();
		await this.setupListeners();
	}

	static async declareQueue() {
		// Declare queue
		/*
		this.broker.getChannel()?.assertQueue("entity.entity.created", {
			durable: true,
		});
		*/
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
