import { Request, Router, Response } from "express";
import {
	AuthController,
	AuthControllerExceptions,
} from "../../controllers/auth/auth-controller";
import { AuthControllerImpl } from "../../controllers/auth/auth-controller-impl";
import {
	JWTAuthenticationMiddleware,
	JWTRefreshTokenMiddleware,
} from "../../../../commons/jwt";

const authController: AuthController = new AuthControllerImpl();

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
	if (!req.body.username || !req.body.password || !req.body.email) {
		return res
			.status(400)
			.json({ message: "Missing username, password or email" });
	}
	try {
		const user = await authController.register(
			req.body.username,
			req.body.email,
			req.body.password,
			req.body.description,
			req.body.photo
		);
		return res.status(200).json({ message: "Registered", createdUser: user });
	} catch (e: any) {
		if (e instanceof AuthControllerExceptions.UserAlreadyExists) {
			return res.status(409).json({ message: "User already exists" });
		} else {
			return res
				.status(500)
				.json({ message: "Internal Server Error", error: e });
		}
	}
});

authRouter.post("/login", async (req: Request, res: Response) => {
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({ message: "Missing username or password" });
	}
	try {
		const token = await authController.login(
			req.body.username,
			req.body.password
		);
		res.cookie("jwt", token, { httpOnly: true });
		return res.status(200).json({ message: "Logged in" });
	} catch (e: any) {
		if (e instanceof AuthControllerExceptions.InvalidUsernameOrPassword) {
			return res.status(401).json({ message: "Invalid username or password" });
		} else {
			return res
				.status(500)
				.json({ message: "Internal Server Error", error: e });
		}
	}
});

authRouter
	.use(JWTAuthenticationMiddleware)
	.post("/logout", async (req: Request, res: Response) => {
		try {
			if (!req.user) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			await authController.logout(req.user.username);
			res.clearCookie("jwt");
			return res.status(200).json({ message: "Logged out" });
		} catch (e: any) {
			if (e instanceof AuthControllerExceptions.UserNotFound) {
				return res.status(404).json({ message: "User not found" });
			} else {
				return res
					.status(500)
					.json({ message: "Internal Server Error", error: e });
			}
		}
	});

authRouter
	.use(JWTRefreshTokenMiddleware)
	.post("/refresh-token", async (req: Request, res: Response) => {
		try {
			const token = await authController.refreshToken(req.user.username);
			return res
				.status(200)
				.cookie("jwt", token, { httpOnly: true })
				.json({ message: "Refreshed token" });
		} catch (e: any) {
			if (e instanceof AuthControllerExceptions.UserNotFound) {
				return res.status(404).json({ message: "User not found" });
			} else if (e instanceof AuthControllerExceptions.InvalidRefreshToken) {
				return res.status(401).json({ message: "Invalid refresh token" });
			} else if (e instanceof AuthControllerExceptions.RefreshTokenNotPresent) {
				return res.status(401).json({ message: "Refresh token not present" });
			} else {
				return res
					.status(500)
					.json({ message: "Internal Server Error", error: e });
			}
		}
	});
