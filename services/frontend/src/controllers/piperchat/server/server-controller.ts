export interface ServerController {
  /**
   * Get all servers of the user
   * @returns the servers of the user
   * @throws {UserNotFound} if the user does not exist
   */
  getServers(): Promise<any>

  /**
   * Get a server by id
   * @param id
   * @returns the server
   * @throws {ServerNotFound} if the server does not exist
   */
  getServer(id: string): Promise<any>

  /**
   * Create a server
   * @param name
   * @param description
   * @returns the created server
   */
  createServer(name: string, description: string): Promise<any>

  /**
   * Update a server
   * @param id
   * @param name? the new name of the server
   * @param description? the new description of the server
   * @returns the updated server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  updateServer(id: string, name?: string, description?: string): Promise<any>

  /**
   * Delete a server
   * @param id
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteServer(id: string): Promise<any>

  /**
   * Get all participants of a server
   * @param id
   * @returns the participants of the server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   *
   */
  getServerParticipants(id: string): Promise<any>

  /**
   * Join a server
   * @param id
   * @returns the joined server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserAlreadyJoined} if the user is already in the server
   */
  joinServer(id: string): Promise<any>

  /**
   * Leave a server
   * @param id
   * @returns the left server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  leaveServer(id: string): Promise<any>

  /**
   * Kick a user from a server
   * @param id
   * @param admin the user who make the request
   *
   */
  kickUserFromTheServer(id: string, admin: string): Promise<any>
}
