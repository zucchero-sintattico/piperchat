import { Router } from "express";
import { MessageController } from "../controllers/message-controller";
import { ConversationsController } from "../controllers/conversation-controller";

const messageController = new MessageController();
const conversationsController = new ConversationsController();
/**
 * The router of a generic entity.
 */
const messageRouter = Router();

messageRouter
	.route("/messages");

messageRouter
	.route("/messages/:id")
	.get(conversationsController.getConversation.bind(conversationsController))
	.post(messageController.sendMessaage.bind(messageController))

export { messageRouter as entityRouter };
