import { Router } from "express";
import { DirectRouter } from "./message-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("/users", DirectRouter);

export { serviceRouter };
