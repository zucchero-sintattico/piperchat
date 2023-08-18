import { Router } from "express";
import { infraServiceMiddleware } from "@piperchat/commons";
import { sessionRouter } from "./routers/sessionRouter";

export const serviceRouter = Router();
serviceRouter.use(infraServiceMiddleware);

serviceRouter.use("/session", sessionRouter);
