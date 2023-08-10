import { Request, Response } from "express";
export declare class ChannelController {
    private channelRepository;
    createChannel(req: Request, res: Response): Promise<void>;
    getAllChannels(req: Request, res: Response): Promise<void>;
    getChannelById(req: Request, res: Response): Promise<void>;
    updateChannel(req: Request, res: Response): Promise<void>;
    deleteChannel(req: Request, res: Response): Promise<void>;
    addMember(req: Request, res: Response): Promise<void>;
    removeMember(req: Request, res: Response): Promise<void>;
    addMessage(req: Request, res: Response): Promise<void>;
}
