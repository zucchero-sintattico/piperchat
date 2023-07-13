import { MessageEntity } from "../models/message-model";

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MessageRepository {
	async getEntities() {
		return await MessageEntity.find();
	}

	async getEntityById(id: string) {
		return await MessageEntity.findById(id);
	}

	async createEntity(entity: any) {
		const newEntity = new MessageEntity(entity);
		await newEntity.save();
		return newEntity;
	}

	async updateEntity(id: string, entity: any) {
		return await MessageEntity.findByIdAndUpdate(id, entity, {
			new: true,
		});
	}

	async deleteEntity(id: string) {
		return await MessageEntity.findByIdAndDelete(id);
	}
}
