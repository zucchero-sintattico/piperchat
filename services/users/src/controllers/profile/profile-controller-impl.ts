import { ProfileController } from "./profile-controller";
import { UserRepository } from "@repositories/user/user-repository";
import { UserRepositoryImpl } from "@repositories/user/user-repository-impl";

export class ProfileControllerImpl implements ProfileController {
	private userRepository: UserRepository = new UserRepositoryImpl();

	async updateUserPhoto(username: string, photo: Buffer): Promise<void> {
		await this.userRepository.updateUserPhoto(username, photo);
	}

	async updateUserDescription(
		username: string,
		description: string
	): Promise<void> {
		await this.userRepository.updateUserDescription(username, description);
	}
}
