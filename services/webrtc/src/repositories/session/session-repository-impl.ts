import { Session, Sessions, UserInSession } from "../../models/session-model";
import { SessionRepository } from "./session-repository";

export class SessionRepositoryImpl implements SessionRepository {
	async getSocketIdBySessionIdAndUsername(
		sessionId: string,
		username: string
	): Promise<string> {
		const session = await this.getSessionById(sessionId);
		const user = session.participants!.find(
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

	async createNewSession(): Promise<Session> {
		const session = new Sessions();
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
}
