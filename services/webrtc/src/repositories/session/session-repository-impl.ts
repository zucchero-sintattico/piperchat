import { Session, Sessions, UserInSession } from "@models/session-model";
import { SessionRepository } from "./session-repository";

export class SessionRepositoryImpl implements SessionRepository {
	async removeUserFromSession(
		sessionId: string,
		username: string
	): Promise<void> {
		const session = await this.getSessionById(sessionId);
		const user = session.participants.find(
			(user) => user.username === username
		);
		if (!user) {
			throw new Error("User does not exist in session");
		}
		await Sessions.updateOne(
			{ id: sessionId },
			{ $pull: { participants: { username: username } } }
		);
	}
	async getSocketIdBySessionIdAndUsername(
		sessionId: string,
		username: string
	): Promise<string> {
		const session = await this.getSessionById(sessionId);
		const user = session.participants.find(
			(user) => user.username === username
		);
		if (!user) {
			throw new Error("User does not exist in session");
		}
		return user.socketId;
	}
	async getSessionById(id: string): Promise<Session> {
		return await Sessions.findOne({ id: id }).orFail();
	}

	async createNewSession(allowedUsers: string[]): Promise<Session> {
		const session = new Sessions({
			allowedUsers: allowedUsers,
		});
		await session.save();
		return session;
	}

	async addNewUserToSession(
		sessionId: string,
		username: string,
		socketId: string
	): Promise<void> {
		await Sessions.updateOne(
			{ id: sessionId },
			{
				$push: {
					participants: {
						username: username,
						socketId: socketId,
					},
				},
			}
		);
	}

	async getUsersInSession(sessionId: string): Promise<UserInSession[]> {
		const session = await Sessions.findOne({ id: sessionId }).orFail();
		return session.participants!;
	}

	async updateSessionAllowedUsers(
		sessionId: string,
		allowedUsers: string[]
	): Promise<void> {
		await Sessions.updateOne({ id: sessionId }, { allowedUsers: allowedUsers });
	}
}
