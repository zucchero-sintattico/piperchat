import { Router } from "express";
import { serverRouter } from "./routers/server-router";
import { channelRouter } from "./routers/channel-router";
import { jwtValidTokenRequired } from "../utils/jwt";

const serviceRouter = Router();
serviceRouter.use(jwtValidTokenRequired);

// Register all routers
serviceRouter.use("/servers/:serverId/channels", channelRouter);
serviceRouter.use("/servers", serverRouter);

export { serviceRouter };
