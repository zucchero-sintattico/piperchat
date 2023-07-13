import { User } from "../models/user-model";
import jwt from "jsonwebtoken";

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
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		return accessToken;
	}

	generateAccessToken(user: any) {
		return jwt.sign(
			{ username: user.username, email: user.email, id: user._id },
			process.env.ACCESS_TOKEN_SECRET || "access",
			{ expiresIn: "15s" }
		);
	}

	generateRefreshToken(user: any) {
		return jwt.sign(
			{ username: user.username, email: user.email, id: user._id },
			process.env.REFRESH_TOKEN_SECRET || "refresh",
			{ expiresIn: "1d" }
		);
	}

	async getRefreshTokenFromUser(username: string): Promise<string | null> {
		const refreshToken = await User.findOne(
			{ username: username },
			"refreshToken"
		);
		return refreshToken?.refreshToken || null;
	}
}
