import { Router } from "express";
import { UserController } from "../controllers/user-controller";

const userController = new UserController();

/**
 * The router of a generic entity.
 */
const userRouter = Router();

userRouter
	.route("/")
	.get(userController.getEntities.bind(userController))
	.post(userController.createEntity.bind(userController));

userRouter
	.route("/:id")
	.get(userController.getEntityById.bind(userController))
	.put(userController.updateEntity.bind(userController))
	.delete(userController.deleteEntity.bind(userController));

export { userRouter };
