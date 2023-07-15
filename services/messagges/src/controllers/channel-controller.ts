import { Request, Response } from "express";
import { ChannelRepository } from "../repositories/channel-repository";
export class ChannelController {
  // The repository is a private property of the controller.
  private channelRepository: ChannelRepository = new ChannelRepository();

  // The events repository is a private property of the controller.

  async createChannel(req: Request, res: Response) {
    const { name, type, description, creator, members } = req.body;
    const channel = await this.channelRepository.createChannel(
      name,
      type,
      description,
      creator,
      members
    );
    res.json(channel);
  }

  async getAllChannels(req: Request, res: Response) {
    res.json(await this.channelRepository.getAllChannels());
  }

  async getChannelById(req: Request, res: Response) {
    const { id } = req.params;
    res.json(await this.channelRepository.getChannelById(id));
  }
}
