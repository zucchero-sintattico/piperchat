import { Router } from "express";
import { serverRouter } from "./routers/server-router";
import { messageChannelRouter } from "./routers/message-channel-router";
import { multimediaChannelRouter } from "./routers/multimedia-channel-router";
import { jwtValidTokenRequired } from "../utils/jwt";

const serviceRouter = Router();
serviceRouter.use(jwtValidTokenRequired);

// Register all routers
serviceRouter.use("/server", serverRouter);
serviceRouter.use("/message-channel", messageChannelRouter);
serviceRouter.use("/multimedia-channel", multimediaChannelRouter);

export { serviceRouter };
