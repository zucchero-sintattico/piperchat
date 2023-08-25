export type UserStatusInfo = {
  online: boolean
  lastActive: Date
}
export interface UserController {
  /**
   * Get the status of a user.
   * @param username The username of the user.
   * @returns The status of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getUserStatus(username: string): Promise<UserStatusInfo>

  /**
   * Get the photo of a user.
   * @param username The username of the user.
   * @returns The photo of the user.
   * @throws {UserNotFound} If the user is not found.
   * @throws {PhotoNotPresent} If the photo is not present.
   */
  getUserPhoto(username: string): Promise<Buffer>

  /**
   * Get the user's description.
   * @param username The username of the user.
   * @returns The description of the user.
   * @throws {UserNotFound} If the user is not found.
   */
  getUserDescription(username: string): Promise<string>
}

export class UserControllerExceptions {
  static UserNotFound = class extends Error {}
  static PhotoNotPresent = class extends Error {}
}
