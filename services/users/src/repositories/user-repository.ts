import { User } from "../models/user-model";

export interface UserRepository {
	/**
	 * Create a new user.
	 * @param username
	 * @param email
	 * @param hashedPassword
	 * @returns The created user.
	 */
	createUser(
		username: string,
		email: string,
		hashedPassword: string
	): Promise<User>;

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
	 * @returns The access token.
	 */
	login(username: string): Promise<string>;
}
