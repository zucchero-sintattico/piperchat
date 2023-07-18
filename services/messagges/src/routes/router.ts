import { Router } from "express";
import { messageRouter } from "./message-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use(messageRouter);

export { serviceRouter };
