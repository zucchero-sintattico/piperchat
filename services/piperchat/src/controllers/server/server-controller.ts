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
	getServer(id: number): Promise<Server>;

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
	 * @param name? the new name of the server
	 * @param description? the new description of the server
	 * @returns the updated server
	 * @throws {ServerNotFound} if the server does not exist
	 * @throws {UserNotAuthorized} if the user is not the owner of the server
	 */
	updateServer(
		id: number,
		name?: string,
		description?: string
	): Promise<Server>;

	/**
	 * Delete a server
	 * @param id
	 * @returns the deleted server
	 * @throws {ServerNotFound} if the server does not exist
	 * @throws {UserNotAuthorized} if the user is not the owner of the server
	 */
	deleteServer(id: number): Promise<Server>;

	/**
	 * Join a server
	 * @param id
	 * @returns the joined server
	 * @throws {ServerNotFound} if the server does not exist
	 * @throws {UserAlreadyJoined} if the user is already in the server
	 */
	joinServer(id: number): Promise<Server>;

	/**
	 * Leave a server
	 * @param id
	 * @returns the left server
	 * @throws {ServerNotFound} if the server does not exist
	 * @throws {UserNotAuthorized} if the user is not in the server
	 */
	leaveServer(id: number): Promise<Server>;
}

export class ServerControllerExceptions {
	static UserNotFound = class extends Error {};
	static ServerNotFound = class extends Error {};
	static UserNotAuthorized = class extends Error {};
	static UserAlreadyJoined = class extends Error {};
}