import { Request, Response } from "express";
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export declare class EntityController {
    private entityRepository;
    private entityEventsRepository;
    getEntities(req: Request, res: Response): Promise<void>;
    getEntityById(req: Request, res: Response): Promise<void>;
    createEntity(req: Request, res: Response): Promise<void>;
    updateEntity(req: Request, res: Response): Promise<void>;
    deleteEntity(req: Request, res: Response): Promise<void>;
}
