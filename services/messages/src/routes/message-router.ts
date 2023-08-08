import { Router } from "express";
import { MessageController } from "../controllers/message-controller";
const messageController = new MessageController();

const messageRouter = Router();

messageRouter
  .route("/messages")
  .get(messageController.getAllMessages.bind(messageController))
  .post(messageController.createMessage.bind(messageController));

messageRouter
  .route("/messages/:username/:type")
  .get(messageController.getMessagesForUser.bind(messageController));

export { messageRouter };
