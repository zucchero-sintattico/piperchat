import { Messages } from "../models/server-model";
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

  async getMessageFromSender(req: Request, res: Response) {
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
