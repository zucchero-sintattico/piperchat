import { Router } from "express";
import { infraServiceMiddleware } from "../utils/infra-service-middleware";
import { sessionRouter } from "./session/sessionRouter";

export const serviceRouter = Router();
serviceRouter.use(infraServiceMiddleware);

serviceRouter.use("/session", sessionRouter);
