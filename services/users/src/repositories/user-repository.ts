import { User } from "../models/user-model";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserRepository {
	async getUsers() {
		return await User.find();
	}

	async getUserByUsername(username: string) {
		return await User.findOne({ username: username });
	}

	async getUserByEmail(email: string) {
		return await User.findOne({ email: email });
	}

	async createUser(user: any) {
		await user.save();
	}

	async createAccessAndRefreshToken(user: any) {
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		return accessToken;
	}

	async getRefreshTokenFromUser(username: string): Promise<string | null> {
		const refreshToken = await User.findOne(
			{ username: username },
			"refreshToken"
		);
		return refreshToken?.refreshToken || null;
	}

	async deleteRefreshTokenOfUser(username: string) {
		return await User.updateOne({ username: username }, { refreshToken: "" });
	}
}
