import { User } from "../../models/user-model";
import { Request, Response } from "express";
import { UserEventsRepository } from "../../events/repositories/user-events-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
import { generateAccessToken } from "../../utils/jwt";

export interface UserController {
	/**
	 * Register a new user.
	 * @param username The username of the user.
	 * @param email The email of the user.
	 * @param password The password of the user.
	 * @throws {UserAlreadyExists} If the user already exists.
	 */
	register(username: string, email: string, password: string): Promise<User>;

	/**
	 * Login a user.
	 * @param username The username of the user.
	 * @param password The password of the user.
	 * @returns The access token.
	 */
	login(username: string, password: string): Promise<string>;

	/**
	 * Logout a user.
	 * @param username The username of the user.
	 */
	logout(username: string): Promise<void>;

	/**
	 * Refresh the access token of a user.
	 * @param username The username of the user.
	 */
	refreshToken(username: string): Promise<string>;
}

export class UserControllerExceptions {
	static UserAlreadyExists = class extends Error {};
	static UserNotFound = class extends Error {};
	static RefreshTokenNotPresent = class extends Error {};
	static InvalidRefreshToken = class extends Error {};
	static InvalidUsernameOrPassword = class extends Error {};
}
