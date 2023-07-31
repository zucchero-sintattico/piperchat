import { Request, Router, Response } from "express";
import { AuthController } from "../controllers/auth/auth-controller";
import { AuthControllerImpl } from "../controllers/auth/auth-controller-impl";
import { jwtInvalidTokenRequired, jwtValidTokenRequired } from "../utils/jwt";

const authController: AuthController = new AuthControllerImpl();

export const authRouter = Router();

/**
 * Register a new user.
 * @route POST /user/register
 */
authRouter.route("/register").post((req: Request, res: Response) => {
	if (!req.body.username || !req.body.password || !req.body.email) {
		return res
			.status(400)
			.json({ message: "Missing username, password or email" });
	}
	authController
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
authRouter.route("/login").post((req: Request, res: Response) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: "Missing username or password" });
	}
	authController
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
authRouter
	.use("/logout", jwtValidTokenRequired)
	.route("/logout")
	.post((req: Request, res: Response) => {
		authController
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
authRouter
	.use("/refresh-token", jwtInvalidTokenRequired)
	.route("/refresh-token")
	.post((req: Request, res: Response) => {
		authController
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

export { authRouter as userRouter };
