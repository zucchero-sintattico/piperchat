import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { jwtMiddleware } from "../utils/jwt-middleware";

const userController = new UserController();

/**
 * The router of a generic entity.
 */
const userRouter = Router();

userRouter.route("/login").post((req, res) => userController.login(req, res));
userRouter.route("/logout").post((req, res) => userController.logout(req, res));

userRouter
	.route("/register")
	.post((req, res) => userController.register(req, res));

userRouter.use("/refresh-token", jwtMiddleware);
userRouter
	.route("/refresh-token")
	.post((req, res) => userController.refreshToken(req, res));

export { userRouter };
