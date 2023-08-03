import { UserRepository } from "./user-repository";
import { Users, User } from "../../models/user-model";
import e from "express";

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

	async sendFriendRequest(username: string, friendUsername: string): Promise<void> {
		const user = await this.getUserByUsername(username);
		if (user.friends.includes(friendUsername)) {
			throw new Error("Already friends");
		}
		else if (user.friendsRequests.includes(friendUsername)) {
			await Users.findOneAndUpdate({ username: friendUsername }, { $push: { friendsRequests: username } });
			await Users.findOneAndUpdate({ username: username }, { $push: { pendingFriendsRequests: friendUsername } });
		} else {
			throw new Error("User not found or request already exists");
		}
	}

	async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
		const user = await this.getUserByUsername(username);
		if (user.friendsRequests.includes(friendUsername)) {
			await Users.findOneAndUpdate({ username: username }, { $push: { friends: friendUsername } });
			await Users.findOneAndUpdate({ username: friendUsername }, { $push: { friends: username } });
			await Users.findOneAndUpdate({ username: username }, { $pull: { friendsRequests: friendUsername } });
		} else {
			throw new Error("Friend request does not exist");
		}
	}

	async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
		const user = await this.getUserByUsername(username);
		if (user.pendingFriendsRequests.includes(friendUsername)) {
			await Users.findOneAndUpdate({ username: friendUsername }, { $pull: { friendsRequests: user.username } });
			await Users.findOneAndUpdate({ username: username }, { $pull: { pendingFriendsRequests: friendUsername } });
		} else {
			throw new Error("Friend request does not exist");
		}

	}
}
