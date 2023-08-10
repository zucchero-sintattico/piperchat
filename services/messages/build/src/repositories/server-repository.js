"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersRepository = void 0;
const chat_model_1 = require("../models/chat-model");
class ServersRepository {
    async getServerById(id) {
        const server = await chat_model_1.Servers.findOne({ id: id });
        return server;
    }
    async getServerByName(name) {
        const server = await chat_model_1.Servers.findOne({ name: name });
        return server;
    }
    async getServersByUsername(username) {
        const server = await chat_model_1.Servers.find({ members: username });
        return server;
    }
    async createServer(name, description, creator, members, channels) {
        const server = new chat_model_1.Servers({
            name: name,
            description: description,
            creator: creator,
            members: members,
            channels: channels,
        });
        return await server.save();
    }
    async updateServer(name, description) {
        return await chat_model_1.Servers.updateOne({ name: name, description: description });
    }
    async deleteServer(serverId) {
        return await chat_model_1.Servers.deleteOne({ id: serverId });
    }
    async getAllServers() {
        const QUERY_LIMIT = 1000;
        return await chat_model_1.Servers.find().limit(QUERY_LIMIT);
    }
    async addMemberToServer(id, member) {
        const server = await chat_model_1.Servers.findOne({ id: id });
        if (!server) {
            return null;
        }
        server.members.push(member.toString());
        return await server.save();
    }
    async removeMemberFromServer(id, member) {
        const server = await chat_model_1.Servers.findOne({ id: id });
        if (!server) {
            return null;
        }
        server.members = server.members.filter((m) => m != member);
        return await server.save();
    }
    async addChannelToServer(id, channel) {
        const server = await chat_model_1.Servers.findOne({ id: id });
        if (!server) {
            return null;
        }
        server.channels.push(channel);
        return await server.save();
    }
    async removeChannelFromServer(id, channel) {
        const server = await chat_model_1.Servers.findOne({ id: id });
        if (!server) {
            return null;
        }
        server.channels.remove(channel);
        return await server.save();
    }
}
exports.ServersRepository = ServersRepository;
