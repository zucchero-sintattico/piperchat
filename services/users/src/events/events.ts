import { UserRepository } from "../repositories/user-repository";
import { RabbitMQ } from "../utils/rabbit-mq";

/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
	private static broker: RabbitMQ;
	private static userRepository: UserRepository = new UserRepository();

	static async initialize() {
		this.broker = RabbitMQ.getInstance();
		await this.declareQueue();
		await this.setupListeners();
	}

	static async declareQueue() {
		const channel = this.broker.getChannel();

		await channel?.assertExchange("user", "fanout", {
			durable: true,
		});
	}

	static async setupListeners() {
		this.subscribeToExchange("user", async (event, data) => {
			switch (event) {
				case "user.created":
					console.log("User created", data);
					break;
				case "user.updated":
					console.log("User updated", data);
					break;
				case "user.deleted":
					console.log("User deleted", data);
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
