import { Router } from "express";
import { MessageController } from "../controllers/message-controller";

const messageController = new MessageController();

/**
 * The router of a generic entity.
 */
const messageRouter = Router();

messageRouter
	.route("/messages");

messageRouter
	.route("/messages/:id")
	.get(messageController.getConversation.bind(messageController))
	.post(messageController.sendMessaage.bind(messageController))

export { messageRouter as entityRouter };
