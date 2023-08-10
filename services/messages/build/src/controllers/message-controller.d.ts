import { Request, Response } from "express";
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export declare class MessageController {
    private messageRepository;
    private messageEventsRepository;
    getMessageFromSender(req: Request, res: Response): Promise<void>;
    createMessage(req: Request, res: Response): Promise<void>;
    getAllMessages(req: Request, res: Response): Promise<void>;
}
