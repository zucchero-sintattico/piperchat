import { Router } from "express";
import { SessionController } from "../controllers/entity-controller";

const sessionController = new SessionController();

/**
 * The router of a generic entity.
 */
const sessionRouter = Router();

export { sessionRouter };
