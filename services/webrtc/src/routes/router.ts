import { Router } from "express";
import { infraServiceMiddleware } from "../../../commons/utils/infra-service-middleware";
import { sessionRouter } from "./routers/sessionRouter";

export const serviceRouter = Router();
serviceRouter.use(infraServiceMiddleware);

serviceRouter.use("/session", sessionRouter);
