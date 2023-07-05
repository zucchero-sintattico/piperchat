import { Router } from "express";
import { entityRouter } from "./entity-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("/entity", entityRouter);

export { serviceRouter };
