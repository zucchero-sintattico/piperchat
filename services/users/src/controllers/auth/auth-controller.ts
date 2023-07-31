import { User } from "../../models/user-model";

export interface AuthController {
	/**
	 * Register a new user.
	 * @param username The username of the user.
	 * @param email The email of the user.
	 * @param password The password of the user.
	 * @throws {UserAlreadyExists} If the user already exists.
	 */
	register(username: string, email: string, password: string): Promise<User>;

	/**
	 * Login a user.
	 * @param username The username of the user.
	 * @param password The password of the user.
	 * @returns The access token.
	 * @throws {InvalidUsernameOrPassword} If the username or password is invalid.
	 */
	login(username: string, password: string): Promise<string>;

	/**
	 * Logout a user.
	 * @param username The username of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	logout(username: string): Promise<void>;

	/**
	 * Refresh the access token of a user.
	 * @param username The username of the user.
	 * @returns The new access token.
	 * @throws {UserNotFound} If the user is not found.
	 * @throws {RefreshTokenNotPresent} If the refresh token is not present.
	 * @throws {InvalidRefreshToken} If the refresh token is invalid.
	 */
	refreshToken(username: string): Promise<string>;
}

export class UserControllerExceptions {
	static UserAlreadyExists = class extends Error {};
	static UserNotFound = class extends Error {};
	static RefreshTokenNotPresent = class extends Error {};
	static InvalidRefreshToken = class extends Error {};
	static InvalidUsernameOrPassword = class extends Error {};
}
