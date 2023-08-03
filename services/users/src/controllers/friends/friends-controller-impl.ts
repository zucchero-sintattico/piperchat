import { json } from "stream/consumers";
import { User } from "../../models/user-model";
import { FriendsController } from "./friends-controller";
import { UserRepositoryImpl } from "../../repositories/user/user-repository-impl";
import { Request, Response } from "express";



export class FriendsControllerImpl implements FriendsController {

	private userRepository = new UserRepositoryImpl;

	async getFriendsRequests(username: string): Promise<string[]> {
		const user = await this.userRepository.getUserByUsername(username);
		return user.friendsRequests;
	}
	async getFriends(username: string): Promise<string[]> {
		const user = await this.userRepository.getUserByUsername(username);
		return user.friends;
	}
	async sendFriendRequest(username: string, friendUsername: string): Promise<void> {
		await this.userRepository.sendFriendRequest(username, friendUsername)
			.catch((e) => {
				throw e.message;
			});
	}
	async acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
		await this.userRepository.acceptFriendRequest(username, friendUsername)
			.catch((e) => {
				throw e.message;
			});
	}
	async denyFriendRequest(username: string, friendUsername: string): Promise<void> {
		await this.userRepository.denyFriendRequest(username, friendUsername)
			.catch((e) => {
				throw e.message;
			});

	}
}
