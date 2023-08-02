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
	sendFriendRequest(username: string, friendUsername: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
