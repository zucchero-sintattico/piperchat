export interface AuthController {
  /**
   * Register a new user.
   * @param username The username of the user.
   * @param email The email of the user.
   * @param password The password of the user.
   * @param description The description of the user.
   * @param photo The profile picture of the user.
   * @throws {UserAlreadyExists} If the user already exists.
   */
  register(
    username: string,
    email: string,
    password: string,
    description: string | null,
    photo: String | null
  ): Promise<string>
  /**
   * Login a user.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns The access token.
   * @throws {InvalidUsernameOrPassword} If the username or password is invalid.
   */
  login(username: string, password: string): Promise<any>

  /**
   * Logout a user.
   * @throws {UserNotFound} If the user is not found.
   */
  logout(): Promise<void>

  /**
   * Refresh the access token of a user.
   * @returns The new access token.
   * @throws {UserNotFound} If the user is not found.
   * @throws {RefreshTokenNotPresent} If the refresh token is not present.
   * @throws {InvalidRefreshToken} If the refresh token is invalid.
   */
  refreshToken(): Promise<string>
}
