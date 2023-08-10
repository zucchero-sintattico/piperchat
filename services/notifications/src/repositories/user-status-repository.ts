import { UserStatus, UsersStatus } from "../models/user-status-model";

export interface UserStatusRepository {

	/**
	 * Returns the status of a user.
	 * @param username The username of the user.
	 */
	getUser(username: string): Promise<UserStatus>;

	/**
	 * Set the status of a user to offline.
	 * @param username The username of the user.
	 */
	setOffline(username: string): Promise<void>;

	/**
	 * Set the status of a user to online.
	 * @param username The username of the user.
	 */
	setOnline(username: string): Promise<void>;
}

export class UserStatusRepositoryImpl implements UserStatusRepository {

	async getUser(username: string): Promise<UserStatus> {
		return await UsersStatus.findOne({ username: username }).orFail();
	}

	async setOffline(username: string): Promise<void> {
		await UsersStatus.findOneAndUpdate(
			{ username: username },
			{ status: "offline", lastActive: Date.now() },
			{ upsert: true }
		);
	}

	async setOnline(username: string): Promise<void> {
		await UsersStatus.findOneAndUpdate(
			{ username: username },
			{ status: "online" },
			{ upsert: true }
		);
	}
}
