import { Users } from "../../models/user-model";
import { UserController } from "./user-controller";

export class UserControllerImpl implements UserController {
	async deleteUser(username: string, author: string): Promise<void> {
		if (username !== author) {
			throw new Error("Unauthorized");
		}
		await Users.deleteOne({ username: username });
	}

	async getUserStatus(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	async setUserPhoto(username: string, photo: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async getUserPhoto(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	async setUserDescription(
		username: string,
		description: string
	): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async getUserDescription(username: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
}
