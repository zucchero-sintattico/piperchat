import { BasicEventsRepository } from "../../../utils/basic-events-repository";
import { UserEventsRepository } from "./user-events-repository";

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
