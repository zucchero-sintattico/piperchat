import { RabbitMQ } from "../../utils/rabbit-mq";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class EntityEventsRepository {
	private broker: RabbitMQ | undefined;

	getChannel() {
		if (!this.broker) {
			this.broker = RabbitMQ.getInstance();
		}
		return this.broker.getChannel();
	}

	async publishEntityCreated(entity: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.created",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}

	async publishEntityUpdated(entity: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.updated",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}

	async publishEntityDeleted(entity: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"entity",
				"entity.deleted",
				Buffer.from(JSON.stringify(entity))
			);
		}
	}
}
