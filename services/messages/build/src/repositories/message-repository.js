"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const chat_model_1 = require("../models/chat-model");
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
class MessageRepository {
    async createMessage(sender, content) {
        const message = new chat_model_1.Messages({
            sender: sender,
            content: content,
        });
        return await message.save();
    }
    async getMessagesFromSender(sender) {
        return await chat_model_1.Messages.find({ sender: sender });
    }
    async getAllMessages() {
        const QUERY_LIMIT = 1000;
        return await chat_model_1.Messages.find().limit(QUERY_LIMIT);
    }
}
exports.MessageRepository = MessageRepository;
