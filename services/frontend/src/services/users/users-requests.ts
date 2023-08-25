interface UserRequest {
  /**
   * Login user
   * @param username
   * @param password
   * @returns
   * @throws {Error}
   */
  login(username: string, password: string): Promise<any>

  /**
   * register user
   * @param username
   * @param password
   * @param email
   * @returns
   * @throws {Error}
   */
  register(username: string, password: string, email: string): Promise<string>

  /**
   * Logout user
   * @returns
   * @throws {Error}
   */
  logout(): Promise<string>

  /**
   * Get user From Token
   * @returns
   * @throws {Error}
   * @throws {UnauthorizedError}
   */
  getUserFromToken(): Promise<string>
}
