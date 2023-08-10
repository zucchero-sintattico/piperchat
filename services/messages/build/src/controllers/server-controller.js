"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const server_repository_1 = require("../repositories/server-repository");
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
class MessageController {
    // The repository is a private property of the controller.
    serverRepository = new server_repository_1.ServersRepository();
    // The events repository is a private property of the controller.
    async getServerById(req, res) {
        const { id } = req.params;
        const servers = await this.serverRepository.getServerById(id);
        res.json(servers);
    }
    async createServer(req, res) {
        const { name, description, members, channels } = req.body;
        const creator = req.user.username;
        const server = await this.serverRepository.createServer(name, description, creator, members, channels);
        res.json(server);
    }
    async getAllServers(req, res) {
        res.json(await this.serverRepository.getAllServers());
    }
    async deleteServer(req, res) {
        const { id } = req.params;
        res.json(await this.serverRepository.deleteServer(id));
    }
    async updateServer(req, res) {
        const { id } = req.params;
        const { name, description, members, channels } = req.body;
        res.json(await this.serverRepository.updateServer(name, description));
    }
    async addMember(req, res) {
        const { name } = req.params;
        const { member } = req.body;
        res.json(await this.serverRepository.addMemberToServer(name, member));
    }
    async removeMember(req, res) {
        const { name } = req.params;
        const { member } = req.body;
        res.json(await this.serverRepository.addMemberToServer(name, member));
    }
    async addChannel(req, res) {
        const { name } = req.params;
        const { channel } = req.body;
        res.json(await this.serverRepository.addChannelToServer(name, channel));
    }
    async removeChannel(req, res) {
        const { name } = req.params;
        const { channel } = req.body;
        res.json(await this.serverRepository.removeChannelFromServer(name, channel));
    }
}
exports.MessageController = MessageController;
