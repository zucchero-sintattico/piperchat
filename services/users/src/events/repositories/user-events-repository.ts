import { User } from "../../models/user-model";
import { BasicEventsRepository } from "../../utils/basic-events-repository";

export interface UserEventsRepository {
	/**
	 * Publish user created event.
	 * @param user
	 */
	publishUserCreated(user: User): Promise<void>;

	/**
	 * Publish user updated event.
	 * @param user
	 */
	publishUserUpdated(user: User): Promise<void>;

	/**
	 * Publish user deleted event.
	 * @param user
	 */
	publishUserDeleted(user: User): Promise<void>;
}

export class UserEventsRepositoryImpl
	extends BasicEventsRepository
	implements UserEventsRepository
{
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
