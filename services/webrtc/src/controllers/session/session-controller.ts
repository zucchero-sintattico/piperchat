import { Session } from "@/models/session-model";

export interface SessionController {
	/**
	 * Create a session with specified allowed users.
	 * @param allowedUsers - The users allowed to join the session.
	 * @returns The session.
	 */
	createSession(allowedUsers: string[]): Promise<Session>;

	/**
	 * Update the session with the specified id.
	 * @param id - The id of the session to update.
	 * @param allowedUsers - The users allowed to join the session.
	 * @throws {SessionNotFound} If the session with the specified id does not exist.
	 */
	updateSession(id: string, allowedUsers: string[]): Promise<void>;
}

export class SessionControllerExceptions {
	static SessionNotFound = class extends Error {};
}
