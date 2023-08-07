import { Users } from "../../models/user-model";
import { UserRepository } from "../../repositories/user/user-repository";
import { UserRepositoryImpl } from "../../repositories/user/user-repository-impl";
import { UserController, UserStatusInfo } from "./user-controller";

export class UserControllerImpl implements UserController {
	private userRepository: UserRepository = new UserRepositoryImpl();

	async deleteUser(username: string, author: string): Promise<void> {
		if (username !== author) {
			throw new Error("Unauthorized");
		}
		await this.userRepository.deleteUser(username);
		await Users.deleteOne({ username: username });
	}

	async getUserStatus(username: string): Promise<UserStatusInfo> {
		const user = await this.userRepository.getUserByUsername(username);
		return {
			online: user.online,
			lastActive: user.lastActive,
		} as UserStatusInfo;
	}

	async setUserPhoto(username: string, photo: string): Promise<void> {
		await this.userRepository.setUserPhoto(username, photo);
	}

	async getUserPhoto(username: string): Promise<Buffer> {
		return await this.userRepository.getUserPhoto(username);
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
