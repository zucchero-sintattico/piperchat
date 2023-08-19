export interface FriendsController {
  /**
   * Get the friends of a user.
   * @param username The username of the user.
   * @returns The friends of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getFriends(username: string): Promise<string[]>

  /**
   * Get friend's requests
   * @param username The username of the user.
   * @returns The friend's requests of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getFriendsRequests(username: string): Promise<string[]>

  /**
   * Send a friend request to a user.
   * @param username The username of the user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user or the friend is not found.
   * @throws {FriendRequestAlreadySent} If the friend request is already sent.
   */
  sendFriendRequest(username: string, friendUsername: string): Promise<void>

  /**
   * Accept a friend request from a user.
   * @param username The username of the user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user is not found.
   * @throws {UserNotFound} If the friend is not found.
   * @throws {FriendRequestNotPresent} If the friend request is not present.
   */
  acceptFriendRequest(username: string, friendUsername: string): Promise<void>

  /**
   * Deny a friend request from a user.
   * @param username The username of the user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user is not found.
   * @throws {UserNotFound} If the friend is not found.
   * @throws {FriendRequestNotPresent} If the friend request is not present.
   */
  denyFriendRequest(username: string, friendUsername: string): Promise<void>
}

export class FriendsControllerExceptions {
  static UserNotFound = class extends Error {}
  static FriendRequestNotPresent = class extends Error {}
  static FriendRequestAlreadySent = class extends Error {}
}
