import { Request, Router, Response } from "express";
import {
	UserController,
	UserControllerImpl,
} from "../controllers/users/user-controller";
import { jwtInvalidTokenRequired, jwtValidTokenRequired } from "../utils/jwt";

const userController: UserController = new UserControllerImpl();

/**
 * The router of the users endpoints.
 */
const userRouter = Router();

/**
 * Register a new user.
 * @route POST /user/register
 */
userRouter.route("/register").post((req: Request, res: Response) => {
	if (!req.body.username || !req.body.password || !req.body.email) {
		return res
			.status(400)
			.json({ message: "Missing username, password or email" });
	}
	userController
		.register(req.body.username, req.body.password, req.body.email)
		.then(() => {
			return res.status(200).json({ message: "Registered" });
		})
		.catch((e) => {
			return res
				.status(500)
				.json({ message: "Internal Server Error", error: e });
		});
});

/**
 * Login a user.
 * @route POST /user/login
 * @body {
 * 		username: string,
 * 		password: string
 * }
 */
userRouter.route("/login").post((req: Request, res: Response) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: "Missing username or password" });
	}
	userController
		.login(req.body.username, req.body.password)
		.then((token) => {
			res.cookie("jwt", token, { httpOnly: true });
			return res.status(200).json({ message: "Logged in" });
		})
		.catch((e) => {
			return res
				.status(401)
				.json({ message: "Invalid username or password", error: e });
		});
});

/**
 * Logout a user.
 * @route POST /user/logout
 * @cookies {
 * 		jwt: string
 * }
 */
userRouter
	.use("/logout", jwtValidTokenRequired)
	.route("/logout")
	.post((req: Request, res: Response) => {
		userController
			.logout(req.user.username)
			.then(() => {
				res.clearCookie("jwt");
				return res.status(200).json({ message: "Logged out" });
			})
			.catch((e) => {
				return res.status(500).json({ message: "Internal Server Error" });
			});
	});

/**
 * Refresh the token of a user.
 * @route POST /user/refresh-token
 * @cookies {
 * 		jwt: string
 * }
 * @returns {
 * 		jwt: string
 * }
 */
userRouter
	.use("/refresh-token", jwtInvalidTokenRequired)
	.route("/refresh-token")
	.post((req: Request, res: Response) => {
		userController
			.refreshToken(req.user.username)
			.then((token) => {
				return res
					.status(200)
					.cookie("jwt", token, { httpOnly: true })
					.json({ message: "Refreshed token" });
			})
			.catch((e) => {
				return res.status(500).json({ message: "Internal Server Error" });
			});
	});

export { userRouter };
