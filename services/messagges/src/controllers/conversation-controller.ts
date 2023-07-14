import { Conversations } from "../models/message-model";
import { Request, Response } from "express";
import { MessageEventsRepository } from "../events/repositories/message-events-repository";
import { ConversationsRepository } from "../repositories/conversation-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class ConversationsController {
	// The repository is a private property of the controller.
	private conversationRepository: ConversationsRepository = new ConversationsRepository();

	// The events repository is a private property of the controller.
	private conversationEventsRepository: MessageEventsRepository =
		new MessageEventsRepository();

	async getConversation(req: Request, res: Response) {
		const { id } = req.params;
		const listOfMessages = await this.conversationRepository.getConversation(id, req.user.username);
		res.json(listOfMessages);
	}

	async createConversation(req: Request, res: Response) {
		const { participants } = req.body;
		participants.push(req.user.username);

		const { isAGroup, groupName } = req.body;

		if (isAGroup || participants.length > 2) {
			const conversation = await this.conversationRepository.createConversation(participants, true, groupName);
			res.json(conversation);
			return;
		}

		const conversation = await this.conversationRepository.createConversation(participants);
		res.json(conversation);
	}


}
