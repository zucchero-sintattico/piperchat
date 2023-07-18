import { Router } from "express";
import { MessageController as ConversationController } from "../controllers/message-controller";
import { ConversationsController } from "../controllers/conversation-controller";

const conversationController = new ConversationsController();
/**
 * The router of a generic entity.
 */
const conversationRouter = Router();

// TODO: ServerRoutes, ChannelRoutes, MessageRoutes, ConversationRoutes

conversationRouter
  .route("/conversation")
  .get(conversationController.getConversations.bind(conversationController))
  .post(conversationController.createConversation.bind(conversationController));

conversationRouter
  .route("/conversation/:username")
  .get(
    conversationController.getConversationFromUsername.bind(
      conversationController
    )
  );

conversationRouter
  .route("/conversation/:name")
  .delete(
    conversationController.deleteConversation.bind(conversationController)
  );

export { conversationRouter };
