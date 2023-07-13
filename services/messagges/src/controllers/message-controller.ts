import { MessageEntity } from "../models/message-model";
import { Request, Response } from "express";
import { MessageEventsRepository } from "../events/repositories/message-events-repository";
import { MessageRepository } from "../repositories/message-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class MessageController {
	// The repository is a private property of the controller.
	private messageRepository: MessageRepository = new MessageRepository();

	// The events repository is a private property of the controller.
	private messageEventsRepository: MessageEventsRepository =
		new MessageEventsRepository();

	async getEntities(req: Request, res: Response) {
		const entities = await this.messageRepository.getEntities();
		res.json(entities);
	}

	async getEntityById(req: Request, res: Response) {
		const entity = await this.messageRepository.getEntityById(req.params.id);
		res.json(entity);
	}

	async createEntity(req: Request, res: Response) {
		const entity = await this.messageRepository.createEntity(req.body);
		res.json(entity);
		this.messageEventsRepository.publishNewMessage(entity);
	}

	async updateEntity(req: Request, res: Response) {
		const entity = await this.messageRepository.updateEntity(
			req.params.id,
			req.body
		);
		res.json(entity);
		// TODO
	}

	async deleteEntity(req: Request, res: Response) {
		const entity = await this.messageRepository.deleteEntity(req.params.id);
		res.json(entity);
		// TODO
	}
}
