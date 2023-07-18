import { Router } from "express";
import { userRouter } from "./user-router";

const serviceRouter = Router();

// Register all routers
serviceRouter.use("", userRouter);

export { serviceRouter };
