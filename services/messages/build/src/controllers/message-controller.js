"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const message_events_repository_1 = require("../events/repositories/message-events-repository");
const message_repository_1 = require("../repositories/message-repository");
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
class MessageController {
    // The repository is a private property of the controller.
    messageRepository = new message_repository_1.MessageRepository();
    // The events repository is a private property of the controller.
    messageEventsRepository = new message_events_repository_1.MessageEventsRepository();
    async getMessageFromSender(req, res) {
        const { sender } = req.params;
        res.json(await this.messageRepository.getMessagesFromSender(sender));
    }
    async createMessage(req, res) {
        const { sender, content } = req.body;
        const message = await this.messageRepository.createMessage(sender, content);
        res.json(message);
    }
    async getAllMessages(req, res) {
        res.json(await this.messageRepository.getAllMessages());
    }
}
exports.MessageController = MessageController;
