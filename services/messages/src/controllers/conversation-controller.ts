import { Conversations } from "@models/chat-model";
import { Request, Response } from "express";
import { ConversationsRepository } from "@repositories/conversation-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class ConversationsController {
  // The repository is a private property of the controller.
  private conversationRepository: ConversationsRepository =
    new ConversationsRepository();

  // The events repository is a private property of the controller.
  /*  private conversationEventsRepository: MessageEventsRepository =
    new MessageEventsRepository(); */

  async getConversationFromUsername(req: Request, res: Response) {
    res.json(
      await this.conversationRepository.getConversationsByUsername(
        req.user.username
      )
    );
  }

  async createConversation(req: Request, res: Response) {
    const { participants } = req.body;
    const conversation = await this.conversationRepository.createConversation(
      participants
    );
    res.json(conversation);
  }

  async getConversations(req: Request, res: Response) {
    res.json(await this.conversationRepository.getAllConversations());
  }

  async deleteConversation(req: Request, res: Response) {
    const { name } = req.params;
    res.json(await this.conversationRepository.deleteConversation(name));
  }
}
