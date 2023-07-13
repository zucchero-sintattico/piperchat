import { User } from "../models/user-model";

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

	async getRefreshTokenFromUser(username: string) {
		return (await User.findOne({ username: username }).select("refreshToken"))?.refreshToken;
		}
}
