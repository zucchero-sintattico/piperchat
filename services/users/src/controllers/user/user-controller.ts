import { User } from "../../models/user-model";

export interface UserController {
	/**
	 * Get the status of a user.
	 * @param username The username of the user.
	 * @returns The status of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	getUserStatus(username: string): Promise<string>;

	/**
	 * Set the photo of a user.
	 * @param username The username of the user.
	 * @param photo The photo of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	setUserPhoto(username: string, photo: string): Promise<void>;

	/**
	 * Get the photo of a user.
	 * @param username The username of the user.
	 * @returns The photo of the user.
	 * @throws {UserNotFound} If the user is not found.
	 * @throws {PhotoNotPresent} If the photo is not present.
	 */
	getUserPhoto(username: string): Promise<string>;

	/**
	 * Set the user's description.
	 * @param username The username of the user.
	 * @param description The description of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	setUserDescription(username: string, description: string): Promise<void>;

	/**
	 * Get the user's description.
	 * @param username The username of the user.
	 * @returns The description of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	getUserDescription(username: string): Promise<string>;
}

export class UserControllerExceptions {
	static UserNotFound = class extends Error {};
	static PhotoNotPresent = class extends Error {};
}
