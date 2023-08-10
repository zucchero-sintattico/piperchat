import { Request, Response } from "express";
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export declare class ConversationsController {
    private conversationRepository;
    getConversationFromUsername(req: Request, res: Response): Promise<void>;
    createConversation(req: Request, res: Response): Promise<void>;
    getConversations(req: Request, res: Response): Promise<void>;
    deleteConversation(req: Request, res: Response): Promise<void>;
}
