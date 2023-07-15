import { Servers } from "../models/chat-model";
import { Request, Response } from "express";
import { ServersRepository } from "../repositories/server-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class MessageController {
  // The repository is a private property of the controller.
  private serverRepository: ServersRepository = new ServersRepository();

  // The events repository is a private property of the controller.
  async getServerById(req: Request, res: Response) {
    const { id } = req.params;
    const servers = await this.serverRepository.getServerById(
      id,
      req.user.username
    );
    res.json(servers);
  }

  async createServer(req: Request, res: Response) {
    const { name, description, members, channels } = req.body;
    const creator = req.user.username;
    const server = await this.serverRepository.createServer(
      name,
      description,
      creator,
      members,
      channels
    );
    res.json(server);
  }
}
