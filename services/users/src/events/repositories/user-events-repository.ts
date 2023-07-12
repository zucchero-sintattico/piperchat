import { RabbitMQ } from "../../utils/rabbit-mq";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class UserEventsRepository {
	private broker: RabbitMQ | undefined;

	getChannel() {
		if (!this.broker) {
			this.broker = RabbitMQ.getInstance();
		}
		return this.broker.getChannel();
	}

	async publishUserCreated(user: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"user",
				"user.created",
				Buffer.from(JSON.stringify(user))
			);
		}
	}

	async publishUserUpdated(user: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"user",
				"user.updated",
				Buffer.from(JSON.stringify(user))
			);
		}
	}

	async publishUserDeleted(user: any) {
		const channel = this.getChannel();
		if (channel) {
			channel.publish(
				"user",
				"user.deleted",
				Buffer.from(JSON.stringify(user))
			);
		}
	}
}
