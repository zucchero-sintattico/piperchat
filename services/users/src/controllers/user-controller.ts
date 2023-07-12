import { User } from "../models/user-model";
import { Request, Response } from "express";
import { UserEventsRepository } from "../events/repositories/user-events-repository";
import { UserRepository } from "../repositories/user-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class UserController {
	// The repository is a private property of the controller.
	private userRepository: UserRepository = new UserRepository();

	// The events repository is a private property of the controller.
	private userEventsRepository: UserEventsRepository =
		new UserEventsRepository();

	async getEntities(req: Request, res: Response) {
		const entities = await this.userRepository.getUsers();
		res.json(entities);
	}

	async getEntityById(req: Request, res: Response) {
		const entity = await this.userRepository.getUserById(req.params.id);
		res.json(entity);
	}

	async createEntity(req: Request, res: Response) {
		const entity = await this.userRepository.createUser(req.body);
		res.json(entity);
		this.userEventsRepository.publishUserCreated(entity);
	}

	async updateEntity(req: Request, res: Response) {
		const entity = await this.userRepository.updateUser(
			req.params.id,
			req.body
		);
		res.json(entity);
		this.userEventsRepository.publishUserUpdated(entity);
	}

	async deleteEntity(req: Request, res: Response) {
		const entity = await this.userRepository.deleteUser(req.params.id);
		res.json(entity);
		this.userEventsRepository.publishUserDeleted(entity);
	}
}
