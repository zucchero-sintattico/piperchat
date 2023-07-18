import { Router } from "express";
import { MessageController } from "../controllers/message-controller";
import { ConversationsController } from "../controllers/conversation-controller";

const messageController = new MessageController();
const conversationsController = new ConversationsController();
/**
 * The router of a generic entity.
 */
const messageRouter = Router();

// TODO: ServerRoutes, ChannelRoutes, MessageRoutes, ConversationRoutes

messageRouter
  .route("/messages")
  .get(messageController.getAllMessages.bind(messageController))
  .post(messageController.createMessage.bind(messageController));

messageRouter
  .route("/messages/:username")
  .get(messageController.getMessageFromSender.bind(messageController));

export { messageRouter as entityRouter };
