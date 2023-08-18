import { Router } from "express";
import { EntityController } from "@controllers/monitoring-controller";

const entityController = new EntityController();

/**
 * The router of a generic entity.
 */
const entityRouter = Router();

entityRouter
	.route("/")
	.get(entityController.getEntities.bind(entityController))
	.post(entityController.createEntity.bind(entityController));

entityRouter
	.route("/:id")
	.get(entityController.getEntityById.bind(entityController))
	.put(entityController.updateEntity.bind(entityController))
	.delete(entityController.deleteEntity.bind(entityController));

export { entityRouter };
