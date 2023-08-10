import { Session } from "@/models/session-model";
import { SessionRepository } from "@/repositories/session/session-repository";
import { SessionRepositoryImpl } from "@/repositories/session/session-repository-impl";
import { SessionController } from "./session-controller";

export class SessionControllerImpl implements SessionController {
	private sessionRepository: SessionRepository = new SessionRepositoryImpl();

	async createSession(allowedUsers: string[]): Promise<Session> {
		return await this.sessionRepository.createNewSession(allowedUsers);
	}

	async updateSession(id: string, allowedUsers: string[]): Promise<void> {
		return await this.sessionRepository.updateSessionAllowedUsers(
			id,
			allowedUsers
		);
	}
}
