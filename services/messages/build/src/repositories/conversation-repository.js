"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsRepository = void 0;
const chat_model_1 = require("../models/chat-model");
/**
 * The repository of the conversation entity.
 */
class ConversationsRepository {
    async getMessagesFromConversation(conversationId) {
        return await chat_model_1.Conversations.find({ name: conversationId }).select("messages");
    }
    async getConversationsByUsername(username) {
        return await chat_model_1.Conversations.find({ participants: username });
    }
    async createConversation(participants) {
        const conversation = new chat_model_1.Conversations({
            participants: participants,
        });
        return await conversation.save();
    }
    async deleteConversation(name) {
        await chat_model_1.Conversations.deleteOne({ name: name });
    }
    async getAllConversations() {
        const QUERY_LIMIT = 1000;
        return await chat_model_1.Conversations.find().limit(QUERY_LIMIT);
    }
    async addMessageToConversation(name, message) {
        const conversation = await chat_model_1.Conversations.findOne({ name: name });
        if (!conversation) {
            return null;
        }
        conversation.messages.push(message);
        return await conversation.save();
    }
}
exports.ConversationsRepository = ConversationsRepository;
