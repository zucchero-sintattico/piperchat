import { Request, Response, Router } from "express";
import { FriendsController } from "../../controllers/friends/friends-controller";
import { FriendsControllerImpl } from "../../controllers/friends/friends-controller-impl";
import { jwtValidTokenRequired } from "../../utils/jwt";

const friendsController: FriendsController = new FriendsControllerImpl();

export const friendsRouter = Router();
friendsRouter.use(jwtValidTokenRequired);

friendsRouter.route("/").get((req: Request, res: Response) => {
	friendsController
		.getFriends(req.user.username)
		.then((friends) => {
			return res.status(200).json({ friends: friends });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

friendsRouter.route("/").post((req: Request, res: Response) => {
	friendsController
		.sendFriendRequest(req.user.username, req.body.friend)
		.then(() => {
			return res.status(200).json({ message: "Friend added" });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

friendsRouter.route("accept").post((req: Request, res: Response) => {
	friendsController
		.acceptFriendRequest(req.user.username, req.body.friend)
		.then(() => {
			return res.status(200).json({ message: "Friend added" });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});
