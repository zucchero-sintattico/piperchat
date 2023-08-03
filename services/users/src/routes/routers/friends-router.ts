import e, { Request, Response, Router } from "express";
import { FriendsController } from "../../controllers/friends/friends-controller";
import { FriendsControllerImpl } from "../../controllers/friends/friends-controller-impl";
import { jwtValidTokenRequired } from "../../utils/jwt";

const friendsController: FriendsController = new FriendsControllerImpl();


enum FriendRequestAction {
	send = "send",
	accept = "accept",
	deny = "deny",
}


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

friendsRouter.route("/requests").post(async (req: Request, res: Response) => {
	if (!req.body.to) {
		return res.status(400).json({ message: "Missing 'to' parameter in body" });
	}
	if (!req.body.action) {
		return res.status(400).json({ message: "Missing 'action' parameter in body" });
	}
	if (!Object.values(FriendRequestAction).includes(req.body.action)) {
		return res.status(400).json({ message: "Invalid 'action' parameter in body" });
	}

	if (req.body.action === FriendRequestAction.send) {
		try {
			await friendsController
				.sendFriendRequest(req.user.username, req.body.to)
			return res.status(200).json({ message: "Friend added" });
		} catch (e: any) {
			return res.status(404).json({ message: "Error 404", error: e.message });
		}
	} else if (req.body.action === FriendRequestAction.accept) {
		try {
			await friendsController
				.acceptFriendRequest(req.user.username, req.body.to)
			return res.status(200).json({ message: "Friend request accepted" });
		} catch (e: any) {
			return res.status(404).json({ message: "Error 404", error: e.message });
		}
	} else if (req.body.action === FriendRequestAction.deny) {
		try {
			await friendsController
				.denyFriendRequest(req.user.username, req.body.to)
			return res.status(200).json({ message: "Friend request denied" });
		} catch (e: any) {
			return res.status(404).json({ message: "Error 404", error: e.message });
		}
	}

});



