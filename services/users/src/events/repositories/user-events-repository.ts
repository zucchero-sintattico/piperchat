import { BasicEventsRepository } from "./basic-events-repository";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class UserEventsRepository extends BasicEventsRepository {
	async publishUserCreated(user: any) {
		const channel = this.getChannel();
		channel?.publish("user", "user.created", Buffer.from(JSON.stringify(user)));
	}

	async publishUserUpdated(user: any) {
		const channel = this.getChannel();
		channel?.publish("user", "user.updated", Buffer.from(JSON.stringify(user)));
	}

	async publishUserDeleted(user: any) {
		const channel = this.getChannel();
		channel?.publish("user", "user.deleted", Buffer.from(JSON.stringify(user)));
	}
}
