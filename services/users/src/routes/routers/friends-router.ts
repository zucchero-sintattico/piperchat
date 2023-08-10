import { Request, Response, Router } from "express";
import {
	FriendsController,
	FriendsControllerExceptions,
} from "../../controllers/friends/friends-controller";
import { FriendsControllerImpl } from "../../controllers/friends/friends-controller-impl";
import { JWTAuthenticationMiddleware } from "commons";

const friendsController: FriendsController = new FriendsControllerImpl();

enum FriendRequestAction {
	send = "send",
	accept = "accept",
	deny = "deny",
}

export const friendsRouter = Router();
friendsRouter.use(JWTAuthenticationMiddleware);

friendsRouter.get("/", async (req: Request, res: Response) => {
	try {
		const friends = await friendsController.getFriends(req.user.username);
		return res.status(200).json({ friends: friends });
	} catch (e: any) {
		if (e instanceof FriendsControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

friendsRouter.get("/requests", async (req: Request, res: Response) => {
	try {
		const requests = await friendsController.getFriendsRequests(
			req.user.username
		);
		return res.status(200).json({ requests: requests });
	} catch (e: any) {
		if (e instanceof FriendsControllerExceptions.UserNotFound) {
			return res.status(404).json({ message: "User not found", error: e });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
});

friendsRouter.post("/requests", async (req: Request, res: Response) => {
	if (!req.body.to) {
		return res.status(400).json({ message: "Missing 'to' parameter in body" });
	}
	if (!req.body.action) {
		return res
			.status(400)
			.json({ message: "Missing 'action' parameter in body" });
	}
	if (!Object.values(FriendRequestAction).includes(req.body.action)) {
		return res
			.status(400)
			.json({ message: "Invalid 'action' parameter in body" });
	}

	switch (req.body.action) {
		case FriendRequestAction.send:
			try {
				await friendsController.sendFriendRequest(
					req.user.username,
					req.body.to
				);
				return res.status(200).json({ message: "Friend request sent" });
			} catch (e: any) {
				if (e instanceof FriendsControllerExceptions.UserNotFound) {
					return res
						.status(404)
						.json({ message: "User not found", error: e.message });
				} else if (
					e instanceof FriendsControllerExceptions.FriendRequestAlreadySent
				) {
					return res.status(409).json({
						message: "Friend request already sent",
						error: e.message,
					});
				}
				return res.status(500).json({ message: "Internal server error" });
			}
		case FriendRequestAction.accept:
			try {
				await friendsController.acceptFriendRequest(
					req.user.username,
					req.body.to
				);
				return res.status(200).json({ message: "Friend request accepted" });
			} catch (e: any) {
				if (e instanceof FriendsControllerExceptions.UserNotFound) {
					return res
						.status(404)
						.json({ message: "User not found", error: e.message });
				} else if (
					e instanceof FriendsControllerExceptions.FriendRequestNotPresent
				) {
					return res.status(404).json({
						message: "Friend request not found",
						error: e.message,
					});
				}
				return res.status(500).json({ message: "Internal server error" });
			}
		case FriendRequestAction.deny:
			try {
				await friendsController.denyFriendRequest(
					req.user.username,
					req.body.to
				);
				return res.status(200).json({ message: "Friend request denied" });
			} catch (e: any) {
				if (e instanceof FriendsControllerExceptions.UserNotFound) {
					return res
						.status(404)
						.json({ message: "User not found", error: e.message });
				} else if (
					e instanceof FriendsControllerExceptions.FriendRequestNotPresent
				) {
					return res.status(404).json({
						message: "Friend request not found",
						error: e.message,
					});
				}
				return res.status(500).json({ message: "Internal server error" });
			}
	}
});
