import { User } from "../../models/user-model";

export interface UserRepository {
	/**
	 * Get the user's photo
	 * @param username The username of the user.
	 * @returns The photo of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	getUserPhoto(username: string): Promise<Buffer>;

	/**
	 * Update the user's photo.
	 * @param username The username of the user.
	 * @param photo The photo of the user.
	 */
	updateUserPhoto(username: string, photo: Buffer): Promise<void>;

	/**
	 * Get the user's description.
	 * @param username The username of the user.
	 * @returns The description of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	getUserDescription(username: string): Promise<string>;

	/**
	 * Update the user's description.
	 * @param description The description of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	updateUserDescription(username: string, description: string): Promise<void>;

	/**
	 * Create a new user.
	 * @param username
	 * @param email
	 * @param hashedPassword
	 * @param description
	 * @param photo
	 * @returns The created user.
	 */
	createUser(
		username: string,
		email: string,
		hashedPassword: string,
		description: string | null,
		photo: Buffer | null
	): Promise<User>;

	/**
	 * Delete a user.
	 * @param username
	 * @returns The deleted user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	deleteUser(username: string): Promise<User>;

	/**
	 * Get user by username.
	 * @param username
	 * @returns The user.
	 */
	getUserByUsername(username: string): Promise<User>;

	/**
	 * Get user by email.
	 * @param email
	 * @returns The user.
	 */
	getUserByEmail(email: string): Promise<User>;

	/**
	 * Login a user.
	 * Create a new access token and refresh token.
	 * @param username
	 * @param refreshToken
	 */
	login(username: string, refreshToken: string): Promise<void>;

	/**
	 * Logout a user
	 * Remove the refresh token from db.
	 */
	logout(username: string): Promise<void>;

	/**
	 * Get all friends of a user.
	 * @param username
	 */
	getFriends(username: string): Promise<string[]>;

	/**
	 * Get all friends requests of a user.
	 * @param username
	 */
	getFriendsRequests(username: string): Promise<string[]>;

	/**
	 * Send a friend request to a user.
	 * @param username
	 * @param friendUsername
	 */
	sendFriendRequest(username: string, friendUsername: string): Promise<void>;

	/**
	 * Accept a friend request from a user.
	 * @param username
	 * @param friendUsername
	 */
	acceptFriendRequest(username: string, friendUsername: string): Promise<void>;

	/**
	 * Deny a friend request from a user.
	 * @param username
	 * @param friendUsername
	 */
	denyFriendRequest(username: string, friendUsername: string): Promise<void>;
}
