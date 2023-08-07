import { BasicEventsRepository } from "../../../utils/basic-events-repository";
import { SessionEventsRepository } from "./session-events-repository";

export class SessionEventsRepositoryImpl
	extends BasicEventsRepository
	implements SessionEventsRepository
{
	constructor() {
		super();
		this.getChannel()?.assertExchange("session", "fanout", {
			durable: false,
		});
	}
	async publishUserJoinedSessionEvent(
		sessionId: string,
		username: string
	): Promise<void> {
		this.getChannel()?.publish(
			"session",
			"user_joined_session",
			Buffer.from(JSON.stringify({ sessionId, username }))
		);
	}
	async publishUserLeftSessionEvent(
		sessionId: string,
		username: string
	): Promise<void> {
		this.getChannel()?.publish(
			"session",
			"user_left_session",
			Buffer.from(JSON.stringify({ sessionId, username }))
		);
	}

	async publishSessionEndedEvent(sessionId: string): Promise<void> {
		this.getChannel()?.publish(
			"session",
			"session_ended",
			Buffer.from(JSON.stringify({ sessionId }))
		);
	}

	async publishSessionCreatedEvent(
		sessionId: string,
		allowedUsers: string[]
	): Promise<void> {
		this.getChannel()?.publish(
			"session",
			"session_created",
			Buffer.from(JSON.stringify({ sessionId, allowedUsers }))
		);
	}
}
