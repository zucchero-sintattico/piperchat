import { User } from "../../models/user-model";

export interface FriendsController {
	/**
	 * Get the friends of a user.
	 * @param username The username of the user.
	 * @returns The friends of the user.
	 * @throws {UserNotFound} If the user is not found.
	 */
	getFriends(username: string): Promise<User[]>;

	/**
	 * Get friend's requests
	 * @param username
	 * @returns
	 */
	getFriendsRequests(username: string): Promise<string[]>;

	/**
	 * Send a friend request to a user.
	 * @param username The username of the user.
	 * @param friendUsername The username of the friend.
	 * @throws {UserNotFound} If the user is not found.
	 * @throws {UserNotFound} If the friend is not found.
	 */
	sendFriendRequest(username: string, friendUsername: string): Promise<void>;

	/**
	 * Accept a friend request from a user.
	 * @param username The username of the user.
	 * @param friendUsername The username of the friend.
	 * @throws {UserNotFound} If the user is not found.
	 * @throws {UserNotFound} If the friend is not found.
	 * @throws {FriendRequestNotPresent} If the friend request is not present.
	 */
	acceptFriendRequest(username: string, friendUsername: string): Promise<void>;
}

export class FriendsControllerExceptions {
	static UserNotFound = class extends Error {};
	static FriendRequestNotPresent = class extends Error {};
}
