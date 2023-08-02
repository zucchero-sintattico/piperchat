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

friendsRouter.route("/requests").get((req: Request, res: Response) => {
	friendsController
		.getFriendsRequests(req.user.username)
		.then((requests) => {
			return res.status(200).json({ requests: requests });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});

friendsRouter.route("/requests").post((req: Request, res: Response) => {
	if (!req.body.to) {
		return res.status(400).json({ message: "Missing 'to' parameter in body" });
	}
	friendsController
		.sendFriendRequest(req.user.username, req.body.to)
		.then(() => {
			return res.status(200).json({ message: "Friend added" });
		})
		.catch((e) => {
			return res.status(404).json({ message: "User not found", error: e });
		});
});



