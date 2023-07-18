import { Router } from "express";
import { messageRouter } from "./message-router";
import { serverRouter } from "./server-router";
import { channelRouter } from "./channel-router";
import { conversationRouter } from "./conversation-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use(messageRouter);
serviceRouter.use(serverRouter);
serviceRouter.use(channelRouter);
serviceRouter.use(conversationRouter);

export { serviceRouter };
