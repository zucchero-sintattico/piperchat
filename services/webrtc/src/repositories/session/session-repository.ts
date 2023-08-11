import { Session, UserInSession } from "@/models/session-model";

export interface SessionRepository {
	/**
	 * Get a session by its id
	 * @param id the id of the session
	 * @returns the session
	 * @throws {Error} if session does not exist
	 */
	getSessionById(id: string): Promise<Session>;

	/**
	 * Create a new session
	 * @param allowedUsers the usernames of the users allowed in the session
	 * @returns the session
	 * @throws {Error} if session already exists
	 */
	createNewSession(allowedUsers: string[]): Promise<Session>;

	/**
	 * Add a new user to a session
	 * @param sessionId the id of the session
	 * @param username the username of the user
	 * @param socketId the socket id of the user
	 * @throws {Error} if session does not exist
	 * @throws {Error} if user already exists in session
	 */
	addNewUserToSession(
		sessionId: string,
		username: string,
		socketId: string
	): Promise<void>;

	/**
	 * Remove a user from a session
	 * @param sessionId the id of the session
	 * @param username the username of the user
	 * @throws {Error} if session does not exist
	 * @throws {Error} if user does not exist in session
	 */
	removeUserFromSession(sessionId: string, username: string): Promise<void>;

	/**
	 * Get all users in a session
	 * @param sessionId the id of the session
	 * @returns the usernames of all users in the session
	 * @throws {Error} if session does not exist
	 */
	getUsersInSession(sessionId: string): Promise<UserInSession[]>;

	getSocketIdBySessionIdAndUsername(
		sessionId: string,
		username: string
	): Promise<string>;

	updateSessionAllowedUsers(
		sessionId: string,
		allowedUsers: string[]
	): Promise<void>;
}