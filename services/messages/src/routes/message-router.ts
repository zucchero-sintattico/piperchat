import { Router } from "express";
import { Direct, Message } from "../models/chat-model";
import { DirectController } from "../controllers/direct/direct-controller";
import { DirectControllerImpl } from "../controllers/direct/direct-controller-impl";
import { DirectRepository } from "../repositories/direct/direct-repository";
import { DirectRepositoryImpl } from "../repositories/direct/direct-repository-impl";
import { jwtValidTokenRequired } from "../utils/jwt";

const directController: DirectController = new DirectControllerImpl();
const directRouter = Router();
directRouter.use(jwtValidTokenRequired);


export { directRouter as DirectRouter };

directRouter.get(":username/messages", async (req, res) => {
    const username1 = req.user.username;
    const username2 = req.params.username;
    const directMessages: Message[] = await directController.getDirectMessages(username1, username2);
    res.status(200).json(directMessages);
});



// const messageController = 
// const conversationsController = new ConversationsController();
// /**
//  * The router of a generic entity.
//  */
// const messageRouter = Router();

// // TODO: ServerRoutes, ChannelRoutes, MessageRoutes, ConversationRoutes

// messageRouter
//   .route("/messages")
//   .get(messageController.getAllMessages.bind(messageController))
//   .post(messageController.createMessage.bind(messageController));

// messageRouter
//   .route("/messages/:username")
//   .get(messageController.getMessageFromSender.bind(messageController));

// export { messageRouter as entityRouter };
