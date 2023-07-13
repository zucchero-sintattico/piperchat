import { User } from "../models/user-model";

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
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
}
