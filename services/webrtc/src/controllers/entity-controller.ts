import { Entity } from "../models/session-model";
import { Request, Response } from "express";
import { EntityEventsRepository } from "../events/repositories/entity-events-repository";
import { SessionRepository } from "../repositories/session-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class EntityController {
	// The repository is a private property of the controller.
	private entityRepository: SessionRepository = new SessionRepository();

	// The events repository is a private property of the controller.
	private entityEventsRepository: EntityEventsRepository =
		new EntityEventsRepository();

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
		this.entityEventsRepository.publishEntityCreated(entity);
	}

	async updateEntity(req: Request, res: Response) {
		const entity = await this.entityRepository.updateEntity(
			req.params.id,
			req.body
		);
		res.json(entity);
		this.entityEventsRepository.publishEntityUpdated(entity);
	}

	async deleteEntity(req: Request, res: Response) {
		const entity = await this.entityRepository.deleteEntity(req.params.id);
		res.json(entity);
		this.entityEventsRepository.publishEntityDeleted(entity);
	}
}
