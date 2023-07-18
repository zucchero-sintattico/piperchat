import { Session } from "../models/session-model";

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class SessionRepository {
	async createNewSession() {
		const session = new Session();
		return await session.save();
	}

	async getSessionById(id: string) {
		return await Session.findById(id);
	}

	async addNewUserToSession(sessionId: string, username: string) {
		const session = await Session.findById(sessionId);
		session?.users.push({ username });
		return await session?.save();
	}

	async addSDPToUser(sessionId: string, username: string, sdp: string) {
		const session = await Session.findById(sessionId);
		const user = session?.users.find((user) => user.username === username);
		user.sdp = sdp;
		return await session?.save();
	}

	async addIceCandidateToUser(
		sessionId: string,
		username: string,
		iceCandidate: string
	) {
		const session = await Session.findById(sessionId);
		const user = session?.users.find((user) => user.username === username);
		user.iceCandidates.push({ candidate: iceCandidate });
		return await session?.save();
	}

	async removeUserFromSession(sessionId: string, username: string) {
		const session = await Session.findById(sessionId);
		if (!session) return;
		session.users = session.users.filter((user) => user.username !== username);
		return await session?.save();
	}
}
