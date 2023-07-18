import { Router } from "express";
import { entityRouter } from "./monitoring-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("/entity", entityRouter);

export { serviceRouter };
