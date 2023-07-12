import { User } from "../models/user-model";

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class UserRepository {
	async getUsers() {
		return await User.find();
	}

	async getUserById(id: string) {
		return await User.findById(id);
	}

	async createUser(entity: any) {
		const newEntity = new User(entity);
		await newEntity.save();
		return newEntity;
	}

	async updateUser(id: string, entity: any) {
		return await User.findByIdAndUpdate(id, entity, {
			new: true,
		});
	}

	async deleteUser(id: string) {
		return await User.findByIdAndDelete(id);
	}
}
