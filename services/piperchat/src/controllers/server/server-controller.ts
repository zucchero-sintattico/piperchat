import { Server } from "../../models/server-model";

export interface ServerController {
  /**
   * Get all servers of the user
   * @param username
   * @returns the servers of the user
   * @throws {UserNotFound} if the user does not exist
   */
  getServers(username: string): Promise<Server[]>;

  /**
   * Get a server by id
   * @param id
   * @returns the server
   * @throws {ServerNotFound} if the server does not exist
   */
  getServer(id: string): Promise<Server>;

  /**
   * Create a server
   * @param name
   * @param description
   * @param owner
   * @returns the created server
   */
  createServer(
    name: string,
    description: string,
    owner: string
  ): Promise<Server>;

  /**
   * Update a server
   * @param id
   * @param username
   * @param name? the new name of the server
   * @param description? the new description of the server
   * @returns the updated server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  updateServer(
    id: string,
    username: string,
    name?: string,
    description?: string
  ): Promise<Server>;

  /**
   * Delete a server
   * @param id
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not the owner of the server
   */
  deleteServer(id: string, username: string): Promise<void>;

  /**
   * Get all participants of a server
   * @param id
   * @returns the participants of the server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   *
   */
  getServerParticipants(id: string, username: string): Promise<string[]>;

  /**
   * Join a server
   * @param id
   * @param username
   * @returns the joined server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserAlreadyJoined} if the user is already in the server
   */
  joinServer(id: string, username: string): Promise<Server>;

  /**
   * Leave a server
   * @param id
   * @param username the user who make the request
   * @returns the left server
   * @throws {ServerNotFound} if the server does not exist
   * @throws {UserNotAuthorized} if the user is not in the server
   */
  leaveServer(id: string, username: string): Promise<Server>;

  /**
   * Kick a user from a server
   * @param id
   * @param username the user to kick
   * @param admin the user who make the request
   *
   */
  kickUserFromTheServer(
    id: string,
    username: string,
    admin: string
  ): Promise<Server>;
}

export class ServerControllerExceptions {
  static UserNotFound = class extends Error {};
  static ServerNotFound = class extends Error {};
  static UserNotAuthorized = class extends Error {};
  static UserAlreadyJoined = class extends Error {};
  static OwnerCannotLeave = class extends Error {};
}
