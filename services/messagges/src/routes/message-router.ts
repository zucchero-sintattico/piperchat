import { Router } from "express";
import { MessageController } from "../controllers/message-controller";

const messageController = new MessageController();

/**
 * The router of a generic entity.
 */
const messageRouter = Router();

messageRouter
	.route("/messages")
	.get(messageController.getEntities.bind(messageController))
	.post(messageController.createEntity.bind(messageController));

messageRouter
	.route("messages/:id")
	.get(messageController.getEntityById.bind(messageController))
	.put(messageController.updateEntity.bind(messageController))
	.delete(messageController.deleteEntity.bind(messageController));

export { messageRouter as entityRouter };
