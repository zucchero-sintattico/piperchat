import { Router } from "express";
import { EntityController } from "../controllers/entity-controller";

const entityController = new EntityController();

const entityRouter = Router();

entityRouter
	.route("/")
	.get(entityController.getEntities)
	.post(entityController.createEntity);

entityRouter
	.route("/:id")
	.get(entityController.getEntityById)
	.put(entityController.updateEntity);

export { entityRouter };
