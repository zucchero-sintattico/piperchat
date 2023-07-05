import { Entity } from "../models/entity-model";

/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class EntityRepository {
	async getEntities() {
		return await Entity.find();
	}

	async getEntityById(id: string) {
		return await Entity.findById(id);
	}

	async createEntity(entity: any) {
		const newEntity = new Entity(entity);
		await newEntity.save();
		return newEntity;
	}

	async updateEntity(id: string, entity: any) {
		return await Entity.findByIdAndUpdate(id, entity, {
			new: true,
		});
	}

	async deleteEntity(id: string) {
		return await Entity.findByIdAndDelete(id);
	}
}
