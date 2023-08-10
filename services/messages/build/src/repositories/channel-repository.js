"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelRepository = void 0;
const chat_model_1 = require("../models/chat-model");
class ChannelRepository {
    async getAllChannels() {
        const QUERY_LIMIT = 1000;
        return await chat_model_1.Channels.find().limit(QUERY_LIMIT);
    }
    async createChannel(name, type, description, creator, members) {
        const channel = new chat_model_1.Channels({
            name: name,
            type: type,
            description: description,
            creator: creator,
            members: members,
        });
        return await channel.save();
    }
    async getChannelById(id) {
        const channel = await chat_model_1.Channels.findOne({ id: id });
        return channel;
    }
    async getChannelsByUsername(username) {
        const channel = await chat_model_1.Channels.find({ members: username });
        return channel;
    }
    async updateChannel(channelId, name, description) {
        return await chat_model_1.Channels.updateOne({ id: channelId }, { name: name, description: description });
    }
    async deleteChannel(channelId) {
        return await chat_model_1.Channels.deleteOne({ id: channelId });
    }
    async addMemberToChannel(channelId, member) {
        const channel = await chat_model_1.Channels.findOne({ id: channelId });
        if (!channel) {
            return null;
        }
        channel.members.push(member.toString());
        return await channel.save();
    }
    async removeMemberFromChannel(channelId, member) {
        const channel = await chat_model_1.Channels.findOne({ id: channelId });
        if (!channel) {
            return null;
        }
        channel.members = channel.members.filter((m) => m != member);
        return await channel.save();
    }
    async addMessageToChannel(channelId, message) {
        const channel = await chat_model_1.Channels.findOne({ id: channelId });
        if (!channel) {
            return null;
        }
        channel.messages.push(message);
        return await channel.save();
    }
}
exports.ChannelRepository = ChannelRepository;
