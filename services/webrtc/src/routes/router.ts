import { Router } from "express";
import { sessionRouter } from "./session-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("", sessionRouter);

export { serviceRouter };
