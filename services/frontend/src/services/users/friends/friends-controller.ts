export interface FriendsController {
  /**
   * Get the friends of a user.
   * @returns The friends of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getFriends(): Promise<string[]>

  /**
   * Get friend's requests
   * @returns The friend's requests of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getFriendsRequests(): Promise<string[]>

  /**
   * Send a friend request to a user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user or the friend is not found.
   * @throws {FriendRequestAlreadySent} If the friend request is already sent.
   */
  sendFriendRequest(friendUsername: string): Promise<void>

  /**
   * Accept a friend request from a user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user is not found.
   * @throws {UserNotFound} If the friend is not found.
   * @throws {FriendRequestNotPresent} If the friend request is not present.
   */
  acceptFriendRequest(friendUsername: string): Promise<void>

  /**
   * Deny a friend request from a user.
   * @param friendUsername The username of the friend.
   * @throws {UserNotFound} If the user is not found.
   * @throws {UserNotFound} If the friend is not found.
   * @throws {FriendRequestNotPresent} If the friend request is not present.
   */
  denyFriendRequest(friendUsername: string): Promise<void>
}
