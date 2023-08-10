import { Router } from "express";
import { notificationRouter } from "./routers/notification-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("/notifications", notificationRouter);

export { serviceRouter };
