import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { jwtInvalidTokenRequired, jwtValidTokenRequired } from "../utils/jwt";

const userController = new UserController();

/**
 * The router of a generic entity.
 */
const userRouter = Router();

userRouter.route("/login").post((req, res) => userController.login(req, res));

userRouter.use("/logout", jwtValidTokenRequired);
userRouter.route("/logout").post((req, res) => userController.logout(req, res));

userRouter
	.route("/register")
	.post((req, res) => userController.register(req, res));

userRouter.use("/refresh-token", jwtInvalidTokenRequired);
userRouter
	.route("/refresh-token")
	.post((req, res) => userController.refreshToken(req, res));

export { userRouter };
