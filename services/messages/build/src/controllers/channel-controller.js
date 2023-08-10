"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelController = void 0;
const channel_repository_1 = require("../repositories/channel-repository");
class ChannelController {
    // The repository is a private property of the controller.
    channelRepository = new channel_repository_1.ChannelRepository();
    // The events repository is a private property of the controller.
    async createChannel(req, res) {
        const { name, type, description, creator, members } = req.body;
        const channel = await this.channelRepository.createChannel(name, type, description, creator, members);
        res.json(channel);
    }
    async getAllChannels(req, res) {
        res.json(await this.channelRepository.getAllChannels());
    }
    async getChannelById(req, res) {
        const { id } = req.params;
        res.json(await this.channelRepository.getChannelById(id));
    }
    async updateChannel(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;
        res.json(await this.channelRepository.updateChannel(id, name, description));
    }
    async deleteChannel(req, res) {
        const { id } = req.params;
        res.json(await this.channelRepository.deleteChannel(id));
    }
    async addMember(req, res) {
        const { id } = req.params;
        const { member } = req.body;
        res.json(await this.channelRepository.addMemberToChannel(id, member));
    }
    async removeMember(req, res) {
        const { id } = req.params;
        const { member } = req.body;
        res.json(await this.channelRepository.removeMemberFromChannel(id, member));
    }
    async addMessage(req, res) {
        const { id } = req.params;
        const { message } = req.body;
        res.json(await this.channelRepository.addMessageToChannel(id, message));
    }
}
exports.ChannelController = ChannelController;
