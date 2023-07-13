import { Router } from "express";
import { UserController } from "../controllers/user-controller";

const userController = new UserController();

/**
 * The router of a generic entity.
 */
const userRouter = Router();

userRouter
	.route("/register")
	.post((req, res) => userController.register(req, res));

userRouter.route("/login").post((req, res) => userController.login(req, res));

export { userRouter };
