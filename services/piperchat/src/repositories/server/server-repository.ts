import { Server } from "@models/server-model";
export interface ServerRepository {
  /**
   * Creates a new server.
   * @param name
   * @param description
   * @param owner
   * @returns The created server.
   * @throws If the server could not be created.
   *
   */
  createServer(
    name: string,
    description: string,
    owner: string
  ): Promise<Server>;

  /**
   * Gets a server by its id.
   * @param id
   * @returns The server with the given id.
   * @throws If the server could not be found.
   */
  getServerById(serverId: string): Promise<Server>;

  /**
   * Gets all servers.
   * @param username
   * @returns All servers id.
   * @throws If no servers could be found.
   */
  getServers(username: string): Promise<Server[]>;

  /**
   * Updates a server by its id.
   * @param id
   * @param name
   * @param description
   * @returns The updated server.
   * @throws If the server could not be found.
   * @throws If the server could not be updated.
   *
   */
  updateServerById(
    id: string,
    name?: string,
    description?: string
  ): Promise<Server>;

  /**
   * Deletes a server by its id.
   * @param id
   * @throws If the server could not be found.
   * @throws If the server could not be deleted.
   */
  deleteServerById(id: string): Promise<void>;

  /**
   * Gets all participants of a server.
   * @param id
   * @returns All participants of the server with the given id.
   * @throws If the server could not be found.
   *
   */
  getServerParticipants(id: string): Promise<string[]>;

  /**
   * Adds a participant to a server.
   * @param id
   * @param participant
   * @returns The updated server.
   * @throws If the server could not be found.
   * @throws If the server could not be updated.
   */
  addServerParticipant(id: string, participant: string): Promise<Server>;

  /**
   * Removes a participant from a server.
   * @param id
   * @param participant
   * @returns The updated server.
   * @throws If the server could not be found.
   * @throws If the server could not be updated.
   */
  removeServerParticipant(id: string, participant: string): Promise<Server>;
}
