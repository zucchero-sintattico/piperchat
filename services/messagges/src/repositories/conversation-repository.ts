import { Conversations } from "../models/message-model";
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MessageRepository {
	async getEntities() {
		return await Conversations.find();
	}

	async getEntityById(id: string) {
		return await Conversations.findById(id);
	}

	async createEntity(entity: any) {
		const newEntity = new Conversations(entity);
		await newEntity.save();
		return newEntity;
	}

	async updateEntity(id: string, entity: any) {
		return await Conversations.findByIdAndUpdate(id, entity, {
			new: true,
		});
	}

	async deleteEntity(id: string) {
		return await Conversations.findByIdAndDelete(id);
	}
}
