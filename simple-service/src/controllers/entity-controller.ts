import { Entity } from "../models/entity-model";
import { Request, Response } from "express";
import { EntityEvents } from "../events/entity-events";

export class EntityController {
	async getEntities(req: Request, res: Response) {
		const entities = await Entity.find();
		res.json(entities);
	}

	async getEntityById(req: Request, res: Response) {
		const entity = await Entity.findById(req.params.id);
		res.json(entity);
	}

	async createEntity(req: Request, res: Response) {
		const entity = new Entity(req.body);
		await entity.save();
		res.json(entity);
		EntityEvents.publishEntityCreated(entity);
	}

	async updateEntity(req: Request, res: Response) {
		const updated = await Entity.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updated);
		EntityEvents.publishEntityUpdated(updated);
	}
}
