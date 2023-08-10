"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRouter = void 0;
const express_1 = require("express");
const message_controller_1 = require("../controllers/message-controller");
const conversation_controller_1 = require("../controllers/conversation-controller");
const messageController = new message_controller_1.MessageController();
const conversationsController = new conversation_controller_1.ConversationsController();
/**
 * The router of a generic entity.
 */
const messageRouter = (0, express_1.Router)();
exports.entityRouter = messageRouter;
// TODO: ServerRoutes, ChannelRoutes, MessageRoutes, ConversationRoutes
messageRouter
    .route("/messages")
    .get(messageController.getAllMessages.bind(messageController))
    .post(messageController.createMessage.bind(messageController));
messageRouter
    .route("/messages/:username")
    .get(messageController.getMessageFromSender.bind(messageController));
