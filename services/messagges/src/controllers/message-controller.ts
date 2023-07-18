import { Messages } from "../models/chat-model";
import { Request, Response } from "express";
import { MessageEventsRepository } from "../events/repositories/message-events-repository";
import { MessageRepository } from "../repositories/message-repository";
import { ConversationsRepository } from "../repositories/conversation-repository";
import { ServersRepository } from "../repositories/server-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class MessageController {
  // The repository is a private property of the controller.
  private messageRepository: MessageRepository = new MessageRepository();
  private conversationRepository: ConversationsRepository =
    new ConversationsRepository();
  private serverRepository: ServersRepository = new ServersRepository();

  // The events repository is a private property of the controller.
  private messageEventsRepository: MessageEventsRepository =
    new MessageEventsRepository();

  async getMessagesForUser(req: Request, res: Response) {
    const { username, type } = req.params;
    if (type === "sent") {
      res.json(await this.messageRepository.getMessagesFromSender(username));
    } else {
      res.json(
        // merge conversations and channel messages
        await this.conversationRepository.getMessagesForUser(username)
        // await this.serverRepository.getMessagesForUser(username)
      );
    }
  }

  private async getMessageFromSender(req: Request, res: Response) {
    const { sender } = req.params;
    res.json(await this.messageRepository.getMessagesFromSender(sender));
  }

  async createMessage(req: Request, res: Response) {
    const { sender, content } = req.body;
    const message = await this.messageRepository.createMessage(sender, content);
    res.json(message);
  }

  async getAllMessages(req: Request, res: Response) {
    res.json(await this.messageRepository.getAllMessages());
  }
}
