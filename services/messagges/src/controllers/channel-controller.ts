import { Request, Response } from "express";
import { ChannelRepository } from "../repositories/channel-repository";
export class ChannelController {
  // The repository is a private property of the controller.
  private channelRepository: ChannelRepository = new ChannelRepository();

  // The events repository is a private property of the controller.
  async getChannelByServerId(req: Request, res: Response) {
    const { id } = req.params;
    const channels = await this.channelRepository.getChannelsFromServer(id);
    res.json(channels);
  }

  async createChannel(req: Request, res: Response) {
    const { serverId, name, type, description, members } = req.body;
    const creator = req.user.username;
    const channel = await this.channelRepository.createChannel(
      serverId,
      name,
      type,
      description,
      creator,
      members
    );
    res.json(channel);
  }
}
