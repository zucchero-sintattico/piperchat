import { User } from "../../models/user-model";
import { FriendsController } from "./friends-controller";

export class FriendsControllerImpl implements FriendsController {
	getFriendsRequests(username: string): Promise<string[]> {
		throw new Error("Method not implemented.");
	}
	getFriends(username: string): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	sendFriendRequest(username: string, friendUsername: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	acceptFriendRequest(username: string, friendUsername: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
