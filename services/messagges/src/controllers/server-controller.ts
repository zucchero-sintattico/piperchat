import { Servers } from "../models/chat-model";
import { Request, Response } from "express";
import { ServersRepository } from "../repositories/server-repository";

/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
export class ServerController {
  // The repository is a private property of the controller.
  private serverRepository: ServersRepository = new ServersRepository();

  // The events repository is a private property of the controller.
  async getServerById(req: Request, res: Response) {
    const { id } = req.params;
    const servers = await this.serverRepository.getServerById(id);
    res.json(servers);
  }

  async getServerByUsername(req: Request, res: Response) {
    const { username } = req.params;
    const servers = await this.serverRepository.getServersByUsername(username);
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

  async getAllServers(req: Request, res: Response) {
    res.json(await this.serverRepository.getAllServers());
  }

  async deleteServer(req: Request, res: Response) {
    const { id } = req.params;
    res.json(await this.serverRepository.deleteServer(id));
  }

  async updateServer(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, members, channels } = req.body;
    res.json(await this.serverRepository.updateServer(name, description));
  }

  async addMember(req: Request, res: Response) {
    const { name } = req.params;
    const { member } = req.body;
    res.json(await this.serverRepository.addMemberToServer(name, member));
  }

  async removeMember(req: Request, res: Response) {
    const { name } = req.params;
    const { member } = req.body;
    res.json(await this.serverRepository.addMemberToServer(name, member));
  }

  async addChannel(req: Request, res: Response) {
    const { name } = req.params;
    const { channel } = req.body;
    res.json(await this.serverRepository.createChannel(name, channel));
  }

  async removeChannel(req: Request, res: Response) {
    const { name } = req.params;
    const { channel } = req.body;
    res.json(
      await this.serverRepository.removeChannelFromServer(name, channel)
    );
  }
}
