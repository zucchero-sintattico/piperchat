import { Request, Response } from "express";
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export declare class MessageController {
    private serverRepository;
    getServerById(req: Request, res: Response): Promise<void>;
    createServer(req: Request, res: Response): Promise<void>;
    getAllServers(req: Request, res: Response): Promise<void>;
    deleteServer(req: Request, res: Response): Promise<void>;
    updateServer(req: Request, res: Response): Promise<void>;
    addMember(req: Request, res: Response): Promise<void>;
    removeMember(req: Request, res: Response): Promise<void>;
    addChannel(req: Request, res: Response): Promise<void>;
    removeChannel(req: Request, res: Response): Promise<void>;
}
