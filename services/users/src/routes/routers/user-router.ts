import { Request, Response, Router } from "express";
import { UserController } from "../../controllers/user/user-controller";
import { UserControllerImpl } from "../../controllers/user/user-controller-impl";
import { jwtValidTokenRequired } from "../../utils/jwt";

const userController: UserController = new UserControllerImpl();

export const userRouter = Router();
userRouter.use(jwtValidTokenRequired);

userRouter.route(":username").delete((req: Request, res: Response) => {
	userController
		.deleteUser(req.params.username, req.user.username)
		.then(() => {
			return res.status(200).json({ message: "User deleted" });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

userRouter.route(":username/status").get((req: Request, res: Response) => {
	userController
		.getUserStatus(req.params.username)
		.then((status) => {
			return res.status(200).json({ status: status });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

userRouter.route(":username/photo").get((req: Request, res: Response) => {
	userController
		.getUserPhoto(req.params.username)
		.then((photo) => {
			return res.status(200).json({ photo: photo });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

userRouter.route(":username/photo").post((req: Request, res: Response) => {
	if (!req.body.photo) {
		return res.status(400).json({ message: "Missing 'photo' in body" });
	}
	userController
		.setUserPhoto(req.params.username, req.body.photo)
		.then(() => {
			return res.status(200).json({ message: "Photo set" });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

userRouter.route(":username/description").get((req: Request, res: Response) => {
	userController
		.getUserDescription(req.params.username)
		.then((description) => {
			return res.status(200).json({ description: description });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

userRouter
	.route(":username/description")
	.post((req: Request, res: Response) => {
		if (!req.body.description) {
			return res.status(400).json({ message: "Missing 'description' in body" });
		}
		userController
			.setUserDescription(req.params.username, req.body.description)
			.then(() => {
				return res.status(200).json({ message: "Description set" });
			})
			.catch((e) => {
				return res.status(404).json({ message: "User not found", error: e });
			});
	});
