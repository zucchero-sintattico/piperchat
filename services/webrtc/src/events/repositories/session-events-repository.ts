import { RabbitMQ } from "../../utils/rabbit-mq";

/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
export class SessionEventsRepository {
	private broker: RabbitMQ | undefined;

	private getChannel() {
		if (!this.broker) {
			this.broker = RabbitMQ.getInstance();
		}
		return this.broker.getChannel();
	}

	async publishNewSessionCreatedEvent(sessionId: string) {
		this.getChannel()?.publish(
			"session",
			"session.created",
			Buffer.from(JSON.stringify({ sessionId }))
		);
	}

	async publishUserJoinedSessionEvent(sessionId: string, username: string) {
		this.getChannel()?.publish(
			"session",
			"session.userJoined",
			Buffer.from(JSON.stringify({ sessionId, username }))
		);
	}

	async publishUserLeftSessionEvent(sessionId: string, username: string) {
		this.getChannel()?.publish(
			"session",
			"session.userLeft",
			Buffer.from(JSON.stringify({ sessionId, username }))
		);
	}

	async publishSDPAddedToUserEvent(
		sessionId: string,
		username: string,
		sdp: string
	) {
		this.getChannel()?.publish(
			"session",
			"session.sdpAdded",
			Buffer.from(JSON.stringify({ sessionId, username, sdp }))
		);
	}

	async publishIceCandidateAddedToUserEvent(
		sessionId: string,
		username: string,
		iceCandidate: string
	) {
		this.getChannel()?.publish(
			"session",
			"session.iceCandidateAdded",
			Buffer.from(JSON.stringify({ sessionId, username, iceCandidate }))
		);
	}
}
