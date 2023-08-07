import { Request, Response, Router } from "express";
import {
	UserController,
	UserControllerExceptions,
} from "../../controllers/user/user-controller";
import { UserControllerImpl } from "../../controllers/user/user-controller-impl";
import { JWTAuthenticationMiddleware } from "../../utils/jwt";

const userController: UserController = new UserControllerImpl();

export const usersRouter = Router();
usersRouter.use(JWTAuthenticationMiddleware);

usersRouter.delete("/:username", async (req: Request, res: Response) => {
	try {
		await userController.deleteUser(req.params.username, req.user.username);
		return res.status(200).json({ message: "User deleted" });
	} catch (e: any) {
		if (e instanceof UserControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

usersRouter.get("/:username/status", async (req: Request, res: Response) => {
	try {
		const status = await userController.getUserStatus(req.params.username);
		return res.status(200).json({ status: status });
	} catch (e: any) {
		if (e instanceof UserControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

usersRouter.get("/:username/photo", async (req: Request, res: Response) => {
	try {
		const photo = await userController.getUserPhoto(req.params.username);
		return res.status(200).json({ photo: photo });
	} catch (e: any) {
		if (e instanceof UserControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

usersRouter.post("/:username/photo", async (req: Request, res: Response) => {
	if (!req.body.photo) {
		return res.status(400).json({ message: "Missing 'photo' in body" });
	}
	try {
		await userController.setUserPhoto(req.params.username, req.body.photo);
		return res.status(200).json({ message: "Photo set" });
	} catch (e: any) {
		if (e instanceof UserControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

usersRouter.get(
	"/:username/description",
	async (req: Request, res: Response) => {
		try {
			const description = await userController.getUserDescription(
				req.params.username
			);
			return res.status(200).json({ description: description });
		} catch (e: any) {
			if (e instanceof UserControllerExceptions.UserNotFound) {
				return res.status(404).json({ message: "User not found", error: e });
			} else {
				return res.status(500).json({ message: "Internal server error" });
			}
		}
	}
);

usersRouter.post(
	"/:username/description",
	async (req: Request, res: Response) => {
		if (!req.body.description) {
			return res.status(400).json({ message: "Missing 'description' in body" });
		}
		try {
			await userController.setUserDescription(
				req.params.username,
				req.body.description
			);
			return res.status(200).json({ message: "Description set" });
		} catch (e: any) {
			if (e instanceof UserControllerExceptions.UserNotFound) {
				return res.status(404).json({ message: "User not found", error: e });
			} else {
				return res.status(500).json({ message: "Internal server error" });
			}
		}
	}
);
