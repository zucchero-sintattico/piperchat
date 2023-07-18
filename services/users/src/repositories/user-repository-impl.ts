import { UserRepository } from "./user-repository";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Users, User } from "../models/user-model";

export class UserRepositoryImpl implements UserRepository {
	async getUserByUsername(username: string): Promise<User> {
		return await Users.findOne({ username: username }).orFail();
	}

	async getUserByEmail(email: string): Promise<User> {
		return await Users.findOne({ email: email }).orFail();
	}

	async login(username: string): Promise<string> {
		const user = await this.getUserByUsername(username);
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		await Users.findOneAndUpdate(
			{ username: username },
			{ refreshToken: refreshToken }
		);
		return accessToken;
	}

	async logout(username: string): Promise<void> {
		await Users.findOneAndUpdate({ username: username }, { refreshToken: "" });
	}

	async createUser(
		username: string,
		email: string,
		hashedPassword: string
	): Promise<User> {
		const user = await Users.create({
			username,
			email,
			password: hashedPassword,
		});
		return user;
	}
}
