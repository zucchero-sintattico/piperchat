import { Entity } from "../models/entity-model";
import { Request, Response } from "express";
import { EntityEvents } from "../events/entity-events";
import { EntityRepository } from "../repositories/entity-repository";

export class EntityController {
	private entityRepository: EntityRepository = new EntityRepository();

	async getEntities(req: Request, res: Response) {
		const entities = await this.entityRepository.getEntities();
		res.json(entities);
	}

	async getEntityById(req: Request, res: Response) {
		const entity = await this.entityRepository.getEntityById(req.params.id);
		res.json(entity);
	}

	async createEntity(req: Request, res: Response) {
		const entity = await this.entityRepository.createEntity(req.body);
		res.json(entity);
		EntityEvents.publishEntityCreated(entity);
	}

	async updateEntity(req: Request, res: Response) {
		const entity = await this.entityRepository.updateEntity(
			req.params.id,
			req.body
		);
		res.json(entity);
		EntityEvents.publishEntityUpdated(entity);
	}
}
