import { UserStatus } from "../models/user-status-model";
import { UserStatusRepository, UserStatusRepositoryImpl } from "../repositories/user-status-repository";

export class UserNotFoundException extends Error { }

export interface UserStatusController {

    /**
     * Get the status of a user.
     * @param username The username of the user.
     * @throws {UserNotFoundException} If the user does not exist.
     */
    getStatus(username: string): Promise<UserStatus>;
}

export class UserStatusControllerImpl implements UserStatusController {

    private userRepository: UserStatusRepository = new UserStatusRepositoryImpl();

    async getStatus(username: string): Promise<UserStatus> {
        try {
            return await this.userRepository.getUser(username);
        } catch (e) {
            throw new UserNotFoundException();
        }
    }
}
