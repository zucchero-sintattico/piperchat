import { Users } from "../../models/user-model";
import { UserRepository } from "../../repositories/user/user-repository";
import { UserRepositoryImpl } from "../../repositories/user/user-repository-impl";
import { UserController, UserStatusInfo } from "./user-controller";

export class UserControllerImpl implements UserController {

	private userRepository: UserRepository = new UserRepositoryImpl();

	async getUserStatus(username: string): Promise<UserStatusInfo> {
		const user = await this.userRepository.getUserByUsername(username);
		return {
			online: user.online,
			lastActive: user.lastActive,
		} as UserStatusInfo;
	}

	async updateUserPhoto(username: string, photo: Buffer): Promise<void> {
		await this.userRepository.updateUserPhoto(username, photo);
	}

	async updateUserDescription(username: string, description: string): Promise<void> {
		await this.userRepository.updateUserDescription(username, description);
	}

	async getUserPhoto(username: string): Promise<Buffer> {
		return await this.userRepository.getUserPhoto(username);
	}

	async getUserDescription(username: string): Promise<string> {
		return await this.userRepository.getUserDescription(username);
	}
}
