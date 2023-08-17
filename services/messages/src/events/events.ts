import { DirectRepository } from "../repositories/direct/direct-repository";
import { DirectRepositoryImpl } from "../repositories/direct/direct-repository-impl";
import { RabbitMQ } from "../utils/rabbit-mq";
import { ServerRepository } from "../repositories/server/server-repository";
import { ServerRepositoryImpl } from "../repositories/server/server-repository-impl";
/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
export class ServiceEvents {
	private static broker: RabbitMQ;
	private static serverRepository: ServerRepositoryImpl = new ServerRepositoryImpl();

	static async initialize() {
		this.broker = RabbitMQ.getInstance();
		await this.declareQueue();
		await this.setupListeners();
	}

	static async declareQueue() {
		const channel = this.broker.getChannel();

		// Declare the exchange
		await channel?.assertExchange("servers", "fanout", {
			durable: true,
		});
	}

	static async setupListeners() {
		this.subscribeToExchange("servers", async (event, data) => {
			switch (event) {
				case "server.created":
					await this.serverRepository.addServer(data.serverId, data.owner);
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
