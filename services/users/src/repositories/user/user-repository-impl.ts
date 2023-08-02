import { UserRepository } from "./user-repository";
import { Users, User } from "../../models/user-model";

export class UserRepositoryImpl implements UserRepository {
	async getUserByUsername(username: string): Promise<User> {
		return await Users.findOne({ username: username }).orFail();
	}

	async getUserByEmail(email: string): Promise<User> {
		return await Users.findOne({ email: email }).orFail();
	}

	async login(username: string, refreshToken: string): Promise<void> {
		const user = await this.getUserByUsername(username);
		await Users.findOneAndUpdate(
			{ username: username },
			{ refreshToken: refreshToken }
		);
	}

	async logout(username: string): Promise<void> {
		await Users.findOneAndUpdate({ username: username }, { refreshToken: "" });
	}

	async createUser(
		username: string,
		email: string,
		hashedPassword: string,
		description: string | null,
		photo: Buffer | null
	): Promise<User> {
		const user = await Users.create({
			username,
			email,
			password: hashedPassword,
			description,
			photo,
		});
		return user;
	}

	async getFriends(username: string): Promise<string[]> {
		const user = await this.getUserByUsername(username);
		const friends = user.friends
		return friends;

	}

	async getFriendsRequests(username: string): Promise<string[]> {
		const user = await this.getUserByUsername(username);
		return user.friendsRequests;
	}
}
