"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsController = void 0;
const conversation_repository_1 = require("../repositories/conversation-repository");
/**
 * The controller of a generic entity.
 * It is responsible for handling the requests and responses from Express.
 * It is also responsible for publishing events to the message broker.
 */
class ConversationsController {
    // The repository is a private property of the controller.
    conversationRepository = new conversation_repository_1.ConversationsRepository();
    // The events repository is a private property of the controller.
    /*  private conversationEventsRepository: MessageEventsRepository =
      new MessageEventsRepository(); */
    async getConversationFromUsername(req, res) {
        res.json(await this.conversationRepository.getConversationsByUsername(req.user.username));
    }
    async createConversation(req, res) {
        const { participants } = req.body;
        const conversation = await this.conversationRepository.createConversation(participants);
        res.json(conversation);
    }
    async getConversations(req, res) {
        res.json(await this.conversationRepository.getAllConversations());
    }
    async deleteConversation(req, res) {
        const { name } = req.params;
        res.json(await this.conversationRepository.deleteConversation(name));
    }
}
exports.ConversationsController = ConversationsController;
