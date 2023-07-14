import { Messages } from "../models/message-model";
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

	async getConversation(req: Request, res: Response) {
		const { id } = req.params;
		res.send();
	}

	async sendMessaage(req: Request, res: Response) {
		const { id } = req.params;
		const { content } = req.body;
		const { username } = req.user;
		await this.messageRepository.sendMessage(id, content, username);
		res.send();
	}

}
